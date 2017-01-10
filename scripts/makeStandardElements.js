function makeSectionNav() {
  if (doesSideNavExist()) {
    var $navList = $("<ul>");
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
  return ($("#sectionNav").length > 0);
}

function isSideNavVisible() {
  var width = $(window).width();
  return width > 900;
}

function handleWindowWidth() {
  $("main").css("width", Math.min(900, $(window).width()));
  $("main > div").css("width", Math.min(720, $(window).width()));
  if (isSideNavVisible() && doesSideNavExist()) {
    $('#topButton').fadeIn('slow');
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
  if ($("#siteNav").length > 0) {
    $navList = $("<ul>");
    $navList.append('<li><a href="http://heliomug.com">Home</a></li>');
    $navList.append('<li><a href="http://heliomug.com/prog/java">Programs</a></li>');
    $navList.append('<li><a href="http://heliomug.com/prog/visualizations">Data Vis</a></li>');
    $navList.append('<li><a href="http://heliomug.com/prog/ml">Machine Learning</a></li>');
    $navList.append('<li><a href="http://heliomug.com/caller/caller_description.html">Caller</a></li>');
    $navList.append('<li><a href="http://heliomug.com/prog/web/fckc/">FCKC</a></li>');
    $navList.append('<li><a href="http://heliomug.com/about.html">About</a></li>');
    // $navList.append('<li><a href="http://craigweidert.com"><b>Resume Website</b></a></li>');

    $("#siteNav").append($navList);
    $("#siteNav").addClass("horizNav");
  }
}

function makeFooter() {
  var footerString = "<p>This page belongs to <a href='http://heliomug.com/about.html'>Craig Weidert</a></p>"
  if ($("footer").length > 0) {
    $("footer").append(footerString);
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
  		if (isSideNavVisible()) {
            $('#topButton').fadeIn('slow');
        }
  	} else {
  		$('#topButton').fadeOut('slow');
  	}
  });
}

function makeStandardStuff() {
  makeSectionNav();
  makeSiteNav();
  makeFooter();
  makeBackToTopButton();
  window.onresize = handleWindowWidth;
}
