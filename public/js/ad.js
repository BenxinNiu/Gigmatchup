
function infor_from_url(){
  var url=window.location.href;
  var position=url.indexOf("=")+1;
  return url.slice(num);
}


function acquire_ad(number,type){
$.ajax({
  type:'GET',
  contenttype:'json',
  url:'/adinfor/'+type+'?number='+number,
  success:function(data){
    console.log('success')
    console.log('data')
    return data;
  },
  error:function(res){
   return "failed";
  }
})
}

function loading(){
  $('.more_infor_pannel').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
}

$(document).ready(function(){
//var ad_infor=acquire_ad();
$('.snippet').on('click','.learn_more',function(){
$('.more_infor_pannel').animate({marginLeft:'0px'},600,function(){
//loading();
})
})
})
