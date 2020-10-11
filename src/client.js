import { PythonShell } from "python-shell";
import $ from "jquery";
// const { PythonShell } = require('python-shell')


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
    if (value.active) {
      value.toggleNumberText.text('0' + index++)
    }
  });
}

function addClickHandler(toggle) {
  toggle.toggleButton.on('click', function (e) {
    $(this).toggleClass('toggle-on');
    $('.sign_word#' + toggle.stateName).toggleClass('active_glow');
    toggle.active = !toggle.active
    reliseStates(toggleMap);
  });
}

function extractTool(button){
  var toolNameRegex = new RegExp("([a-zA-Z_]+)(?=['])");
  var tool = toolNameRegex.exec(button.attr('onClick')).pop()
  return tool;
}

function init() {
  var defTool = extractTool($('#default_active'));
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

  $(document).on('keypress',function(e) {
    if(e.which == 13) {
      $('.' + extractTool($('#disable_button')) + " #apply").trigger('click');
    }
});
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

function doFileRename() {
  var path = $('.first_tool #path')
  var name = $('.first_tool #name')

  if (path.val() && name.val()) {
    PythonShell.run(__dirname + '/scripts/fileRename.py', {
      pythonPath: __dirname + "/scripts/env/python-embed/python",
      args: [JSON.stringify({
        "path": path.val(),
        "name": name.val()
      })]
    }, function (err, output) {
      if (err) {
        $('.error').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
        throw err;
      } else {
        $('.success').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
        name.val('')
      }
    });
  } else {
    $('.error').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
  }
}

function doButtonFix(){
  var path = $('.second_tool #path')

  if (path.val()) {
    var states = {};
    toggleMap.forEach(function(value, key){
      states[key] = value.active
    })
    PythonShell.run(__dirname + '/scripts/buttonFix.py', {
      pythonPath: __dirname + "/scripts/env/python-embed/python",
      args: [JSON.stringify({
        "path": path.val(),
        "states": states
      })]
    }, function (err, output) {
      if (err) {
        $('.error').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
        throw err;
      } else {
        $('.success').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
        path.val('')
      }
    });
  } else {
    $('.error').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
  }
}

init();
