const TOOLS = $('.tool_container');

function init(){
  $('#default_active').attr('id', 'disable_button');
  TOOLS.each(function (index, tool) {
    $(tool).fadeOut(0);
  })
  $('.second_tool').fadeIn(0)

  $('#close-btn').on('click', function(){
    window.close();
  });
}

function applyStyle(element, theme) {
  if (element) {
    element.setAttribute('id', theme);
  }
}

function openTool(button, currentTool) {
  $('#disable_button').removeAttr('id');
  $(button).attr('id', 'disable_button');

  currentTool = $('.' + currentTool)
  currentTool.fadeIn();

  TOOLS.each(function (index, tool) {
    tool = $(tool);
    if(!tool.is(currentTool)){
      tool.fadeOut();
    }
  })
}


$('.toggle').click(function(e){
  $(this).toggleClass('toggle-on');
  $('.sign_word').toggleClass('active12');
});

init();
