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
