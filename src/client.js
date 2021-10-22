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

var drag = require('./windowDrag.js')
 
// Pass a query selector or a dom element to the function.
// Dragging the element will drag the whole window.
var clear = drag('.draggable')
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

const supportedLangs = ["bg", "ch", "cs", "da", "de", "el", "en", "es", "es-mx", "et", "fi", "fr", "fr-ca", "hu", "hr", "it", 
"ja", "ko", "ms", "no", "nl", "pl", "pt", "pt-br", "ro", "ru", "sk", "sv", "th", "tr", "zh-cn"]
var langs = supportedLangs
$('.active_langs_text').each(function(){
  $(this).html(langs.length + " selected languages")
})

ipcRenderer.on('apply-langs', (e, choosedLangs) => {
  langs = choosedLangs
  $('.active_langs_text').each(function(){
    $(this).html(langs.length + " selected languages")
  })
  $('#disable_panel').hide()
  e.returnValue = true;
})

function resizeMainWindow(size, callback = function(){}){
  ipcRenderer.sendSync('resize-window', {
    width: $(document).width() > size.width ? $(document).width() : size.width,
    height: $(document).height() > size.height ? $(document).height() : size.height,
  })
  $('.gr').stop().animate(size, 500, function(){
    ipcRenderer.sendSync('resize-window', size)
    callback()
  })
  $('.popup').each(function(){
    $(this).width(size.width).height(size.height)
  })
}

function selectLangs(){
  ipcRenderer.sendSync("chooseLang-window", {
    width: 175,
    height: 500,
    langsOption: supportedLangs,
    cacheLangs: langs
  })
  $('#disable_panel').show()
}

function setTaskResult(group, result){
  $("." + group + " .taskResult").html(result > 0 ? result + " problems" : "&#10004;")
}

function createTableHeader(group, description){
  return "<tr class='" + group + "' style='background-color: #1c1c1c;'><td>" 
  + description + "</td><td class='taskResult'>" 
  + "&olarr;" + "</td></tr>"
}

function createTableEmptyElement(){
  return "<tr style='display: none;'><td></td><td></td></tr>" 
}

function createTableElement(group, path, problemInformation){
  return "<tr class='hiddenContent " + group + "'><td class='tablePathElement'>" 
  + path + "</td><td>" 
  + problemInformation + "</td></tr>" 
}

function invokePythonScript(path, pythonScript){
  return new Promise(resolve => {
    PythonShell.run(__dirname + '/scripts/' + pythonScript + '.py', {
      pythonPath: __dirname + "/scripts/env/python-embed/python",
      args: [JSON.stringify({
        "path": path
      })]
    }, function (err, output) {
      if (err) {
        $('.error').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
        throw err;
      } else {
        $('.success').animate({ opacity: 1 }, 'fast').animate({ opacity: 0 }, 'fast')
        resolve(JSON.parse(output))
      }
    });
  })
}

async function getFilesTree(files, callback){
  var data = []
  for (const f of files) {
    console.log('File Path of dragged files: ', f.path)
    var res = await invokePythonScript(f.path, 'imageDataCollect')
    data.push(res)
  }
  callback(data)
}

function isImage(type){
  return type === "png" || type === "jpg" || type === "jpeg"
}

function localizationCheck(groups){
  $("#table_body tr:last").after(createTableHeader('localizationCheckTask', 'Localization check'))
  groups.forEach((files, groupName) => {
    var tempLangs = [...langs]
    files.forEach((value) => {
      tempLangs = tempLangs.filter((v) => {
        return value.lang !== v
      })
    })
    if (tempLangs.length > 0) {
      $("#table_body tr:last").after(createTableElement('localizationCheckProblem', files[0].folderPath + files[0].groupName, tempLangs))
      $("#table_body tr:last .tablePathElement").on('click', function(){
        require('child_process').exec('start "" "' + files[0].folderPath + '"');
      })
    }
  })
  $("#table_body .localizationCheckTask").on('click', function(){
    $("#table_body .localizationCheckProblem").toggleClass('hiddenContent')
  })
  setTaskResult('localizationCheckTask', $('.localizationCheckProblem').length)
}

function dimensionCheck(groups){
  $("#table_body tr:last").after(createTableHeader('dimensionCheckTask', 'Dimension check'))
  var problemFiles = []

  groups.forEach((files, groupName) => {
    var standardSlice = files.find((file) => file.lang === 'en')
    if(!standardSlice){
      problemFiles.push({
        directoryPath: files[0].folderPath,
        fileName: files[0].groupName + ' -> [en]',
        dimensions: 'unknown'
      })
    }
    files.forEach((f) => {
      var maxSliceSize = f.folderPath.match("common|mobile") ? 1024 : 2048

      if (f.imageDimension[0] > maxSliceSize
        || f.imageDimension[1] > maxSliceSize
        || standardSlice && (f.imageDimension[0] != standardSlice.imageDimension[0]
                          || f.imageDimension[1] != standardSlice.imageDimension[1])) {
        problemFiles.push({
          directoryPath: f.folderPath,
          fileName: f.fileName,
          dimensions: f.imageDimension
        })
      }
    })
  })

  if (problemFiles.length > 0) {
    problemFiles.forEach((value) => {
      var dimmensionMessage = typeof value.dimensions === 'string' ? value.dimensions : value.dimensions[0] + 'x' + value.dimensions[1]
      $("#table_body tr:last").after(createTableElement('dimensionCheckProblem', value.directoryPath + value.fileName, dimmensionMessage))
      $("#table_body tr:last .tablePathElement").on('click', function(){
        require('child_process').exec('start "" "' + value.directoryPath + '"');
      })
    })
  }
  $("#table_body .dimensionCheckTask").on('click', function(){
    $("#table_body .dimensionCheckProblem").toggleClass('hiddenContent')
  })
  setTaskResult('dimensionCheckTask', $('.dimensionCheckProblem').length)
}

function optimizationCheck(groups){
  $("#table_body tr:last").after(createTableHeader('optimizationCheckTask', 'Optimization check'))
  var problemFiles = []

  groups.forEach((files, groupName) => {
    files.forEach((f) => {
      var maxColorPepth = f.folderPath.match("common|mobile") ? 8 : 32

      if(f.colorDepth > maxColorPepth){
        problemFiles.push({
          directoryPath: f.folderPath,
          fileName: f.fileName,
          colorBit: f.colorDepth
        })
      }
    })
  })

  if (problemFiles.length > 0) {
    problemFiles.forEach((value) => {
      $("#table_body tr:last").after(createTableElement('optimizationCheckProblem', value.directoryPath + value.fileName, value.colorBit +  'bit'))
      $("#table_body tr:last .tablePathElement").on('click', function(){
        require('child_process').exec('start "" "' + value.directoryPath + '"');
      })
    })
  }
  $("#table_body .optimizationCheckTask").on('click', function(){
    $("#table_body .optimizationCheckProblem").toggleClass('hiddenContent')
  })
  setTaskResult('optimizationCheckTask', $('.optimizationCheckProblem').length)
}

function collectResources(directory){
  var collectedFiles = []
  directory.children.forEach((file) => {
    if(file.type === 'directory'){
      collectedFiles = collectedFiles.concat(collectResources(file))
    }else if(isImage(file.type)){
      collectedFiles.push(file)
    }
  })
  return collectedFiles
}

function checkTasks(directory){
  var collectedFilesByNames = new Map()

  collectResources(directory).forEach((value) => {
    var group = value.folderPath + value.groupName
    if(collectedFilesByNames.get(group)){
      collectedFilesByNames.get(group).push(value)
    }else{
      collectedFilesByNames.set(group, [value])
    }
  })


  if (collectedFilesByNames.size > 0) {
    localizationCheck(collectedFilesByNames)
    dimensionCheck(collectedFilesByNames)
    optimizationCheck(collectedFilesByNames)
  }
}

$(".table_tool")[0].addEventListener('dragenter', (e) => {
  $(".dragAndDropArea").show()
})

$(".dragAndDropArea")[0].addEventListener('drop', (event) => { 
  event.preventDefault(); 
  event.stopPropagation(); 
  $(".dragAndDropArea")[0].dispatchEvent(new CustomEvent("dragleave"))
  $(".table_tool").removeClass("hidden")
  $(".third_tool #apply.btn-hover").removeClass("disabled")
  $(".third_tool #expand.btn-hover").removeClass("disabled")
  $(".dragAndDropArea").addClass("hidden")
  $(".dragAndDropArea").hide();
  $(".dragAndDropArea .base").hide()
  $(".dragAndDropArea .active_langs_text").hide()
  $("#table_body").html(createTableEmptyElement())
  $(".loader_container").removeClass("hiddenContent")

  getFilesTree(event.dataTransfer.files, function(objArray){
    checkTasks({
      name: 'stub',
      path: 'stub',
      type: 'directory',
      children: objArray
    })
    $(".loader_container").addClass("hiddenContent")
  })
}); 

$(".dragAndDropArea")[0].addEventListener('dragover', (e) => { 
  e.preventDefault(); 
  e.stopPropagation(); 
}); 

$(".dragAndDropArea")[0].addEventListener('dragenter', (e) => {
  console.log('File is in the Drop Space'); 
  if($(".dragAndDropArea").hasClass("hidden")){
    $(".dragAndDropArea").removeClass("hidden")
  }
  $(".dragAndDropArea").addClass("dragIN")
  $(".dragAndDropArea .base, .dragAndDropArea .drag_in").toggleClass("hidden")
}); 

$(".dragAndDropArea")[0].addEventListener('dragleave', (e) => { 
  console.log('File has left the Drop Space'); 
  if(!$(".table_tool").hasClass("hidden")){
    $(".dragAndDropArea").addClass("hidden")
    setTimeout(() => {
      $(".dragAndDropArea").hide();
    }, 300)
  }
  $(".dragAndDropArea").removeClass("dragIN")
  $(".dragAndDropArea .base, .dragAndDropArea .drag_in").toggleClass("hidden")
}); 

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
