
//set site theme based on user preference
detectTheme();

function detectTheme(){
  if (window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  };
};

//toggle theme when selected by user
function setTheme(){
  var theme = document.documentElement.getAttribute("data-theme");
  if (theme == "dark") {
    console.log("Site Appearance set to Light.");
    document.documentElement.setAttribute("data-theme", "light");
  } else if (theme == "light") {
    console.log("Site Appearance set to Dark.");
    document.documentElement.setAttribute("data-theme", "dark");
  };
};