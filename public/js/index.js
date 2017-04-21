

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
  $.ajax({
type:'GET',
url:'/verify',
contenttype:'json',
success:function(result){
if(result=='yes'){
  $('#login_navbar').empty().append('<a href="/profile">account</a>')
  $('#register_navbar').empty().append('<a href="/logout">Logout</a>')
}
},
error:function(){console.log('error')}
  })
  /*
  var url=window.location.href;
  var num=url.indexOf("=")+1;
  if(num===0)
  return false;
  else return true;
//  return url.slice(num);
*/
}



// load some animation when the page is first loaded
function initial_animation(){
  $('.service_detail').slideUp(0.1);
  $('.post_ad').slideUp(0.1);
}

function optimize(){
  var width=window.innerWidth;
  if (width<=700){
  $('.c').css('top','-30px')
  $('.d').css('top','-500px')
}
}


$(document).ready(function(){

is_login();

initial_animation();

optimize();

$('#search_ad').click(function(){
var keyword=$('.searchBar').val();
console.log(keyword)
var province=$('#category').val();
if (keyword!="")
window.location="/adpage?search="+keyword+"&province="+province;
else
window.location="/adpage?search=all&province="+province;
})


$('.learn_more').on('click',function(){
  let id=$(this).attr('id');
  learn_more(id);
})

$('.login_icon').on('click',function(){
  social_login();
})


$('#switch').click(function(){
  if($(this).parent().hasClass('turned_on')){
    $(this).parent().removeClass('turned_on')
  $(this).animate({left:'0px'},300,function(){
    $(this).css("background","#fff")
    $(this).parent().css("background","#6a666b")
    $('body').css("color","black").css("background","#f4f4f4")
  $('.night').css("background","#6a666b")
  });
  }
  else{
    $(this).parent().addClass('turned_on')
    $(this).animate({left:'31px'},300,function(){
      $(this).css("background","#6a666b")
        $(this).parent().css("background","white")
          $('body').css("color","white").css("background","#2a282b")
        $('.night').css("background","#2a282b")
    });
  }
})

}); // document
