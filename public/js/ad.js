
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

function display_more_infor(infor,ad_num){
  var list=infor.pictures;
  var selector='.'+ad_num;
    let $loading_pannel=$(selector).children('.row').children('.loading_pannel');
  let $img_list=$(selector).children('.row').children('.more_infor_pannel').children('.imgs_list').children('#imgs_list');
  let $slider=$(selector).children('.row').children('.more_infor_pannel').children('.imgs_list').children('.slider');
  let $more_infor_pannel=$(selector).children('.row').children('.more_infor_pannel');
  $loading_pannel.addClass('hidden').empty();
  $('.ad_area').children(selector).children('.row').children('.more_infor_pannel').removeClass('hidden').animate({marginLeft:'0px'},600)
  if(infor.facebook!=null&&infor.facebook!="")
   $img_list.append("<li><a href=" + infor.facebook + "><i class='fa fa-facebook'></i></a></li>")
   if(infor.youtube!=null&&infor.youtube!="")
    $img_list.append("<li><a href=" + infor.youtube + "><i class='fa fa-youtube'></i></a></li>")
    if(infor.twitter!=null&&infor.twitter!="")
     $img_list.append("<li><a href=" + infor.twitter + "><i class='fa fa-twitter'></i></a></li>")
    if(infor.instagram!=null&&infor.instagram!="")
      $img_list.append("<li><a href=" + infor.instagram + "><i class='fa fa-instagram'></i></a></li>")
    if(infor.linkedin!=null&&infor.linkedin!="")
       $img_list.append("<li><a href=" + infor.linkedin + "><i class='fa fa-linkedin'></i></a></li>")

if(list!==null)
for(var i=0;i<list.length;i++){
$slider.append("<li><img class='img-responsive' src=" +list[i] +"></li>")
}


       $more_infor_pannel.children('.pricing').append("<h4>"+infor.price+"</h4>")
       $more_infor_pannel.children('.email').append("<h4>"+infor.contact_name+"</h4>")
       $more_infor_pannel.children('.email').append("<h4>"+infor.email+"</h4>")
       $more_infor_pannel.children('.phone').append("<h4>"+infor.phone+"</h4>")
}

function get_more_infor(ad_id,sec_id,id){
  let $loading_pannel=$('.'+ad_id).children('.row').children('.loading_pannel')
  let $more_infor_pannel=$('.'+ad_id).children('.row').children('.more_infor_pannel');
  $loading_pannel.removeClass('hidden').animate({marginLeft:'0px'},600).append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
//  $('.ad_area').children(sec_id).children('.row').children('.more_infor_pannel').removeClass('hidden').animate({marginLeft:'0px'},600)
  $('.ad_area').children(sec_id).children('.row').children('.snippet').append("<a id="+id+ " class='show_less btn btn-primary'><span class='glyphicon glyphicon-chevron-left'></span>Show Less</a>")
  $('.ad_area').children(sec_id).children('.row').children('.snippet').children('.learn_more').remove();

$.ajax({
type:'GET',
contenttype:'json',
url:'/acquire_more/'+ad_id,
success:function(result){
  console.log('success');
  display_more_infor(result,ad_id);
},
error:function(){
   console.log("failed to get more infor!");
}
});
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
      var btn='btn'+i;
      var selector='#'+id;  // tyhe parent container of one ad !!!!
      $('.ad_area').append("<div id="+id+" class="+ infor.requested_ad +"></div>");
      $(selector).append(html);

      let $img_list=$(selector).children('.row').children('.more_infor_pannel').children('.imgs_list').children('#imgs_list');
      let $snippet=$(selector).children('.row').children('.snippet');
      let $more_infor_pannel=$(selector).children('.row').children('.more_infor_pannel');
    $snippet.children('.title').append("<h3>"+infor.title+"</h3>")
      $snippet.children('.location').append("<h4>"+infor.category+"</h4>")
    $snippet.children('.location').append("<h4>"+infor.location+"</h4>")
    $snippet.children('.post-time').append("<h4>"+infor.post_date+"</h4>")
    $snippet.children('.description').append("<p>"+infor.description+"</p>")
    $snippet.append("<a id="+btn+ " class='learn_more btn btn-primary'>View more <span class='glyphicon glyphicon-chevron-right'></span></a>")
      }
    },
    error:function(res){
     return "failed";
    }
  })
}

function acquire_ad(number,type,province){
  //console.log(type);
  console.log(number);
$.ajax({
  type:'GET',
  contenttype:'json',
  url:'/adinfor/'+type+ '?number='+number +'&province='+province,
  success:function(data){
    console.log(data);
  var length=data.length;
  $('.num').text(length+" ad found for you")
   display_html(data);
  },
  error:function(res){
    console.log('failed')
   result='failed';
  }
})
}

function loading(){
  $('.more_infor_pannel').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
}

function search(displayNumber){
  console.log(displayNumber);
  var ad=$('.searchBar').val();
  var type=$('#Ad_category').val();
  var province=$('#category').val();
  if(displayNumber==0)
  $('.ad_area').empty();
  $('.ad_area').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  acquire_ad(displayNumber,type,province);
}


$(document).ready(function(){
var displayNumber=0;
var is_specific=false;

var type=infor_from_url();
console.log(type);
$('.ad_area').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
 acquire_ad(0,type.type,type.city);

$('.submit').click(function(){
  search();
  is_specific=true;
})

$('.ad_area').on('click','.learn_more',function(){
  var id=$(this).attr('id');
  var ad_class=$(this).parent().parent().parent().attr('class')
  var sec_id="#"+id.replace('btn','id'); // section (ad id) id
  console.log(sec_id);
  get_more_infor(ad_class,sec_id,id);

})

$('.ad_area').on('click','.show_less',function(){
  var id=$(this).attr('id');
  console.log(id);
  var sec_id="#"+id.replace('btn','id'); // section (ad id) id
  var ad_class=$(this).parent().parent().parent().attr('class')
  let $img_list=$('.'+ad_class).children('.row').children('.more_infor_pannel').children('.imgs_list').children('#imgs_list');
  let $slider=$('.'+ad_class).children('.row').children('.more_infor_pannel').children('.imgs_list').children('.slider');
  let $more_infor_pannel=$('.'+ad_class).children('.row').children('.more_infor_pannel');

  $('.ad_area').children(sec_id).children('.row').children('.more_infor_pannel').removeClass('hidden').animate({marginLeft:'-1000px'},600,function(){
    $(this).addClass('hidden')
  })
  $('.ad_area').children(sec_id).children('.row').children('.snippet').append("<a id="+id+ " class='learn_more btn btn-primary'>Show more<span class='glyphicon glyphicon-chevron-right'></span></a>")
$('.ad_area').children(sec_id).children('.row').children('.snippet').children('.show_less').remove();
$img_list.empty();
$slider.empty();
$more_infor_pannel.children('.pricing').empty()
$more_infor_pannel.children('.email').empty()
$more_infor_pannel.children('.phone').empty()
})

$('.ad_area').on('click','img',function(){
  var url=$(this).attr('src')
  window.open(url)
})

$('.more_result').on('click',function(){
  $('.ad_area').append("<div class='load-wrapp'><div class='load'><div class='line'></div><div class='line'></div><div class='line'></div></div>")
  displayNumber+=5;
if(is_specific)
search(displayNumber);
 acquire_ad(displayNumber,type.type,type.city);
})



// night mode
$('#switch').click(function(){
  console.log('yes');
  if($(this).parent().hasClass('turned_on')){
    $(this).parent().removeClass('turned_on')
  $(this).animate({left:'0px'},300,function(){
    $(this).css("background","#fff")
      $(this).parent().css("background","#6a666b")
        $('body').css("background","#f4f4f4").css("color","black")
  });
  }
  else{
    $(this).parent().addClass('turned_on')
    $(this).animate({left:'31px'},300,function(){
      $(this).css("background","#6a666b")
        $(this).parent().css("background","white")
        $('body').css("background","#2a282b").css("color","white")
    });
  }
})



})//end
