function acquireInfor(){
  return {
    title:$('#Ad_title').val(),
    category:$('#Ad_category').val(),
    pricing:$('#pricing').val(),
    description:$('#description').val(),
    email:$('#email').val(),
    phone:$('#phone').val()
  };
}

function acquireSocial_urls(){
return{
  facebook:$('#facebook-url').val(),
  twitter:$('#twitter_url').val(),
  youtube:$('#youtube_url').val(),
  video:$('#video').val()
};
}

function postAd(){
var url='http://localhost:8080/postAd';
var form=acquireInfor();
$.ajax({
  type:'POST',
  contenttype:'json',
//  timeout:3000,
  url:url,
  data:form,
  xhrFields:{
    withCredentials: false
  },
  headers:{},
  success: function(res){
    console.log('success');
  //  $('.notification').append("<a class='goto_Ad' href="+ link +">Goto Ad page</a>")
  },
  error:function(res){
  console.log(res);
  }
});// ajax call end
}

function social_login(){
$('.list_unstyled').animate({left: "53%"},600);
}

function promote_login(){

  $('#a').animate({right:"-20%"},300,function(){
    $('.social_buttons_two').animate({top:"-75%"},400)
  })
}

function getWidth() {
  if (self.innerWidth) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

function learn_more(service){
let id="#_"+service;
let Id="#"+service;
$(id).slideDown();
switch (service){
  case "music":
$(Id).empty();
$(Id).append("<a href='/ad?search=music_band' class='btn btn-primary btn-lobster'>go to Ad page</a>");
break;
case "DJ":
$(Id).empty();
$(Id).append("<a href='/ad?search=DJ' class='btn btn-primary btn-lobster'>Go to Ad page</a>");
break;
case "talents":
$(Id).empty();
$(Id).append("<a href='/ad?search=talents' class='btn btn-primary btn-lobster'>Go to Ad page</a>");
break;
case "be_discovered":
$(Id).empty();
$(Id).append("<a href='/ad?search=be_discovered' class='btn btn-primary btn-lobster'>Go to Profile</a>");
break;
}
}
//see if user is logged in
function is_login(){
  var url=window.location.href;
  var num=url.indexOf("=")+1;
  if(num===0)
  return false;
  else return true;
//  return url.slice(num);
}

function add_social_channel(channel){
let id="#"+channel;
switch(channel){
case "fb":
$(id).empty();
$(id).append("<input id='facebook-url' class='urls' placeholder='facebook url'>");
break;
case "yt":
$(id).empty();
$(id).append("<input id='youtube_url' class='urls' placeholder='youtube url'>");
break;
case "tw":
$(id).empty();
$(id).append("<input id='twitter_url' class='urls' placeholder='twitter url'>");
break;
}
}

function start_post_ad(id){
  switch(id){
    case "get_started":
    $('.post_ad').slideDown(500);
    $('.navigate').empty();
    break;
    case "next_to_contact":
    $('.b').animate({left:"1000px"},600)
    $('.navigate').empty();
    $('.navigate').append("<a id='go_back' class='btn btn-primary btn-lobster'>Go back</a>")
      $('.navigate').append("<a id='post_now' class='btn btn-primary btn-lobster'>(2/2)Post Now</a>")
    break;
  }
}

// load some animation when the page is first loaded
function initial_animation(){
  $('.service_detail').slideUp(0.1);
  $('.post_ad').slideUp(0.1);
}

function optimize(){
  var width=window.innerWidth;
  if (width<=700)
  $('.c').css('top','-600px')
}


$(document).ready(function(){

initial_animation();

optimize();

$('.navigate').on('click','#post_now',function(){
  post_ad();
})

$('.navigate').on('click','#go_back',function(){
  $('.b').animate({left:"0px"},600)
  $('.navigate').empty();
  $('.navigate').append("<a id='next_to_contact' class='btn btn-primary btn-lobster'>(1/2)Next</a>")
})

$('.navigate').on('click','.btn',function(){
var child=$(this).attr('id')
start_post_ad(child);
})

$('.channel').on('click',function(){
 let Id=$(this).parent().attr('id')
  add_social_channel(Id);
})

$('.edit_profile_now').on('click',function(){
  if(is_login())
  window.location.href='/edit';
  else
  promote_login();
})
$('.skip').on('click',function(){
  $('.a').animate({left:"1000px"},600)
    $('.navigate').append("<a id='next_to_contact' class='btn btn-primary btn-lobster'>(1/2)Next</a>")
})


$('.learn_more').on('click',function(){
  let id=$(this).attr('id');
  learn_more(id);
})

$('.login_icon').on('click',function(){
  social_login();
})

  $('#post').click(function(){
    postAd();
  })
  // Closes the sidebar menu
  $("#menu-close").click(function(e) {
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("active");
  });
  // Opens the sidebar menu
  $("#menu-toggle").click(function(e) {
    console.log("hi")
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("active");
  });

}); // document
