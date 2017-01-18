function makeSectionNav() {
  if (doesSideNavExist()) {
    var $navList = $("<ul>");
    $("header").attr("id", "top");
    $navList.append("<li><a href='#top'>Top</a>");
    $("section").each(function(index, section) {
      var title = $(section).attr("title");
      var id = "#" + $(section).attr("id");
      if (typeof title !== "undefined") {
        $navList.append("<li><a href='" + id + "'>" + title + "</a></li>");
      }
    });
    $("#sectionNav").append($navList)
    $("#sectionNav").addClass("vertNav");
    $("main > div").addClass("padLeft");
    $("#sectionNav").prependTo("main");
    handleWindowWidth();
  }
}

function doesSideNavExist() {
  return ($("nav#sectionNav").length > 0);
}

function isSideNavVisible() {
  var width = $(window).width();
  return width > 900;
}

function handleWindowWidth() {
  var amountScrolled = 150;
  
  $("main").css("width", Math.min(900, $(window).width()));
  $("main > div").css("width", Math.min(720, $(window).width()));
  if (isSideNavVisible() && doesSideNavExist()) {
    if ($(window).scrollTop() > amountScrolled) {
      $('#topButton').fadeIn('slow');
    }
    $("#topButton").css("left", ($(window).width() - 900) / 2 + 90 - 60 / 2);
    $("#sectionNav").removeClass("hide");
    $("main > div").removeClass("cenDiv")
    $("main > div").addClass("padLeft")
  } else {
    $('#topButton').fadeOut('slow');
    $("#sectionNav").addClass("hide");
    $("main > div").removeClass("padLeft")
    $("main > div").addClass("cenDiv")
  }
}

function makeSiteNav() {
  if ($("#siteNav").length > 0 && typeof getTopNavList == "function") {
    $navList = getTopNavList();
    $("#siteNav").append($navList);
    $("#siteNav").addClass("horizNav");
  }
}

function makeFooter() {
  if ($("footer").length > 0 && typeof getFooterContent == "function") {
    var $footerContent = getFooterContent();
    $("footer").append($footerContent);
  }
}

function makeBackToTopButton() {
    $("main").prepend('<a href="#" id="topButton">Back to Top</a>');
    $("#topButton").click(function() {
      	$('html, body').animate({
  	    	scrollTop: 0
      	}, 700);
  	    return false;
    });
    $("#topButton").css("left", ($(window).width() - 900) / 2 + 90 - 60 / 2);

  var amountScrolled = 150;

  $(window).scroll(function() {
  	if ( $(window).scrollTop() > amountScrolled ) {
  		if (isSideNavVisible() && doesSideNavExist()) {
            $('#topButton').fadeIn('slow');
        }
  	} else {
  		$('#topButton').fadeOut('slow');
  	}
  });
}

function getTopNavList() {
  var $navList = $("<ul>");

  $navList.append('<li><a href="http://heliomug.com">Home</a></li>');
  $navList.append('<li><a href="http://heliomug.com/prog/java">Programs</a></li>');
  $navList.append('<li><a href="http://heliomug.com/prog/visualizations">Data Vis</a></li>');
  $navList.append('<li><a href="http://heliomug.com/prog/ml">Machine Learning</a></li>');
  $navList.append('<li><a href="http://heliomug.com/caller/caller_description.html">Caller</a></li>');
  $navList.append('<li><a href="http://heliomug.com/prog/web/fckc/">FCKC</a></li>');
  $navList.append('<li><a href="http://heliomug.com/about.html">About</a></li>');

  return $navList;
}

function getFooterContent() {
  var $footerContent = $("<p>");
  
  $footerContent.append("<p>This page belongs to <a href='http://heliomug.com/about.html'>Craig Weidert</a></p>");
  
  return $footerContent;
}

function makeStandardStuff() {
  // makes the section nav list
  // if a nav#sectionNav exists
  makeSectionNav();
  
  // this function calls 
  makeBackToTopButton();

  
  // imports a couple of functions to customize the stuff on your website
  $.getScript("/scripts/makeMyStuff.js").done(function() {
    makeSiteNav();
    makeFooter();
  }).fail(function( jqxhr, settings, exception ) {
    console.log(jqxhr);
    console.log(settings);
    console.log(exception);
  });

  // this handles the section nav and "to top" button showing up 
  // and being in the right place
  handleWindowWidth();
  window.onresize = handleWindowWidth;
}
