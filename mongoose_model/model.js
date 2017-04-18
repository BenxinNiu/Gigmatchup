const mongo=require('mongodb').MongoClient;

function formatTime(date){
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "/" + date.getHours()+ ":" + date.getMinutes();
}
function construct_user(profile){
  var date=new Date();
  var formated=formatTime(date);
return {
    active:"true",
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
  active:"false",
  Oauth_ID: profile.id,
  name:profile.displayName,
  created_date:formated,
  img_url:profile.image,
  Ad_id:[]
};
}
function construct_ad(infor,id,activation){
  var date=new Date();
  var formated=formatTime(date);
  return{
  "activeCode":activation,
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
    img:profile.image,
    information:{
      img:profile.image,
      description:"Write something about yourself",
      contact_name:profile.displayName,
      email:"Click to edit",
      phone:"Click to edit",
      city:"Click to edit",
      province:"",
      social:{
      facebook:"",
      twitter:"",
      youtube:"",
      linkedin:"",
      instagram:""
    }
  },
  credential:{
    login_email:profile.login_email,
    pwd:profile.pwd
  }
};
}
function update_user_infor(infor){
  return{
    description:infor.a,
    contact_name:infor.b,
    email:infor.c,
    phone:infor.d,
    city:infor.e,
    province:infor.g,
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
create_user:create_user,
construct_ad: construct_ad,
update_user_infor:update_user_infor,
construct_user_infor:construct_user_infor
};
