function acquireInfor(){
  return {
    title:$('#Ad_title').val(),
    category:$('#Ad_category').val(),
    description:$('.description').val(),
    email:$('#email').val(),
    phone:$('#phone').val()
  };
}
function postAd(){
var url='http://localhost:8080/postAd';
var form=acquireInfor();
$.ajax({
  type:'POST',
  contenttype:'json',
//  timeout:3000,
  url:url,
  data:form,
  xhrFields:{
    withCredentials: false
  },
  headers:{},
  success: function(res){
    console.log('success');
  //  $('.notification').append("<a class='goto_Ad' href="+ link +">Goto Ad page</a>")
  },
  error:function(res){
  console.log(res);
  }
});// ajax call end
}

function social_login(){

}



$(document).ready(function(){
  $('#post').click(function(){
    postAd();
  })
  // Closes the sidebar menu
  $("#menu-close").click(function(e) {
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("active");
  });
  // Opens the sidebar menu
  $("#menu-toggle").click(function(e) {
    console.log("hi")
      e.preventDefault();
      $("#sidebar-wrapper").toggleClass("active");
  });
  //#to-top button appears after scrolling
  var fixed = false;
  $(document).scroll(function() {
      if ($(this).scrollTop() > 250) {
          if (!fixed) {
              fixed = true;
              // $('#to-top').css({position:'fixed', display:'block'});
              $('#to-top').show("slow", function() {
                  $('#to-top').css({
                      position: 'fixed',
                      display: 'block'
                  });
              });
          }
      } else {
          if (fixed) {
              fixed = false;
              $('#to-top').hide("slow", function() {
                  $('#to-top').css({
                      display: 'none'
                  });
              });
          }
      }
  });

});
