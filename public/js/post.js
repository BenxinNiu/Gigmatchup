

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

}

function navigate(id){
  if(id=='first_one'){
    $('#first').animate({marginLeft:'20000px'},700,function(){
        $('#first').addClass('hidden');
        $('#second').removeClass('hidden')
    });
    $('#first_one').addClass('hidden');
    $('#second_one').removeClass('hidden')
      $('#go_back_one').removeClass('hidden')
  }
  else if(id=='second_one'){
    $('#second').animate({marginLeft:'20000px'},700,function(){
        $('#second').addClass('hidden');
        $('#go_back_one').addClass('hidden');
        $('#third').removeClass('hidden')
    });
    $('#second_one').addClass('hidden');
    $('#post').removeClass('hidden')
      $('#go_back_two').removeClass('hidden')
  }
  else if(id=='go_back_one'){
      $('#second').addClass('hidden')
        $('#go_back_one').addClass('hidden');
        $('#first').removeClass('hidden').animate({marginLeft:'0px'},700)

    $('#go_back_one').addClass('hidden');
    $('#second_one').addClass('hidden')
      $('#first_one').removeClass('hidden')
  }
  else if(id=='go_back_two'){
    $('#third').addClass('hidden')
      $('#second').removeClass('hidden').animate({marginLeft:'0px'},700)
  $("#go_back_two").addClass('hidden');
  $('#second_one').removeClass('hidden')
  $('#go_back_one').removeClass('hidden')
  $('#post').addClass('hidden')
  }
}

function acquireInfor(img_list){
  var price='';
  if(!$('#pricing').val())
price='Contact me';
 else if($('price_category').val()=='one')
  price='$' + $('#pricing').val()+ ' One time payment'
   else if($('price_category').val()=='contact')
price='Contact me';
else
price='$' +$('#pricing').val()+' hourly'

  return {
    Ad_title:$('#Ad_title').val(),
    category:$('#Ad_category').val(),
    pricing:price,
    description:$('#description').val(),
    contact_name:$('#contact_name').val(),
    email:$('#email').val(),
    phone:$('#phone').val(),
    facebook:$('#fb_url').val(),
    twitter:$('#twitter_url').val(),
    youtube:$('#youtube_url').val(),
    instagram:$('#ins_url').val(),
    linkedin:$('#linkedin_url').val(),
    city:$('#city').val(),
    province: $('#province').val(),
    url:$('#company').val(),
    img_urls:img_list
  };
}
function validate(){
  var pass=true;
var a=  $('#Ad_title').val();
var b=  $('#Ad_category').val();
var c=  $('#contact_name').val();
var d=  $('#email').val();
var e=  $('#phone').val();
if(a==""){
$('#error_area').append("<h5 class='alert alert-danger'>Ad title can not be empty</h5>")
pass=false;
}
if(b==""){
$('#error_area').append("<h5 class='alert alert-danger'>Please select a category</h5>")
pass=false;
}
if(c==""){
$('#error_area').append("<h5 class='alert alert-danger'>Please give us your contact name</h5>")
pass=false;
}
if(!validateEmail(d)){
$('#error_area').append("<h5 class='alert alert-danger'>Invalid email address</h5>")
pass=false;
}
if(e!=""){
  if(!validateCellNumber(e)){
  $('#error_area').append("<h5 class='alert alert-danger'>Invalid cell number</h5>")
  pass=false;
}
}
return pass;
}

function post(img_list){
var form=acquireInfor(img_list);
  $.ajax({
    type:'POST',
    contenttype:'json',
  //  timeout:3000,
    url:'/post',
    data:form,
    xhrFields:{
      withCredentials: false
    },
    headers:{},
    success: function(res){
      console.log('success');
      $('.load-wrapp').remove();
      $('.notification').removeClass('hidden').addClass('alert-success').text('Thank you for using Gigmatchup, Confirmation email has been sent to '+form.email+'. If you are not logged in, you will need to activate your ad using the link in the email.')
    },
    error:function(res){
          $('load-wrapp').remove();
          $('.notification').addClass('alert-danger');
          $('.notification').text("Sorry, we lost connection to the server")
    console.log(res);
    }
  });// ajax call end
}

function display_imgs(list){
  $('.list_unstyled').empty();
for(var i=0;i<list.length;i++){
$('.list_unstyled').append('<li><img class="img-responsive" src='+list[i]+'></li>')
}
}



$(document).ready(function(){

var img_list=[];


  $('#form').slideUp(10);

is_login();

$('.basic').on('click','.navigate',function(){
  var id=$(this).attr('id');
   navigate(id);
})

//post ad
$('.basic').on('click','#post',function(){
  if(validate()){
  $('.basic').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  document.getElementById('post').disabled=true;
    //document.getElementById('add_pic').disabled=true;
    $('error_area').empty();
    $('.notification').removeClass('alert-danger').removeClass('alert-success').text('');
    post(img_list);
  }
})

$('#add').click(function(){
$('#form').slideDown(500);
})

$("#form").on('submit',(function(ha) {
  $('.basic').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  document.getElementById('upload').disabled=true;
    document.getElementById('post').disabled=true;

 ha.preventDefault();
 $.ajax({
  url: "/add/img",
  type: "POST",
  data:  new FormData(this),
    cache: false,
  contentType: false,
  processData:false,
  success: function(data){
    $('#form').slideUp(10);
    $('#uploadImage').val("")
    document.getElementById('upload').disabled=false;
    document.getElementById('post').disabled=false;
    $('.load-wrapp').remove();
    if(data=='fail'){
   $('#error_area').append("<h5 class='alert alert-danger'>Ooops something went wrong</h5>")
    }
    else{
img_list.push(data);
console.log(img_list);
display_imgs(img_list);
    }
     },
    error: function(e){

     }
   });
}));


//night mode effect
  $('#switch').click(function(){
    if($(this).parent().hasClass('turned_on')){
      $(this).parent().removeClass('turned_on')
    $(this).animate({left:'0px'},300,function(){
      $(this).css("background","#fff")
        $(this).parent().css("background","#6a666b")
          $('body').css("background","#f4f4f4")
          $('body').css("color","black")
    });
    }
    else{
      $(this).parent().addClass('turned_on')
      $(this).animate({left:'31px'},300,function(){
        $(this).css("background","#6a666b")
          $(this).parent().css("background","white")
          $('body').css("background","#2a282b")
          $('body').css("color","white")
      });
    }
  })

})
