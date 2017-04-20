function return_url(){
  var url=window.location.href;
  var num=url.indexOf("=")+1;
   return url.slice(num);
}

$(document).ready(function(){

var redirect=return_url();
if(redirect=='failed'){
  $('.notification').removeClass('hidden').text('Invalid email address or password');
}


$('.btn-google').click(function(){
  window.location.href='/login/google?return='+redirect;
<<<<<<< HEAD
})

$('#switch').click(function(){
  console.log('yes');
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
=======
})
$('.register').click(function(){
  
})
>>>>>>> ec74a2b6de9983632ce85b84bbfb6a6ab766d6ee
})
