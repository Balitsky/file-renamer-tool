const TOOLS = $('.tool_container');

class ToggleElement {
  constructor(stateName) {
    this.glowText = $('#' + stateName);
    this.toggleNumberText = $('.toggle#' + stateName + ' .toggle-text-on');
    this.toggleButton = $('.toggle#' + stateName);
    this.active = false;
    this.stateName = stateName;

    addClickHandler(this);
  }
}

const toggleMap = new Map();

function reliseStates(map) {
  var index = 1;
  map.forEach(function (value) {
    if(value.active){
      value.toggleNumberText.text('0' + index++)
    }
  });
}

function addClickHandler(toggle){
  toggle.toggleButton.on('click', function (e) {
    $(this).toggleClass('toggle-on');
    $('.sign_word#' + toggle.stateName).toggleClass('active_glow');
    toggle.active = !toggle.active
    reliseStates(toggleMap);
  });
}

function init() {
  var toolNameRegex = new RegExp("([a-zA-Z_]+)(?=['])");
  var defTool = toolNameRegex.exec($('#default_active').attr('onClick')).pop()
  $('#default_active').attr('id', 'disable_button');
  TOOLS.each(function (index, tool) {
    $(tool).fadeOut(0);
  })
  $('.' + defTool).fadeIn(0)
  $('.toggle').trigger('click');


  $('#close-btn').on('click', function () {
    window.close();
  });

  ['regular', 'hovered', 'pressed', 'disabled'].forEach(function (value) {
    toggleMap.set(value, new ToggleElement(value))
  });
  toggleMap.forEach(function (value) {
    value.toggleButton.trigger('click');
  })
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
    if (!tool.is(currentTool)) {
      tool.fadeOut();
    }
  })
}


/* $('.toggle#hovered').on('click', function (e) {
  $('#hovered').toggleClass('active12');
  var tog = new ToggleElement('hovered')
  tog.toggleNumberText.text('23')
  $('.toggle#regular .toggle-text-on').text('12')
}); */

init();
