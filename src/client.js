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

function openTool(button, currentTool, windowSize) {
  resizeMainWindow(windowSize)

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

import {ipcRenderer} from "electron";

function resizeMainWindow(size, callback = function(){}){
  console.log('LOOOOG')
  ipcRenderer.sendSync('resize-window', {
    width: $(document).width() > size.width ? $(document).width() : size.width,
    height: $(document).height() > size.height ? $(document).height() : size.height,
  })
  $('.gr').stop().animate(size, 500, function(){
    ipcRenderer.sendSync('resize-window', size)
    callback()
  })
}

$(".dragAndDropArea")[0].addEventListener('drop', (event) => { 
  event.preventDefault(); 
  event.stopPropagation(); 
  $(".table_tool").removeClass("hidden")
  $(".dragAndDropArea").addClass("hidden")
  $(".dragAndDropArea").hide();

  for (const f of event.dataTransfer.files) { 
      // Using the path attribute to get absolute file path 
      console.log(event.dataTransfer)
      console.log('-------')
      console.log('File Path of dragged files: ', f.path) 
    } 
}); 

$(".dragAndDropArea")[0].addEventListener('dragover', (e) => { 
  e.preventDefault(); 
  e.stopPropagation(); 
}); 

$(".dragAndDropArea")[0].addEventListener('dragenter', (event) => {
  console.log('File is in the Drop Space'); 
  $(".dragAndDropArea").addClass("dragIN")
  $(".dragAndDropArea .base, .dragAndDropArea .drag_in").toggleClass("hidden")
}); 

$(".dragAndDropArea")[0].addEventListener('dragleave', (event) => { 
  console.log('File has left the Drop Space'); 
  $(".dragAndDropArea").removeClass("dragIN")
  $(".dragAndDropArea .base, .dragAndDropArea .drag_in").toggleClass("hidden")
}); 

function TableElement(){
  this.local = {
    var1: undefined,
    var2: undefined,
    var3: undefined
  }

  this.create = function(){
    return "<tr><td>" 
    + this.local.var1 + "</td><td>" 
    + this.local.var2 + "</td><td>" 
    + this.local.var3 + "</td></tr>"
  }
}

function test() {
  for(var i = 0; i < 22; i++){
    setTimeout(() => {
      var elem = new TableElement()
      elem.local.var1 = "C:\\repositories\\git.bitbucket\\geco-even-the-score\\build\\glu\\" + Math.random()*1000000;
      elem.local.var2 = "1024x1024"
      elem.local.var3 = Math.random()*10 > 5 ? "valid" : "not valid";
      $("#table_body tr:last").after(elem.create())
      var scrollBottom = Math.max($('#table_body').height(), 0);
      $('.tbl-content').scrollTop(scrollBottom);
    }, i*200)
  }
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
$.fn.tablesort({})
