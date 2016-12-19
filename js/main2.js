$('document').ready(function($) {

  //Transparent Menu
  $(window).scroll(function() {
    if($(this).scrollTop() < 50) { /*height in pixels when the navbar becomes non opaque*/
      $('#opaque-navbar').removeClass('opaque');  //navbar becomes clear
      $('[id="asbestos"]').removeClass('white');
      $('.lessWhite').addClass('lesssWhite');
    }
    else {
      $('#opaque-navbar').addClass('opaque'); //navbar becomes black
      $('[id="asbestos"]').addClass('white');
      $('.lessWhite').removeClass('lesssWhite');
    }
  });

  // Smooth scrolling
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

  //validate contact form has been filled out properly
  function validateForm() {
    var x = document.forms["myForm"]["name"].value;
    if (x == "") {
        alert("Name must be filled out");
        return false;
    }
  }


});
