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
  $navList.append('<li><a href="' + basename + 'prog/ml">Machine Learning</a></li>');
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
