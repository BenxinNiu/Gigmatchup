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
function construct_ad(infor,id){
  var date=new Date();
  var formated=formatTime(date);
  return{
  "ID":id,
  "Oauth_ID":"null",
  "active":"false",
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

module.exports={
construct:  construct_user,
construct_ad: construct_ad
};
