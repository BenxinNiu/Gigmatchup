"use strict";

const express = require('express');
const moment=require('moment');
const mongo=require('mongodb').MongoClient;
const mongoose=require('mongoose');
const assert=require('assert');
const bodyparser=require('body-parser');
const fs=require('fs');
const session = require('express-session');
//const MemcachedStore = require('connect-memcached')(session);
const sendgrid=require('sendgrid')('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')
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const config = require('./config');
const path = require('path');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const TwitterStrategy=require('passport-twitter').Strategy;
const app = express();
const mongoURL=config.get('MONGO_URL');
var model;

fs.readdirSync(__dirname+'/mongoose_model').forEach(function(file){
  if(~file.indexOf('.js'))
  model=require(__dirname+'/mongoose_model/'+file);
});


const sessionConfig={
  resave: false,
 saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true
};

if (config.get('NODE_ENV') === 'production') {
  sessionConfig.store = new RedisStore({
  url: config.get('MEMCACHE_URL')
  });
}

// server configuration
//only add code below!!!!

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json()); // for parsing application/json
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', true);
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('I lost connection to redis lab!!!!')) // handle error
  }
  next() // otherwise continue
})

//  This allows cross domain request
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


function profile_infor(profile){
let url='';
if (profile.photos && profile.photos.length) {
    url = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: url
  };
}

function ensure(req,res,next){
  if(req.isAuthenticated()){return next();}
  res.redirect('/login/google?return=/profile');
}

function ensureforActivation(req,res,next){
  if(req.isAuthenticated()){return next();}
  else
  res.redirect('/login/google');
}

function sendError(){
  req.send(500);

}

//passport configuration
passport.use(new GoogleStrategy({
  clientID: config.get('OAUTH2_CLIENT_ID'),
  clientSecret: config.get('OAUTH2_CLIENT_SECRET'),
  callbackURL: config.get('OAUTH2_CALLBACK'),
  accessType: 'offline'
},function(accessToken, refresh,profile, cb){
 let infor=profile_infor(profile);
 var information=model.construct(infor); // extract user information
 var user_profile=model.construct_user_infor(infor); //create user infor mation in the user_infor collection
 mongo.connect(mongoURL,function(err,db){
   if(err)
   sendError();
   else{
     var user=db.collection('userBase');
     var infor_db=db.collection('user_infor');
     user.count({Oauth_ID: infor.id},(err,num)=>{
       if(err)
       sendError();
       else if(num===0){
       user.insert(information,(err,data)=>{
        if (err)
        sendError();
        infor_db.insert(user_profile,(err,data)=>{
         if (err)
         sendError();
        db.close();
        });
       });
     }
       else
        db.close();
      cb(null,infor);
    });
   }
 });
}));
/*
passport.use(new FacebookStrategy({
  clientID: config.get('FACEBOOK_CLIENT_ID'),
  clientSecret: config.get('FACEBOOK_CLIENT_SECRET'),
  callbackURL: config.get('FACEBOOK_CALLBACK'),
  accessType: "offline"
},function(accessToken,refresh,profile,cb){
let infor=profile_infor(profile);
var information=model.construct(infor);
mongo.connect(mongoURL,function(err,db){
  if(err)
  sendError();
  else{
    var user=db.collection('userBase');
    user.count({Oauth_ID: infor.id},(err,num)=>{
      if(err)
      sendError();
      else if(num===0)
      user.insert(information,(err,data)=>{
       if (err)
       sendError();
      db.close();
      });
      else
       db.close();
     cb(null,infor);
   });}});}));

passport.use(new TwitterStrategy({
  clientID: config.get('TWITTER_CLIENT_ID'),
  clientSecret: config.get('TWITTER_CLIENT_SECRET'),
  callbackURL: config.get('TWITTER_CALLBACK'),
  accessType: "offline"
},function(accessToken,refresh,profile,cb){
let infor=profile_infor(profile);
var information=model.construct(infor);
mongo.connect(mongoURL,function(err,db){
  if(err)
  sendError();
  else{
    var user=db.collection('userBase');
    user.count({Oauth_ID: infor.id},(err,num)=>{
      if(err)
      sendError();
      else if(num===0)
      user.insert(information,(err,data)=>{
       if (err)
       sendError();
      db.close();
      });
      else
       db.close();
     cb(null,infor);
   });}});}));
*/
passport.serializeUser((user, cb) =>{
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


// event handling !!
//add event handling code below

app.get('/',ensure,(req,res)=>{
  var query=req.query.Id;
  console.log(query);
 res.send(path.join(__dirname, 'public', 'index.html'))
});

app.get('/adpage',(req,res)=>{
res.sendFile(path.join(__dirname, 'public', 'ad.html'));
});

//add ensure function later
app.get('/profile',ensure,(req,res)=>{
  res.sendFile(path.join(__dirname,'public','profile.html'))
})

app.get('/logout',(req,res)=>{
  req.logout();
  req.session.destroy()
 res.redirect('/');
})

app.get('/login/google',function (req,res,next){
   console.log(req.query.return);
  if(req.query.return){
  req.session.oauth2return=req.query.return;
  }
    next();
},passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback',passport.authenticate('google',{ failureRedirect: '/addsa' }),function(req, res){
  var redirect = req.session.oauth2return+"?user="+req.user.id;
  console.log(redirect);
  delete req.session.oauth2return;
     res.redirect(redirect);
  }
);

app.get('/login/twitter',function (req,res,next){
//  console.log(req.query.return);
  if(req.query.return){
    req.session.oauth2return = req.query.return;
    console.log(req.session.oauth2return);
  }
    next();
},passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/twitter/callback',passport.authenticate('google',{ failureRedirect: '/' }),function(req, res){
  const redirect = req.session.oauth2return+"?user="+req.user.id;
  console.log(redirect);
  delete req.session.oauth2return;
     res.redirect(redirect);
  }
);

app.get('/login/facebook',function (req,res,next){
//  console.log(req.query.return);
  if(req.query.return){
    req.session.oauth2return = req.query.return;
  }
    next();
},passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/facebook/callback',passport.authenticate('google',{ failureRedirect: '/' }),function(req, res){
  const redirect = req.session.oauth2return+"?user="+req.user.id;
//  console.log(redirect);
  delete req.session.oauth2return;
     res.redirect(redirect);
  }
);

app.get('/get_html',(req,res)=>{
  var query=req.query.type;
  switch(query){
    case 'ad_html':
    res.send(fs.readFileSync(__dirname+'/public/temp.html','utf8'))
    break;
  }
});

// send snippet
app.get('/adinfor/:type',(req,res)=>{
  var type=req.params.type;
  var pro=req.query.province;
  var number=Number(req.query.number);
  console.log(type+" "+pro+" "+number);
  mongo.connect(mongoURL,(err,db)=>{
    if (err){ res.send(500);
      db.close();}
    else {
      var ad=db.collection('TempAdbase'); // change to province later

      if (type=='all'){
        var result_array=[];
          ad.find().toArray(function(err,docs){
            if(err){res.send(500); db.close();}
          for (var i=0;i<5&&i<docs.length;i++){
              var data=docs[number+i];
             console.log(data);
            result_array.unshift(data.snippet);
          }
          db.close();
          res.send(result_array);
    });
    }

      else {
      var result_array=[];
        ad.find({"category":type}).toArray((err,docs)=>{
          if(err){res.send(500); db.close();}
        for (var i=0;i<5&&docs.length;i++){
            var data=docs[number+i];
            result_array.unshift(data.snippet);
        }
        db.close();
        res.send(result_array);
        });
      }
    }
  })
});

app.get('/acquire_more/:ad_num',(req,res)=>{
  var id=req.params.ad_num;
  var pos=id.indexOf('N');
  var db_name=id.substring(pos);
  console.log(db_name)
  mongo.connect(mongoURL,(err,db)=>{
    if (err){
      res.send(500);
      db.close();
    }
    else{
  var d=db.collection('TempAdbase');
  d.find({"ID":id}).toArray((err,docs)=>{
    console.log(docs)
    db.close();
  res.send((docs[0]).more);
  })
    }
  })
})

app.get('/user',(req,res)=>{
var Id=req.query.u;
mongo.connect(mongoURL,(err,db)=>{
  if (err){
    res.send(500);
    db.close();
  }
  else{
    var user=db.collection('userBase');
    user.find({Oauth_ID:Id}).toArray(function(err,docs){
      if(err){
        res.send(500);
        db.close();
      }
      else{
        var name=docs[0].name;
        var icon=docs[0].img_url;
        let object={
          name:name,
          img_url:icon
        }
        db.close();
        res.send(object);
      }
    })
  }
})
});

app.post('/post',(req,res)=>{
  var ad_num=req.query.ad;
  var data=req.body;
  mongo.connect(mongoURL,(err,db)=>{
  if (err)
  sendError();
  else{
    var ad=db.collection('TempAdbase');
    ad.count((err,num)=>{
if (err)
sendError();
else{
    var object=model.construct_ad(data,num+1000+data.province);
    ad.insert(object,(err,data)=>{
 if(err)
 sendError();
 else{
 db.close();
 res.send('success');
 }});}});}});});

app.post('/updateprofile/:id',(req,res)=>{
  var user_id=req.params.id;
  var infor=req.body;
  var data=model.update_user_infor(infor);
  mongo.connect(mongoURL,(err,db)=>{
    if(err){db.close(); response.send(500)}
    else{
      var collection=db.collection('user_infor');
      collection.updateOne({clientID:user_id},{$set:{information:data}},(err)=>{
        if (err){db.close(); response.send('failed');}
        else{
          db.close();
          response.send('success');
        }
      });
    }
  });
});

//activate your ad
app.get('/gigmatchup/activation/:province',ensureforActivation,(req,res)=>{

})


var server=app.listen(process.env.PORT || '8080', function(){
  console.log('App is listening on the port %s', server.address().port);
  console.log('You know what to do to quit the server')
})
