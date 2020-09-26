class Theme {
  static get FADE_IN() { return "fade-in" };
  static get FADE_OUT() { return "fade-out" };
  static get DISABLED() { return "disable" };
  static get ENABLED() { return "enable" };
}
const TOOLS = document.getElementsByClassName("tool_container");

document.getElementById("close-btn").addEventListener("click", function (e) {
  window.close();
});

function applyStyle(element, theme) {
  if (element) {
    element.setAttribute('id', theme);
  }
}

function openTool(clickedButton, tool) {
  applyStyle(document.getElementById("disable_button"), Theme.ENABLED)
  applyStyle(clickedButton, "disable_button");

  Array.prototype.forEach.call(TOOLS, function (tool) {
    applyStyle(tool, Theme.FADE_OUT)
  });

  var activeTool = document.getElementsByClassName(tool)[0]
  applyStyle(activeTool, Theme.FADE_IN);
}

Array.prototype.forEach.call(TOOLS, function (tool) {
  tool.ontransitionend = () => {
    switch (tool.getAttribute('id')) {
      case Theme.FADE_IN: applyStyle(tool, Theme.ENABLED); break;
      case Theme.FADE_OUT: applyStyle(tool, Theme.DISABLED); break;
    }
  };
});

document.getElementById("default_active").click();
/* $('.toggle').click(function(e){
  e.preventDefault(); // The flicker is a codepen thing
  $(this).toggleClass('toggle-on');
  $('.sign_word').toggleClass('active12');
  console.log($('.sign_word'))
});
$('.btn1').click(function(e){
  $('.first_tool').animate({ opacity: "show" }, "slow");
  $('.second_tool').animate({ opacity: "hide" }, "slow");
});
$('.btn2').click(function(e){
  $('.first_tool').animate({ opacity: "hide" }, "slow");
  $('.second_tool').animate({ opacity: "show" }, "slow");
}); */