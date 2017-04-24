
//extract user information from 3rd party auth
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

//extract user information from local mongo database to pass to passport.js for session
function extract_dear_user(profile){
return{
  id: profile.clientID,
  displayName: profile.information.contact_name,
  image: profile.img,
};
}


function create_profile(pwd,email,num){
  var number=(Math.floor((Math.random() * 100000000000) + 1)).toString();
  var count=number+(18+num).toString();
  var id=parseInt(count,10);
 return{
id:id,
displayName:"",
image:"",
login_email:email,
pwd:pwd
 };
}


module.exports={
profile_infor:profile_infor,
extract_dear_user:extract_dear_user,
create_profile:create_profile
}
