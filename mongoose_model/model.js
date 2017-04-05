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
  img_url:profile.image
};
}
function construct_ad(infor,id){
  var date=new Date();
  var formated=formatTime(date);
  return{
  "ID":id,
  "Oauth_ID":"null",
  "title":infor.title,
  "category":infor.category,
  "description": infor.description,
  "phone":infor.phone,
  "email":infor.email,
  "post_date":formated,
  "facebook":infor.facebook,
  "twitter":infor.twitter,
  "youtube":infor.youtube,
  "video":infor.video,
  "location":infor.location
};
}

module.exports={
construct:  construct_user,
construct_ad: construct_ad
};
