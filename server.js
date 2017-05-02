"use strict";

const express = require('express');
const moment=require('moment');
const mongo=require('mongodb').MongoClient;
const bodyparser=require('body-parser');
const fs=require('fs');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const config = require('./config');
const path = require('path');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const TwitterStrategy=require('passport-twitter').Strategy;
const LocalStrategy=require('passport-local').Strategy;
const app = express();
const mongoURL=config.get('MONGO_URL');
const mailgun=require('mailgun-js')({apiKey: config.get('MAILGUN_API_KEY'), domain: config.get('MAILGUN_DOMAIN')});
const Multer=require('multer');
var model;
var userInfor;
var storeIMG;

fs.readdirSync(__dirname+'/mongoose_model').forEach(function(file){
   model=require(__dirname+'/mongoose_model/'+'model');
   userInfor=require(__dirname+'/mongoose_model/'+'userInfor');
   storeIMG=require(__dirname+'/mongoose_model/'+'storeIMG');
});

const multer=Multer({
  storage:Multer.MemoryStorage,
  limits:{
  fileSize:5*1024*1024
  }
});

//session configuration
const sessionConfig={
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true
};
if (config.get('NODE_ENV') === 'production') { // production stage??
  sessionConfig.store = new RedisStore({
  url: config.get('MEMCACHE_URL')
  });
}


// server configuration
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json()); // for parsing application/json
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', true);
app.use(function (req, res, next) { // check if session exsits
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


function greetEmail(email_address){
  var email_content = {
  from: config.get('MAILGUN_FROM'),
  to: email_address,
  subject: 'Thank you for choosing Gigmatchup.ca',
  text: 'Hi, We would like to welcome you to join our family. You can now post ad or search talents for your party!'+" Thank you again for choosing Gigmatchup.ca If you have any question or concern, Please do not hesitate to contact us！"
  };
  mailgun.messages().send(email_content, function (err, body) {
    if(err)
  console.log(err)

    console.log(body);
  });
}

function ensure(req,res,next){
  if(req.isAuthenticated()){return next();}
  res.redirect('/loginpage');
}

function sendError(){
  req.send(500);
}

//local passport

passport.use('user_login', new LocalStrategy(
function(username,password,cd){
mongo.connect(mongoURL,(err,db)=>{
var userBase=db.collection('userBase');
var user_infor=db.collection('user_infor');
user_infor.find({'credential.login_email':username}).toArray(function(err,doc){
  if(err){db.close(); cd(null,false);}
  else if(doc.length==0){
    db.close(); cd(null,false);
  }
  else{
    var pwd=doc[0].credential.pwd;
    if(pwd===password){
    var dear_user_infor=userInfor.extract_dear_user(doc[0]);
    db.close();
    return cd(null,dear_user_infor);
    }
    else{
      db.close();
        return cd(null,false);
    }
    }
});
})// mogo connect
}
));


//passport configuration
passport.use(new GoogleStrategy({
  clientID: config.get('OAUTH2_CLIENT_ID'),
  clientSecret: config.get('OAUTH2_CLIENT_SECRET'),
  callbackURL: config.get('OAUTH2_CALLBACK'),
  accessType: 'offline'
},function(accessToken, refresh,profile, cb){
 let infor=userInfor.profile_infor(profile);
 var information=model.construct(infor); // use creat_user for local signup
 var user_profile=model.construct_user_infor(infor); //create user infor mation in the user_infor collection
 mongo.connect(mongoURL,function(err,db){
   if(err)
   sendError();
   else{
     var user=db.collection('userBase');
     var infor_db=db.collection('user_infor');
     user.count({Oauth_ID: infor.id},(err,num)=>{
       if(err){db.close(); cb(null,false)}
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
},function(accessToken, refresh,profile, cb){
 let infor=model.profile_infor(profile);
 var information=model.construct(infor); // use creat_user for local
 var user_profile=model.construct_user_infor(infor); //create user infor mation in the user_infor collection
 mongo.connect(mongoURL,function(err,db){
   if(err)
   sendError();
   else{
     var user=db.collection('userBase');
     var infor_db=db.collection('user_infor');
     user.count({Oauth_ID: infor.id},(err,num)=>{
       if(err){db.close(); cb(null,false)}
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

passport.use(new TwitterStrategy({
  clientID: config.get('TWITTER_CLIENT_ID'),
  clientSecret: config.get('TWITTER_CLIENT_SECRET'),
  callbackURL: config.get('TWITTER_CALLBACK'),
  accessType: "offline"
},function(accessToken, refresh,profile, cb){
 let infor=model.profile_infor(profile);
 var information=model.construct(infor); // use creat_user for local
 var user_profile=model.construct_user_infor(infor); //create user infor mation in the user_infor collection
 mongo.connect(mongoURL,function(err,db){
   if(err)
   sendError();
   else{
     var user=db.collection('userBase');
     var infor_db=db.collection('user_infor');
     user.count({Oauth_ID: infor.id},(err,num)=>{
       if(err){db.close(); cb(null,false)}
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

app.get('/register',(req,res)=>{
res.sendFile(path.join(__dirname,'public','register.html'));
});
// verify if user is logged in
app.get('/verify',(req,res)=>{
if(req.isAuthenticated())
res.send('yes');
else
res.send('no');
});

app.get('/loginpage',(req,res)=>{
res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/postad',(req,res)=>{
res.sendFile(path.join(__dirname, 'public', 'post.html'));
})

app.get('/adpage',(req,res)=>{
res.sendFile(path.join(__dirname, 'public', 'ad.html'));
});

app.get('/forget',(req,res)=>{
res.sendFile(path.join(__dirname,'public','forget.html'))
});

//add ensure function later
app.get('/profile',ensure,(req,res)=>{
  let user_id=req.user.id;
  console.log(user_id);
  res.sendFile(path.join(__dirname,'public','profile.html'))
});

app.get('/logout',ensure,(req,res)=>{
  req.logout();
  req.session.destroy()
 res.redirect('/');
})

app.post('/signup',(req,res)=>{
  var secret=req.body;
  console.log(secret);
  mongo.connect(mongoURL,(err,db)=>{
  var userBase=db.collection('userBase');// change this to temp later if we want activation
  var user_infor=db.collection('user_infor');
  userBase.count((err,num)=>{
  if(err){db.close(); cb(null, false)}
  else{
  var infor=userInfor.create_profile(secret.pwd,secret.login,num); //
  var basic=model.create_user(infor); // use contruct for 3rd party
  var detail=model.construct_user_infor(infor);
  userBase.insert(basic,(err,data)=>{
  if(err){db.close(); res.send(500);}
  else{
    user_infor.insert(detail,(err,data)=>{
    if(err){db.close(); res.send(500);}
      else{db.close();
        greetEmail(secret.login);
        res.send('success');}
    });
  }
  });
  }
  }); // count
  }); // connect
});

app.get('/verify_email/:email',(req,res)=>{
var email={login_email:req.params.email};
mongo.connect(mongoURL,(err,db)=>{
if(err){db.close(); res.send(500);}
var collection=db.collection('userBase');
var is_user=collection.find(email).toArray(function(err,doc){
if(err){db.close(); res.send(500)}
else if(doc.length==0){
  db.close();
  res.send('pass');
}
else{
  db.close();
  res.send('denied');
}
});//find && toArray
});// mongo connect
});

app.post('/login',passport.authenticate('user_login',{failureRedirect:'/loginpage?result=failed'}),(req,res)=>{
res.redirect('/');
});

app.get('/login/google',function (req,res,next){
   console.log(req.query.return);
  if(req.query.return){
  req.session.oauth2return=req.query.return;
  }
    next();
},passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback',passport.authenticate('google',{ failureRedirect: '/login?return=/' }),function(req, res){
  var redirect = req.session.oauth2return+"?user="+req.user.id;
  //console.log(redirect);
  delete req.session.oauth2return;
     res.redirect(redirect);
  }
);
/*
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
*/
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
          for (var i=number;i<number+5&&i<docs.length;i++){
              var data=docs[i];
            result_array.unshift(data.snippet);
            console.log(result_array)
          }
          db.close();
          res.send(result_array);
    });
    }
      else {
        ad.find({"category":type}).toArray((err,docs)=>{
          var ad_found=docs.length;
          var result_array=[];
          if(err){res.send(500); db.close();}
        for (var i=number;i<number+5&&i<docs.length;i++){
            var data=docs[i];
            result_array.unshift(data.snippet);
        }
        ad.find({"ID":type}).toArray(function(err,docs){
          if(err){res.send(500); db.close();}
          for (var i=number;i<number+5&&i<docs.length;i++){
              var data=docs[i];
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

app.get('/test',(req,res)=>{
res.sendFile(path.join(__dirname, 'public', 'img.html'));
});

app.post('/add/img',multer.single('image'),
storeIMG.sendUploadToGCS,(req,res)=>{
  if (req.file && req.file.publicUrl){
        var imageUrl = req.file.publicUrl;
        res.send(imageUrl);
      }
      else
      res.send('fail')
});

app.post('/post',(req,res)=>{
  var data=req.body;
  if(req.isAuthenticated())
  var user_id=req.user.id;

  mongo.connect(mongoURL,(err,db)=>{
  if (err)
  sendError();
  else{
    if(req.isAuthenticated()){
    var ad=db.collection(data.province);
    var userBase=db.collection('userBase');
  }
    else{
        var ad=db.collection('TempAdbase');
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
    var active_link='http://www.gigmatchup.ca/gigmatchup/activation/'+
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
    text: 'This email is sent to you because this email address was used to publish an advertisement on Gigmatchup.ca. Please follow the link bleow to activate your ad: '+active_link
  };
   }
mailgun.messages().send(email_content, function (err, body) {
  if(err)
  res.send('success'); // change later
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

// for profile page
app.get('/getuser',ensure,(req,res)=>{
  let user_id=req.user.id;
  console.log(user_id);
  mongo.connect(mongoURL,(err,db)=>{
    if(err){db.close(); res.send(500);}
    else{
      var collection=db.collection('user_infor');
      collection.find({clientID:user_id}).toArray(function(err,doc){
        if(err){db.close(); res.send(500);}
        else{
          var data=doc[0].information;
          data.img=doc[0].img;
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

app.get('/gigmatchupForgetpassword',(req,res)=>{
  if(req.query.dearuser!==undefined&&req.query.verificationCode!==undefined)
res.sendFile(path.join(__dirname,'public','reset.html'));
else
res.sendStatus(404);
});

//reset password verification
app.post('/reset_pwd',(req,res)=>{
var data=req.body;
console.log(data.pwd);
var email=req.query.dearuser;
var code=req.query.verificationCode;
console.log(email);
console.log(code);
mongo.connect(mongoURL,(err,db)=>{
if(err){db.close(); res.send(500);}
else{
var collection=db.collection('user_infor');
collection.find({'credential.login_email':email}).toArray(function(err,doc){
if(doc.length==0){db.close(); res.send(500);}
else{
var reset_code=doc[0].credential.reset_code;
if(code==reset_code){
  collection.update({'credential.login_email':email},{$set:{'credential.pwd':data.pwd}},function(err){
if(err){db.close();res.send('failed');}
else{
collection.update({'credential.login_email':email},{$set:{'credential.reset_code':""}},function(err){
if(err){db.close();res.send('failed');}
else{
  db.close();
  res.send('success');
}
});
}
  });
}
else{
db.close(); res.send('falied');
}
}
})//to Array
}
});//mongo connect
});

// request a reset pwd code
app.get('/requestResetCode/:ea',(req,res)=>{
var email=req.params.ea;
mongo.connect(mongoURL,(err,db)=>{
if(err){db.close(); res.send(500);}
else{
var collection=db.collection('user_infor');
collection.find({'credential.login_email':email}).toArray(function(err,doc){
if(doc.length==0){db.close(); res.send('noUser')}
else{
var code=model.generate_reset_code();
console.log(code);
var link='http://www.gigmatchup.ca/gigmatchupForgetpassword?dearuser='+email+'&verificationCode='+code;
console.log(link);
collection.update({'credential.login_email':email},{$set:{'credential.reset_code':code}});
var email_content = {
from: config.get('MAILGUN_FROM'),
to: email,
subject: 'Gigmatchup',
text:"Hi, Please follow the link to reset your password: "+link+" Thank you!"
};
mailgun.messages().send(email_content, function (err, body) {
  if(err)
  res.send('success');
  else {
    res.send('success');
  }
  console.log(body);
});
db.close();
}
});
}
});
});

//activate your ad
app.get('/gigmatchup/activation/:id',(req,res)=>{
var email=req.query.email;
var ad_id=req.params.id;
var code=req.query.activation_code;
var ad_name=ad_id.substring(4);
mongo.connect(mongoURL,(err,db)=>{
if(err){db.close(); res.send(500);}
else{
  var adBase=db.collection(ad_name);
  var temp=db.collection('TempAdbase');
  temp.find({"ID":ad_id}).toArray(function(err,doc){
    if(!err&&doc.length!=0){
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
  }
  else{
    db.close();
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
