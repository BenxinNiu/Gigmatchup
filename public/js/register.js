function run_email(ed){
$.ajax({
  type:"GET",
  url:"/verify_email/"+ed,
  contenttype:'json',
  success:function(result){
    if(result=="denied"){
    document.getElementById("signup").disabled =true;
    $('.emialError').html("Email address has already been used")
    }
    else
    document.getElementById("signup").disabled =false;
console.log(result);
  },
  error:function(){
    console.log("ooooops");
  }
})
}


function register_me(pwd){
  var email=$('#email_input').val();
  var form={
    login:email,
    pwd:pwd
  };
  $.ajax({
    type:"POST",
    url:"/signup",
    contenttype:'json',
    data:form,
    success:function(result){
    $('.notification').removeClass('hidden')
    setTimeout(function(){
      window.location.href="/loginpage?return=/";
    },2000)
    },
    error:function(){
      console.log("ooooops");
    }
  })
}


function verify_email(){
var dear_user_input=$('#email_input').val();
if(validateEmail(dear_user_input)){
  run_email(dear_user_input);
  console.log("email is valid");
}
else{
  document.getElementById("signup").disabled = true;
  $('.emialError').html("invalid email address")
  console.log("invalid email")
}
}


$(document).ready(function(){

$('#signup').on('click',function(){
  var p1=$('#p1').val();
  var p2=$('#p2').val();
if(p1==p2){
  if(p1.length>=6)
  register_me(p1);
  else
    $('.passwordError').html("minimum 6 character required")
}
   else
     $('.passwordError').html("password do not match")
});

  // form validation
$('.passport').focus(function(){
  verify_email();
    $('.passwordError').empty()
})
$('#email_input').focus(function(){
    document.getElementById("signup").disabled = true;
    $('.emialError').empty()
})
$('#email_input').blur(function(){
  document.getElementById("signup").disabled =true;
})



//night mode effect
  $('#switch').click(function(){
    if($(this).parent().hasClass('turned_on')){
      $(this).parent().removeClass('turned_on')
    $(this).animate({left:'0px'},300,function(){
      $(this).css("background","#fff")
        $(this).parent().css("background","#6a666b")
          $('body').css("background","#f4f4f4")
    });
    }
    else{
      $(this).parent().addClass('turned_on')
      $(this).animate({left:'31px'},300,function(){
        $(this).css("background","#6a666b")
          $(this).parent().css("background","white")
          $('body').css("background","#2a282b")
      });
    }
  })


})
