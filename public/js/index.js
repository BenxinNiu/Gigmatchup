function get_user_infor(){
  var url=window.location.href;
  var num=url.indexOf("=")+1;
  var id=url.slice(num);
  $.ajax({
    tyep:'GET',
      contenttype:'json',
    url:'/user?u='+id,
    success:function(data){
      console.log(data);
    $('.logo').text("welcome "+data.name);
    },
    error:function(res){
   console.log(res);
    }
  })
}


function acquireInfor(){
  var price='';
  if(!$('#pricing').val())
price='Contact me';
 else if($('price_category').val()=='one')
  price=$('#pricing').val()+ ' One time payment'
   else if($('price_category').val()=='contact')
price='Contact me';
else
price=$('#pricing').val()+' hourly'

  return {
    Ad_title:$('#Ad_title').val(),
    category:$('#Ad_category').val(),
    pricing:price,
    description:$('#description').val(),
    contact_name:$('#contact_name').val(),
    title:$('contact_title').val(),
    email:$('#email').val(),
    phone:$('#phone').val(),
    facebook:$('#facebook-url').val(),
    twitter:$('#twitter_url').val(),
    youtube:$('#youtube_url').val(),
    instagram:$('#ins_url').val(),
    linkedin:$('#linkedin_url').val(),
    city:$('#city').val(),
    province: $('#province').val(),
    url:$('#company').val()
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

function postAd(ad_num){
  var url='';
if(ad_num=='') // no pictures uploaded
 url='/post';
else
 url='/post?ad='+ad_num;
var form=acquireInfor();
console.log(form);
if(is_form_completed()){
  $('.notification').removeClass('hidden');
  //add loading animation
  $('.notification').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
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
    $('load-wrapp').remove();
  $('.response').addClass('alert-success').html('Fuck you for posting ad ')
      $('.more_message').append("<h4> An email has been sent to your email address provided, Please check your indox and click the provided link to activate your account</h4>")
  //  $('.notification').append("<a class='goto_Ad' href="+ link +">Goto Ad page</a>")
  },
  error:function(res){
        $('load-wrapp').remove();
        $('.response').addClass('alert-danger')
        $('.response').append("<h3>Sorry, we lost connection to the server </h3>")
  console.log(res);
  }
});// ajax call end
}
}

function social_login(){
$('.list_unstyled').animate({left: "53%"},600);
}

function promote_login(){
  var width=window.innerWidth;
  if (width<=700){
    $('#a').animate({right:"-99%"},300,function(){
      $('.social_buttons_two').animate({top:"-45%"},400)
  })
}
  else{
  $('#a').animate({right:"-20%"},300,function(){
    $('.social_buttons_two').animate({top:"-45%"},400)
  })
}
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
$(Id).append("<a href='/adpage?search=Music&province=all' class='btn btn-primary btn-lobster'>go to Ad page</a>");
break;
case "DJ":
$(Id).empty();
$(Id).append("<a href='/adpage?search=DJ&province=all' class='btn btn-primary btn-lobster'>Go to Ad page</a>");
break;
case "talents":
$(Id).empty();
$(Id).append("<a href='/adpage?search=talents&province=all' class='btn btn-primary btn-lobster'>Go to Ad page</a>");
break;
case "be_discovered":
$(Id).empty();
$(Id).append("<a href='/profile?search=be_discovered&province=all' class='btn btn-primary btn-lobster'>Go to Profile</a>");
break;
}
}
///adpage?search=Music&province=all
//see if user is logged in
function is_login(){
  var url=window.location.href;
  var num=url.indexOf("=")+1;
  if(num===0)
  return false;
  else return true;
//  return url.slice(num);
}

function is_form_completed(){
  var num=0;
  var error=[]
if(!$('#Ad_title').val()){
  num++;
  error.push('Please check your ad title')
}
if(!$('#Ad_category').val()){
  num++;
  error.push('Please select a category')
}
if(!$('#contact_name').val()){
  num++;
  error.push('Please check contact name')
}
if(!validateEmail($('#email').val())){
  num++;
  error.push('Please check email address')
}
if(!$('#city').val()){
  num++;
  error.push('Please check your ad location')
}
if(num==0)
return true;
else{
  console.log(error);
  $('.notification').removeClass('hidden')
  $('.response').addClass('alert-danger').html('Oops there is something wrong with your information')
  $('.more_message').append('<ul class="errors"></ul>')
  let $Error_list=$('.more_message').children('.errors')
  for (var i=0;i<error.length;i++){
  $Error_list.append("<li>"+error[i]+"</li>")
  }
return false;
}
}


function add_social_channel(channel){
let $id=$('.url_input');
var $children = $('.url_input').children('.urls');
console.log(channel)
$children.addClass('hidden')
switch(channel){
case "fb":
$id.children('#facebook_url').removeClass('hidden')
break;
case "yt":
$id.children('#youtube_url').removeClass('hidden')
break;
case "tw":
$id.children('#twitter_url').removeClass('hidden')
break;
case "ins":
$id.children('#ins_url').removeClass('hidden')
break;
case "linkedin":
$id.children('#linkedin_url').removeClass('hidden')
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
    $('.navigate').append("<a id='go_back_first' class='btn btn-primary btn-lobster'>Go back</a>")
      $('.navigate').append("<a id='next_to_social' class='btn btn-primary btn-lobster'>(2/3)Next</a>")
    break;
    case "next_to_social":
    $('.c').animate({left:"1000px"},600)
    $('.navigate').empty();
    $('.navigate').append("<a id='go_back_contact' class='btn btn-primary btn-lobster'>Go back</a>")
      $('.navigate').append("<a id='post_now' class='btn btn-primary btn-lobster'>(3/3)Post Now</a>")
    break;
  }
}

// load some animation when the page is first loaded
function initial_animation(){
  $('.service_detail').slideUp(0.1);
  $('.post_ad').slideUp(0.1);
  if(is_login()){
    $('#login_navbar').empty().append('<a href="/profile">account</a>')
    $('#register_navbar').empty().append('<a href="/logout">Logout</a>')
  }
}

function optimize(){
  var width=window.innerWidth;
  if (width<=700){
  $('.c').css('top','-30px')
  $('.d').css('top','1080px')
}
}


$(document).ready(function(){

var Ad_num_to_post='';  // the id returned after uploading pictures
initial_animation();

optimize();

if(is_login()){
get_user_infor();
}

$('#search_ad').click(function(){
var keyword=$('.searchBar').val();
console.log(keyword)
var province=$('#category').val();
if (keyword!="")
window.location="/adpage?search="+keyword+"&province="+province;
})

// post ad
$('.navigate').on('click','#post_now',function(){
// remove previous error message
$('.response').empty().removeClass('alert-danger')
$('.more_message').empty()
  postAd();
})

$('.navigate').on('click','#go_back_first',function(){
  $('.b').animate({left:"0px"},600)
  $('.navigate').empty();
  $('.navigate').append("<a id='next_to_contact' class='btn btn-primary btn-lobster'>(1/3)Next</a>")
})
$('.navigate').on('click','#go_back_contact',function(){
  $('.c').animate({left:"0px"},600)
  $('.navigate').empty();
      $('.navigate').append("<a id='go_back_first' class='btn btn-primary btn-lobster'>Go back</a>")
  $('.navigate').append("<a id='next_to_social' class='btn btn-primary btn-lobster'>(2/3)Next</a>")
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
  window.location.href='/profile';
  else
  promote_login();
})
$('.skip').on('click',function(){
  $('.a').animate({left:"1000px"},600)
    $('.navigate').append("<a id='next_to_contact' class='btn btn-primary btn-lobster'>(1/3)Next</a>")
})


$('.learn_more').on('click',function(){
  let id=$(this).attr('id');
  learn_more(id);
})

$('.login_icon').on('click',function(){
  social_login();
})


}); // document
