function acquireInfor(){
  return {
    title:$('#Ad_title').val(),
    category:$('#Ad_category').val(),
    description:$('.description').val(),
    email:$('#email').val(),
    phone:$('#phone').val()
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
  $('#a').animate({right:"-13%"},300,function(){
    $('.social_buttons_two').animate({top:"-75%"},400)
  })
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


// load some animation when the page is first loaded
function initial_animation(){
  $('.service_detail').slideUp(0.1);
}

$(document).ready(function(){


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
  //#to-top button appears after scrolling
  var fixed = false;


});
