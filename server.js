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
//const sendgrid=require('sendgrid')('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')
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const config = require('./config');
const path = require('path');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const TwitterStrategy=require('passport-twitter').Strategy;
const app = express();
const mongoURL=config.get('MONGO_URL');
const mailgun=require('mailgun-js')({apiKey: config.get('MAILGUN_API_KEY'), domain: config.get('MAILGUN_DOMAIN')});
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
    image: url,
    login_email:"",
    pwd:""
  };
}

function ensure(req,res,next){
  if(req.isAuthenticated()){return next();}
  res.redirect('/loginpage');
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

app.get('/',(req,res)=>{
 res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/verify',(req,res)=>{
if(req.isAuthenticated())
res.send('yes');
else
res.send('no');
});

app.get('/loginpage',(req,res)=>{
res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/adpage',(req,res)=>{
res.sendFile(path.join(__dirname, 'public', 'ad.html'));
});

//add ensure function later
app.get('/profile',ensure,(req,res)=>{
  let user_id=req.user.id;
  console.log(user_id);
  res.sendFile(path.join(__dirname,'public','profile.html'))
});

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
  //console.log(redirect);
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
      var ad=db.collection(pro); // change to province later
      if (type=='all'){
        var result_array=[];
          ad.find().toArray(function(err,docs){
            if(err){res.send(500); db.close();}
          for (var i=0;i<5&&i<docs.length;i++){
              var data=docs[number+i];
            // console.log(data);
            result_array.unshift(data.snippet);
          }
          db.close();
          res.send(result_array);
    });
    }
      else {
        ad.find({"category":type}).toArray((err,docs)=>{
          var result_array=[];
          if(err){res.send(500); db.close();}
        for (var i=0;i<5&&i<docs.length;i++){
            var data=docs[number+i];
            result_array.unshift(data.snippet);
        }
        ad.find({"ID":type}).toArray(function(err,docs){
          if(err){res.send(500); db.close();}
          for (var i=0;i<5&&docs.length;i++){
              var data=docs[number+i];
              result_array.unshift(data.snippet);
          }
          db.close();
          console.log(result_array);
          res.send(result_array);
        });
        });
      }
    }
  })
});

app.get('/acquire_more/:ad_num',(req,res)=>{
  var id=req.params.ad_num;
  var db_name=id.substring(4);
  console.log(db_name)
  mongo.connect(mongoURL,(err,db)=>{
    if (err){
      res.send(500);
      db.close();
    }
    else{
  var d=db.collection(db_name);
  d.find({"ID":id}).toArray((err,docs)=>{
    console.log(docs)
    db.close();
  res.send((docs[0]).more);
  })
    }
  })
})

// for index.html
app.get('/user',ensure,(req,res)=>{
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
  if(req.isAuthenticated())
  var user_id=req.user.id;
  mongo.connect(mongoURL,(err,db)=>{
  if (err)
  sendError();
  else{
    if(!req.user)
    var ad=db.collection('TempAdbase');
    else{
    var ad=db.collection(data.province);
    var userBase=db.collection('userBase')
  }
    ad.count((err,num)=>{
if (err)
sendError();
else{
  if(req.isAuthenticated()){
    userBase.find({Oauth_ID:user_id}).toArray(function(err,doc){
      if(doc.length!=0){
        var ads=doc[0].Ad_id;
        ads.push(num+1000+data.province);
        userBase.update({Oauth_ID:user_id},{$set:{Ad_id:ads}})
      }
    });
  }
  var code=Math.floor((Math.random() * 10000000) + 1);
    var object=model.construct_ad(data,num+1000+data.province,code);
    var active_link='http://localhost:8080/gigmatchup/activation/'+
    object.ID+"?activation_code="+code+"&email="+object.more.email;
    ad.insert(object,(err,data)=>{
 if(err)
 sendError();
 else{
   if(req.isAuthenticated()){
     var email_content = {
    from: config.get('MAILGUN_FROM'),
    to: object.more.email,
    subject: 'your ad is now on Gigmatchup.ca',
    text: 'Thank you for using Gigmatchup.ca, your ad has been successfully activated'
  };
   }
   else{
     console.log(active_link);
     var email_content = {
    from: config.get('MAILGUN_FROM'),
    to: object.more.email,
    subject: 'Activation link',
    text: 'This email is sent to you because this email address was used to publish an advertisement on Gigmatchup.ca. Please follow the link bleow to activate your ad: '+
    active_link
  };
   }
mailgun.messages().send(email_content, function (err, body) {
  if(err)
  res.send('success');
  else {
    db.close();
    res.send('success');
  }
  console.log(body);
});
 }});}});}});});

app.post('/updateprofile',(req,res)=>{
  var user_id=req.user.id;
  var infor=req.body;
  var data=model.update_user_infor(infor);
  mongo.connect(mongoURL,(err,db)=>{
    if(err){db.close(); res.send(500)}
    else{
      var collection=db.collection('user_infor');
      collection.updateOne({clientID:user_id},{$set:{information:data}},(err)=>{
        if (err){db.close(); res.send('failed');}
        else{
          db.close();
          res.send('success');
        }});}});});

app.get('/getuser',ensure,(req,res)=>{
  let user_id=req.user.id;
  mongo.connect(mongoURL,(err,db)=>{
    if(err){db.close(); res.send(500);}
    else{
      var collection=db.collection('user_infor');
      collection.find({clientID:user_id}).toArray(function(err,doc){
        if(err){db.close(); res.send(500);}
        else{
          var data=doc[0].information;
          console.log(data);
          res.send(data);
        }});}});});

app.get('/manageAd',ensure,(req,res)=>{
  var id=req.user.id;
  mongo.connect(mongoURL,(err,db)=>{
    if(err){db.close(); res.send(500);}
    else{
      var collection=db.collection('userBase');
      collection.find({Oauth_ID:id}).toArray(function(err,doc){
       if(err){db.close(); res.send(500);}
       else{
         var array=doc[0].Ad_id;
         res.send(array);
       }
     });
    }
  })
});

app.get('/deleteAd/:id',ensure,(req,res)=>{
  var user_id=req.user.id;
  var ad_id=req.params.id;
  var ad_name=ad_id.substring(4);
  console.log(ad_name);
  mongo.connect(mongoURL,(err,db)=>{
    if(err){db.close(); res.send(500);}
    else{
      var userBase=db.collection('userBase');
      var ad_base=db.collection(ad_name);
      userBase.find({Oauth_ID: user_id}).toArray(function(err,doc){
        if(err){  db.close(); res.send(500);}
      var ad_array=doc[0].Ad_id;
      var position=ad_array.indexOf(ad_id);
          ad_array.splice(position,1);
      userBase.updateOne({Oauth_ID:user_id},{$set:{Ad_id:ad_array}},(err)=>{
      if(err){db.close(); res.send(500);}
    else{
      ad_base.remove({"ID":ad_id},(err)=>{
        if(err){  db.close(); res.send(500);}
        else{
            db.close();
            res.send('success');
        }
      });
    }});
      });
    }
  });
})

//activate your ad
app.get('/gigmatchup/activation/:id',(req,res)=>{
var email=req.query.email;
var ad_id=req.params.id;
var code=req.query.activation_code;
console.log(ad_id);
console.log(email);
var ad_name=ad_id.substring(4);
console.log(ad_name);
mongo.connect(mongoURL,(err,db)=>{
if(err){db.close(); res.send(500);}
else{
  var adBase=db.collection(ad_name);
  var temp=db.collection('TempAdbase');
  temp.find({"ID":ad_id}).toArray(function(err,doc){
    var activation=doc[0].activeCode;
    if(Number(code)===Number(activation)){
      adBase.insert(doc[0]);
      temp.remove({"ID":ad_id});
      var email_content = {
     from: config.get('MAILGUN_FROM'),
     to: email,
     subject: 'your ad is now on Gigmatchup.ca',
     text: 'Thank you for using Gigmatchup.ca, your ad has been successfully activated'
   };
   mailgun.messages().send(email_content, function (err, body){
     if(err)
     res.send(500);
     else {
       db.close();
       res.redirect('/adpage?search='+ad_id+'&province=newfoundland');
     }
     console.log(body);
   });
    }// if matched
    else{
      res.send("activation failed");
    }
  });
}//mongo else
}); //mongo connect
});


var server=app.listen(process.env.PORT || '8080', function(){
  console.log('App is listening on the port %s', server.address().port);
  console.log('You know what to do to quit the server')
})
