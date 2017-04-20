function request_to_reset(email){
  $.ajax({
    type:'GET',
    url:'/requestResetCode/'+email,
    contenttype:'json',
    success:function(result){
        $('.load-wrapp').remove();
        if(result=='success'){
            $('.Error').addClass('alert-Success').text("An email has been sent to "+email+" Please check your inbox for details. Thank you!")
        }
    console.log(result);
    },
    error:function(){

    }
  })
}


function run_email(ed){
$.ajax({
  type:"GET",
  url:"/verify_email/"+ed,
  contenttype:'json',
  success:function(result){
    if(result=="denied"){  // user exist
  document.getElementById("submit").disabled =true;
  request_to_reset(ed);
    }
    else{ // user does not exist
      $('.Error').addClass('alert-danger').text("This email has not been registered")
    document.getElementById("submit").disabled =true;
  }
console.log(result);
  },
  error:function(){
    console.log("ooooops");
  }
})
}

$(document).ready(function(){

$('#submit').click(function(){
  var email=$('.email').val();
  if(email!=""){
    document.getElementById("submit").disabled =true;
  $('#form_area').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  if(validateEmail(email)){
  run_email(email);
  }
  else{
  $('.load-wrapp').remove();
  $('.Error').addClass('alert-danger').text("Please enter valid email address")
  document.getElementById("submit").disabled =true;
  }
}
})

$('.email').focus(function(){
  document.getElementById("submit").disabled =false;
  $('.load-wrapp').remove();
  $('.Error').removeClass('alert-danger').removeClass('alert-success').text("")
})



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
