
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

function get_ads(){
  $.ajax({
    type:"GET",
    url:"/manageAd",
    contenttype:'json',
    success:function(result){
      console.log(result)
    display_ad_infor(result);
    },
    error:function(result){
      console.log('error');
    }
  })
}

function display_ad_infor(data){
  $('.ads').empty();
  $('.ads').append('<h4>you have '+data.length+" ad </h4>")
for (var i=0;i<data.length;i++){
$('.ads').append("<span class='ad'><h3>Ad ID: "+data[i]+"</h3><a class='view btn btn-primary' id="+data[i]+">View ad</a><a class='delete btn btn-danger' id="+data[i]+">Delete</a></span>")
}
}

function acquire_form(){
  return{
  a:$('#textarea').val(),
  b:$('#contact_name').val(),
  c:$('#email').val(),
  d:$('#phone').val(),
  e:$('#city').val(),
  g:$('#province').val(),
  f:{
    facebook:$('#facebook_url').val(),
    twitter:$('#twitter_url').val(),
    youtube:$('#youtube_url').val(),
    linkedin:$('#linkedin').val(),
    instagram:$('instagram_url').val()
  }
  };
}

function display_user_infor(data){
  console.log(data)
  $('.avator').attr('src', data.img)
  $('#textarea').val(data.description)
  $('#contact_name').val(data.contact_name)
    $('#email').val(data.email)
    $('#phone').val(data.phone)
    $('#city').val(data.city)
    if(data.province!=="")
   $('#province').val(data.province)
   if(data.social.facebook!=="")
   $('#facebook_url').val(data.social.facebook)
   if(data.social.twitter!=="")
   $('#twitter_url').val(data.social.twitter)
   if(data.social.youtube!=="")
   $('#youtube_url').val(data.social.youtube)
   if(data.social.linkedin!=="")
   $('#linkedin_url').val(data.social.linkedin)
   if(data.social.instagram!=="")
   $('#instagram_url').val(data.social.instagram)
}

function acquire_user_infor(){
  $.ajax({
    type:"GET",
    url:"/getuser",
    contenttype:'json',
    success:function(result){
    display_user_infor(result);
    },
    error:function(result){
      console.log('error');
    }
  })
}

function updateprofile(user_ID){
  const form=acquire_form();
  console.log(form);
  $.ajax({
    type:'POST',
    url:'/updateprofile',
    contenttype:'json',
    data:form,
    success:function(result){
      if(result=="success"){
        $('.alert').removeClass('hidden').addClass('alert-success').text("Profile updated!")
      }
    },
    error:function(result){
    $('.alert').removeClass('hidden').addClass('alert-danger').text("Ooops we lost connection")
    }
  })
}

function delete_ad(id){
  $.ajax({
    type:"GET",
    url:"/deleteAd/"+id,
    contenttype:'json',
    success:function(result){
    console.log(result)
    $('#'+id).parent().remove();
    },
    error:function(result){
      console.log('error');
    }
  })
}

$(document).ready(function(){
acquire_user_infor();

$('.fa').on('click',function(){
  var id=$(this).parent().attr('id');
  edit_social_channel(id);
})
$('#submit').click(function(){
  updateprofile();
})
$('#manage_ad').click(function(){
  $('.ads').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  get_ads();
})
$('.ads').on('click','.delete',function(){
  var ad_id=$(this).attr('id');
  delete_ad(ad_id);
})
$('.ads').on('click','.view',function(){
  var ad_id=$(this).attr('id');
  var province=ad_id.substring(4);
  window.location.href='/adpage?search='+ad_id+"&province="+province;
})

})
