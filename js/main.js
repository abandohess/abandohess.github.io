$('document').ready(function($) {

  // only display page after home image is loaded
  $(window).load(function() {
  // Animate loader off screen
    $('body').addClass('loaded');
    // prevent collapsable mobile menu from showing while page is loading
    $(".hideDrawers").css({"visibility": "visible"});
  });

  // parallax javascript taken from Materialize library
  // had to modify slightly to be used on my website
  ;(function ($) {
      $.fn.parallax = function () {
        var window_width = $(window).width();
        // Parallax Scripts
        return this.each(function(i) {
          var $this = $(this);
          $this.addClass('parallax');

          function updateParallax(initial) {
            var container_height;
            if (window_width < 601) {
              container_height = ($this.height() > 0) ? $this.height() : $this.children("img").height();
            }
            else {
              container_height = ($this.height() > 0) ? $this.height() : 500;
            }
            var $img = $this.children("img").first();
            var img_height = $img.height();
            var parallax_dist = img_height - container_height;
            var bottom = $this.offset().top + container_height;
            var top = $this.offset().top;
            var scrollTop = $(window).scrollTop();
            var windowHeight = window.innerHeight;
            var windowBottom = scrollTop + windowHeight;
            var percentScrolled = (windowBottom - top) / (container_height + windowHeight);
            var parallax = Math.round((parallax_dist * percentScrolled));

            if (initial) {
              $img.css('display', 'block');
            }
            if ((bottom > scrollTop) && (top < (scrollTop + windowHeight))) {
              $img.css('transform', "translate3D(-50%," + parallax + "px, 0)");
            }
          }

          // Wait for image load
          $this.children("img").one("load", function() {
            updateParallax(true);
          }).each(function() {
            if(this.complete) $(this).load();
          });

          $(window).scroll(function() {
            window_width = $(window).width();
            updateParallax(false);
          });

          $(window).resize(function() {
            window_width = $(window).width();
            updateParallax(false);
          });
        });
      };
  }( jQuery ));
  var max_width = 1860;
  window_width = $(window).width();
  if (window_width > max_width) {
    $('#discoPic').removeClass('parallax');
    $('#discoPic').addClass('parallaxAlt');
  }
  $('.parallax').parallax();

  // When window is resized add/remove parallax effect if window is too big/small
  $(window).resize(function() {
    window_width = $(window).width();
    var hasParallax = $("#discoPic").hasClass("parallax");
    if (window_width > max_width && hasParallax) {
      $('#discoPic').removeClass('parallax');
      $('#discoPic').addClass('parallaxAlt');
    }
    else if (window_width <= max_width && !hasParallax) {
      $('#discoPic').removeClass('parallaxAlt');
      $('#discoPic').addClass('parallax');
      $('.parallax').parallax();
    }
  });

  //Menu becomes black when user scrolls down page
  $(window).scroll(function() {
    if($(this).scrollTop() < 50) { /*height in pixels when the navbar becomes non opaque*/
      $('#opaque-navbar').removeClass('opaque');  //navbar becomes clear
      $('[id="asbestos"]').removeClass('white');
      $('.lessWhite').addClass('lesssWhite');
      $('.bottomleft').removeClass('bottomlefthidden');
    }
    else {
      $('#opaque-navbar').addClass('opaque'); //navbar becomes black
      $('[id="asbestos"]').addClass('white');
      $('.lessWhite').removeClass('lesssWhite');
      $('.bottomleft').addClass('bottomlefthidden');
    }
  });

  // Smooth scrolling for menu buttons
  var scroll = function(key, val) {
  	$(key).click(function() {
      $('body, html').stop().animate({
        scrollTop: $(val).offset().top
      }, 1750);
      return false;
    });
  };

  $(function() {
  	var scrollers = {
  		'.big-brand': 'body',
			'[id="homie"]': 'body',
			'[id="aboutie"]': '#aboutMe',
			'[id="porty"]': '#myPortfolio',
			'[id="conty"]': '#contactMe',
			'.back-to-top': 'body',
			'.fa-envelope-o': '#Contact'
  	};
  	for (var key in scrollers) {
  		scroll(key, scrollers[key]);
  	}
  });

  // Collapsable Mobile Menu
  $( ".cross" ).hide();
  $( ".menu" ).hide();
  $( ".hamburger" ).click(function() {
    $( ".menu" ).slideToggle( "slow", function() {
    });
  });

  $( ".hamburgerItem" ).click(function() {
    $( ".menu" ).slideToggle( "slow", function() {
    });
  });

  // Highlight navbar
  var aChildren = $("nav a").children(); // find the a children of the list items
  var aArray = []; // create the empty aArray
  for (var i=0; i < aChildren.length; i++) {
      var aChild = aChildren[i];
      var ahref = $(aChild).attr('href');
      aArray.push(ahref);
  } // this for loop fills the aArray with attribute href values

  $(window).scroll(function(){
      var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
      var windowHeight = $(window).height(); // get the height of the window
      var docHeight = $(document).height();

      for (var i=0; i < aArray.length; i++) {
          var theID = aArray[i];
          var divPos = $(theID).offset().top -80; // get the offset of the div from the top of page
          var divHeight = $(theID).height(); // get the height of the div in question

          if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
            if (!$("p[href='" + theID + "']").hasClass("lesssWhite")){
              $("p[href='" + theID + "']").addClass("nav-active");
            }
            if ($("p[href='" + theID + "']").hasClass("lesssWhite") && $("p[href='" + theID + "']").hasClass("nav-active")) {
              $("p[href='" + theID + "']").removeClass("nav-active");
            }
          }
          else {
              $("p[href='" + theID + "']").removeClass("nav-active");
          }
      }

      if(windowPos + windowHeight == docHeight) {
          if (!$("nav li:last-child a").hasClass("nav-active")) {
              var navActiveCurrent = $(".nav-active").attr("href");
              $("a[href='" + navActiveCurrent + "']").removeClass("nav-active");
              $("nav li:last-child a").addClass("nav-active");
          }
      }
  });

});
