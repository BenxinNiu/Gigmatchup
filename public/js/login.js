function return_url(){
  var url=window.location.href;
  var num=url.indexOf("=")+1;
   return url.slice(num);
}

$(document).ready(function(){
var redirect=return_url();
$('.btn-google').click(function(){
  window.location.href='/login/google?return='+redirect;
})
$('.register').click(function(){
  
})
})
