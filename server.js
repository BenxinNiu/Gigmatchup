"use strict";
"use strict";

const express = require('express');
const moment=require('moment');
const mongo=require('mongodb').MongoClient;
const assert=require('assert');
const bodyparser=require('body-parser');
const fs=require('fs');
const session=require('express-session');
const MemcachedStore = require('connect-memcached')(session);
const passport = require('passport');
const config = require('./config');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const path = require('path');
//const oauth=require('./authentication')
const app = express();

var mongoURL=config.get('MONGO_URL');

const sessionConfig={
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true
};

if (config.get('NODE_ENV') === 'production') {
  sessionConfig.store = new MemcachedStore({
    hosts: [config.get('MEMCACHE_URL')]
  });
}

function extractProfile(profile){
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

function formatTime(date){
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "/" + date.getHours()+ ":" + date.getMinutes();
}

function ensure(req,res,next){
  if(req.isAuthenticated()){return next();}
  res.redirect('/');
}

passport.use(new GoogleStrategy({
  clientID: config.get('OAUTH2_CLIENT_ID'),
  clientSecret: config.get('OAUTH2_CLIENT_SECRET'),
  callbackURL: config.get('OAUTH2_CALLBACK'),
  accessType: 'offline'
},function(accessToken, refresh,profile, cb){
  cb(null, extractProfile(profile));
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


//app.use(express.static('htmls/Ad'))
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json()); // for parsing application/json
app.use(passport.initialize());
app.use(passport.session());
app.use(session(sessionConfig));

//  This allows cross domain request
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.get('/login/google',function (req,res,next){
//  console.log(req.query.return);
  if(req.query.return){
    req.session.oauth2return = req.query.return;
  }
    next();
},passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback',passport.authenticate('google',{ failureRedirect: '/' }),function(req, res){
  const redirect = req.session.oauth2return+"?user="+req.user.id;
//  console.log(redirect);
  delete req.session.oauth2return;
     res.redirect(redirect);
  }
);

app.get('/',(req,res)=>{
  var query=req.query.Id;
  console.log(query);
 res.sendFile( path.join( __dirname, 'public', 'index.html' ));
});


var server=app.listen(process.env.PORT || '8080', function(){
  console.log('App is listening on the port %s', server.address().port);
  console.log('You know what to do to quit the server')
})
