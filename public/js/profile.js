
function edit_social_channel(channel){
console.log(channel)
$('.social_link').addClass('hidden')
switch(channel){
case "facebook":
$('#facebook_url').removeClass('hidden')
break;
case "youtube":
$('#youtube_url').removeClass('hidden')
break;
case "twitter":
$('#twitter_url').removeClass('hidden')
break;
case "instagram":
$('#instagram_url').removeClass('hidden')
break;
case "linkedin":
$('#linkedin_url').removeClass('hidden')
break;
}
}
function acquire_form(){
  return{
  a:$('#textarea').val(),
  b:$('#contact_name').val(),
  c:$('#email').val(),
  d:$('#phone').val(),
  e:$('#city').val()+" "+$('#province').val(),
  f:{
    facebook:$('#facebook_url').val(),
    twitter:$('#twitter_url').val(),
    youtube:$('#youtube_url').val(),
    linkedin:$('#linkedin').val(),
    instagram:$('instagram_url').val()
  }
  };
}

function updateprofile(user_ID){
  const form=acquire_form();
  console.log(form);
  $.ajax({
    type:'POST',
    url:'/update/user_ID',
    contenttype:'json',
    data:form,
    success:function(result){
      console.log(result);
    },
    error:function(result){
      console.log('error');
    }
  })
}


$(document).ready(function(){
$('.fa').on('click',function(){
  var id=$(this).parent().attr('id');
  edit_social_channel(id);
})
$('#submit').click(function(){
  updateprofile(123456);
})


})
