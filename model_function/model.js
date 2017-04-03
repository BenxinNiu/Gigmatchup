const mongo=require('mongodb').MongoClient;


function construct_user(profile){
return {
  Oauth_ID: profile.id,
  name:profile.displayName,
  created_date:Date.now(),
  img_url:profile.url
};
}

module.exports=construct_user;

/*
var ad_infor=new ({
  "ID":Number,
  "url":String,
  "title":String,
  "category":String,
  "description":String,
  "phone":String,
  "email":String,
  "post_date":Date
});

*/
//const user_Profile=mongoose.model('userInformation');
