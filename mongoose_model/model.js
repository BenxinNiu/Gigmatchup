const mongo=require('mongodb').MongoClient;

function formatTime(date){
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "/" + date.getHours()+ ":" + date.getMinutes();
}
function construct_user(profile){
  var date=new Date();
  var formated=formatTime(date);
return {
  Oauth_ID: profile.id,
  name:profile.displayName,
  created_date:formated,
  img_url:profile.image,
  Ad_id:[]
};
}
function create_user(profile){
  var date=new Date();
  var formated=formatTime(date);
return {
  Oauth_ID: profile.id,
  name:profile.displayName,
  created_date:formated,
  img_url:profile.image,
  Ad_id:[]
};
}
function construct_ad(infor,id){
  var date=new Date();
  var formated=formatTime(date);
  return{
  "ID":id,
  "Oauth_ID":"null",
  "active":"false",
  "category":infor.category,
  "snippet":{
    "requested_ad":id,
    "title":infor.Ad_title,
    "category":infor.category,
    "description": infor.description,
    "post_date":formated,
    "location":infor.city+" "+infor.province
  },
  "more":{
    "requested_ad":id,
    "facebook":infor.facebook,
    "twitter":infor.twitter,
    "youtube":infor.youtube,
    "linkedin":infor.linkedin,
    "instagram":infor.instagram,
    "price":infor.pricing,
    "contact_name":infor.contact_name,
    "url":infor.url,
    "phone":infor.phone,
    "email":infor.email,
  }
};
}

function construct_user_infor(profile){
  return {
    clientID:profile.id,
    information:{
      description:"",
      contact_name:"",
      email:"",
      phone:"",
      location:"",
      social:{
      facebook:"",
      twitter:"",
      youtube:"",
      linkedin:"",
      instagram:""
    }
  }
};
}
function update_user_infor(infor){
  return{
    description:infor.a,
    contact_name:infor.b,
    email:infor.c,
    phone:infor.d,
    location:infor.e,
    social:{
    facebook:infor.f.facebook,
    twitter:infor.f.twitter,
    youtube:infor.f.youtube,
    linkedin:infor.f.linkedin,
    instagram:infor.f.instagram
  }
};
}

module.exports={
construct:  construct_user,
construct_ad: construct_ad,
update_user_infor:update_user_infor,
construct_user_infor:construct_user_infor
};
