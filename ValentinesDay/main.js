$('document').ready(function($) {
  // let window_width = $(window).width();
  // document.getElementById('finalPic').style.minHeight = window_width * 863/1149 + 'px';

  $("#login-button").click(function(event){
    event.preventDefault();

    let password = document.getElementById('password').value;
    // console.log(password);

    if (password === 'bedtimeboo') {
      $('form').fadeOut(500);
      $('.wrapper').addClass('form-success');
      $('body').addClass('loaded');
    } else {
      alert("'"+password+"' is not the correct password");
    }
  });

  $(window).scroll(function() {
    let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if (scrollTop > 1000) {
      document.getElementById('valentinesSvg2').style.zIndex = 1;
    } else {
      document.getElementById('valentinesSvg2').style.zIndex = -1;
    }

    // let window_width = $(window).width();
    // document.getElementById('finalPic').style.minHeight = window_width * 863/1149 + 'px';
  });
});
