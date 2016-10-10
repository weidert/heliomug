function makeSectionNav() {
  if (doesSideNavExist()) {
    var navString = "<ul>";
    $("section").each(function(index, section) {
      var title = $(section).attr("title");
      var id = "#" + $(section).attr("id");
      if (typeof title !== "undefined") {
        navString += "<li><a href='" + id + "'>" + title + "</a></li>";
      }
    });
    navString += "</ul>";
    $("#sectionNav").append(navString)
    $("#sectionNav").addClass("vertNav");
    $("main").addClass("padLeft");
    handleWindowWidth();
    window.onresize = handleWindowWidth;
  }
}

function doesSideNavExist() {
  return ($("#sectionNav").length > 0);
}

function isSideNavVisible() {
  var width = $(window).width();
  return width > 890;
}

function handleWindowWidth() {
  if (isSideNavVisible() && doesSideNavExist()) {
    $("#sectionNav").removeClass("hide");
    $("main").addClass("padLeft")
  } else {
    $("#sectionNav").addClass("hide");
    $("main").removeClass("padLeft")
  }
}

function makeSiteNav() {
  if ($("#siteNav").length > 0) {
    var navString = "<ul>";
    navString += '<li><a href="http://heliomug.com">Home</a></li>';
    navString += '<li><a href="http://heliomug.com/caller">Caller</a>';
    navString += '<li><a href="http://heliomug.com/prog/java">Programs</a></li>';
    navString += '<li><a href="http://heliomug.com/prog/python/index.html">Machine Learning</a></li>';
    navString += '<li><a href="http://heliomug.com/prog/data">Data Vis</a></li>';
    navString += '<li><a href="http://craigweidert.com"><b>Resume Website</b></a></li>';
    navString += "</ul>";

    $("#siteNav").append(navString);
    $("#siteNav").addClass("horizNav");
  }
}

function makeFooter() {
  var footerString = "<p>This page belongs to <a href='http://craigweidert.com'>Craig Weidert</a></p>"
  if ($("footer").length > 0) {
    $("footer").append(footerString);
  }
}

function makeBackToTopButton() {
  $("body").prepend('<a href="#" id="topButton">Back to Top</a>');
  $("#topButton").click(function() {
  	$('html, body').animate({
  		scrollTop: 0
  	}, 700);
  	return false;
  });

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
}
