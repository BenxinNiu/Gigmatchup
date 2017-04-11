
function infor_from_url(){
  var url=window.location.href;
  var position=url.indexOf("=")+1;
  var url=url.slice(position);
  var sec_position=url.indexOf('&');
  var type=url.slice(0,sec_position);
  var city=url.slice(url.indexOf('=')+1);
  return {city:city,
          type:type};
}


function display_html(result){
  $.ajax({
    type:'GET',
    contenttype:'json',
    url:'/get_html?type=ad_html',
    success:function(html){
      $('.load-wrapp').remove();
      result=result.reverse();
      for (var i=0;i<result.length;i++){
      var infor=result[i];
      var id='id'+i;
      console.log(id)
      var btn='btn'+i;
      var selector='#'+id;
      $('.ad_area').append("<div id="+id+ "></div>");
      $(selector).append(html);
      console.log(infor);
      if(infor.facebook!=null)
       $(selector).children('.row').children('.more_infor_pannel').children('.imgs_list').children('#imgs_list').append("<li><a href=" + infor.facebook + "><i class='fa fa-facebook'></i></a></li>")
       if(infor.youtube!=null)
        $(selector).children('.row').children('.more_infor_pannel').children('.imgs_list').children('#imgs_list').append("<li><a href=" + infor.youtube + "><i class='fa fa-youtube'></i></a></li>")
        if(infor.twitter!=null)
         $(selector).children('.row').children('.more_infor_pannel').children('.imgs_list').children('#imgs_list').append("<li><a href=" + infor.twitter + "><i class='fa fa-twitter'></i></a></li>")
      $(selector).children('.row').children('.snippet').children('.title').append("<h3>"+infor.title+"</h3>")
    $(selector).children('.row').children('.snippet').children('.location').append("<h4>"+infor.location+"</h4>")
    $(selector).children('.row').children('.snippet').children('.post-time').append("<h4>"+infor.post_date+"</h4>")
    $(selector).children('.row').children('.snippet').children('.description').append("<p>"+infor.description+"</p>")
    $(selector).children('.row').children('.snippet').append("<a id="+btn+ " class='learn_more btn btn-primary'>View more <span class='glyphicon glyphicon-chevron-right'></span></a>")
   $(selector).children('.row').children('.more_infor_pannel').children('.pricing').append("<h4>"+infor.pricing+"</h4>")
   $(selector).children('.row').children('.more_infor_pannel').children('.email').append("<h4>"+infor.email+"</h4>")
   $(selector).children('.row').children('.more_infor_pannel').children('.phone').append("<h4>"+infor.phone+"</h4>")
      }
    },
    error:function(res){
     return "failed";
    }
  })
}

function acquire_ad(number,type,province){
  //console.log(type);
$.ajax({
  type:'GET',
  contenttype:'json',
  url:'/adinfor/'+type+ '?number='+number +'&province='+province,
  success:function(data){
  var length=data.length;
  $('.num').text(length+" ad found for you")
   display_html(data);
  },
  error:function(res){
   result='failed';
  }
})
}

function loading(){
  $('.more_infor_pannel').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
}

function search(){
  var ad=$('.searchBar').val();
  var type=$('#Ad_category').val();
  var province=$('#category').val();
  $('.ad_area').empty();
  $('.ad_area').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  acquire_ad(5,type,province);
}


$(document).ready(function(){
var type=infor_from_url();
console.log(type);
  $('.ad_area').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  acquire_ad(5,type.type,type.city);
$('.submit').click(function(){
  search();
})

$('.ad_area').on('click','.learn_more',function(){
  //console.log("hi")
  var id=$(this).attr('id');
  console.log(id);
  var sec_id="#"+id.replace('btn','id'); // section (ad id) id
  console.log(sec_id);
$('.ad_area').children(sec_id).children('.row').children('.more_infor_pannel').removeClass('hidden').animate({marginLeft:'0px'},600)
$('.ad_area').children(sec_id).children('.row').children('.snippet').append("<a id="+id+ " class='show_less btn btn-primary'><span class='glyphicon glyphicon-chevron-left'></span>Show Less</a>")
$('.ad_area').children(sec_id).children('.row').children('.snippet').children('.learn_more').remove();
})

$('.ad_area').on('click','.show_less',function(){
  var id=$(this).attr('id');
  console.log(id);
  var sec_id="#"+id.replace('btn','id'); // section (ad id) id
  $('.ad_area').children(sec_id).children('.row').children('.more_infor_pannel').removeClass('hidden').animate({marginLeft:'-1000px'},600,function(){
    $(this).addClass('hidden')
  })
  $('.ad_area').children(sec_id).children('.row').children('.snippet').append("<a id="+id+ " class='learn_more btn btn-primary'>Show more<span class='glyphicon glyphicon-chevron-right'></span></a>")
$('.ad_area').children(sec_id).children('.row').children('.snippet').children('.show_less').remove();
})





})//end
