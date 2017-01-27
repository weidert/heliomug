function makeOtherStuff() {
    /*
    var imgPath = getBaseURL() + "images/icons/heliomug_icon/heliomug16.png";
    var linkPath = getBaseURL() + "images/icons/heliomug_icon/heliomug256.png";
    var $title = $("header h1");
    var $span = $("<span>");
    $span.append("<a href='" + linkPath + "'><img src='" + imgPath + "' style='display:inline; padding-right:10px; vertical-align:middle' /></a>");
    $span.append("heliomug.com");
    $span.append("<a href='" + linkPath + "'><img src='" + imgPath + "' style='display:inline; padding-left:10px; vertical-align:middle' /></a>");
    $("header").empty();
    $("header").append($title);
    $("header").append($span);
    */
}

function getBaseURL () {
       return location.protocol + "//" + location.hostname + 
             (location.port && ":" + location.port) + "/";
}

function getTopNavList() {

  var basename = getBaseURL();

  var $navList = $("<ul>");

  $navList.append('<li><a href="' + basename + '">Home</a></li>');
  $navList.append('<li><a href="' + basename + 'prog/java">Programs</a></li>');
  $navList.append('<li><a href="' + basename + 'prog/visualizations">Data Vis</a></li>');
  $navList.append('<li><a href="' + basename + 'caller/caller_description.html">Caller</a></li>');
  $navList.append('<li><a href="' + basename + 'prog/web/fckc/">FCKC</a></li>');
  $navList.append('<li><a href="' + basename + 'about.html">About</a></li>');

  return $navList;
}

function getFooterContent() {
  var $footerContent = $("<p>");
  var basename = getBaseURL();

  $footerContent.append("<p>This page belongs to <a href='" + basename + "about.html'>Craig Weidert</a></p>");
  
  return $footerContent;
}
