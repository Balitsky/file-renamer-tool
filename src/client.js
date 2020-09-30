const TOOLS = $('.tool_container');

function init(){
  var toolNameRegex = new RegExp("([a-zA-Z_]+)(?=['])");
  var defTool = toolNameRegex.exec($('#default_active').attr('onClick')).pop()
  $('#default_active').attr('id', 'disable_button');
  TOOLS.each(function (index, tool) {
    $(tool).fadeOut(0);
  })
  $('.' + defTool).fadeIn(0)
  $('.toggle').trigger('click');


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


$('.toggle').on('click', function(e){
  $(this).toggleClass('toggle-on');
});
$('.toggle#regular').on('click', function(e){
  $('#regular').toggleClass('active12');
});
$('.toggle#hovered').on('click', function(e){
  $('#hovered').toggleClass('active12');
});
$('.toggle#pressed').on('click', function(e){
  $('#pressed').toggleClass('active12');
});
$('.toggle#disabled').on('click', function(e){
  $('#disabled').toggleClass('active12');
});

init();
