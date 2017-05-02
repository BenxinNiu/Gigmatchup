
function get_infor(){
    var url=window.location.href;
      var num=url.indexOf("?");
      var query=url.slice(num);
      return query;
}

function check_pwd(p1,p2){
  if(p1==p2){
    if(p1.length>=6){
      return true;
    }
    else{
      $('.Error').addClass('alert-danger').text('minimum 6 characters required');
      return false;
    }
  }
  else{
    $('.Error').addClass('alert-danger').text('Password do not match');
    return false;
  }
}
function reset_pwd(pwd){
  var form={pwd:pwd};
  var query=get_infor();
  $.ajax({
    type:'POST',
    url:'/reset_pwd'+query,
    data:form,
    contenttype:'json',
    success:function(result){
  if(result=='success'){
      $('.Error').addClass('alert-success').text('Password has been reset.. Redirecting you to login page');
      setTimeout(function(){
        window.location.href='/loginpage';
      },2500)
  }
  else{
    $('.Error').addClass('alert-danger').text('Invalid Verification code or Code has expired!');
  }
    },
    error:function(){

    }
  })
}

$(document).ready(function(){

  $('input').focus(function(){
    document.getElementById('reset').disabled=false;
    $('.Error').removeClass('alert-danger').removeClass('alert-success').text('');
  })

$('#reset').click(function(){
  console.log('ok')
  document.getElementById('reset').disabled=true;
  var pwd1=$('.pwd1').val();
  var pwd2=$('.pwd2').val();
if(check_pwd(pwd1,pwd2)){
  console.log('checked')
reset_pwd(pwd1);
}
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
