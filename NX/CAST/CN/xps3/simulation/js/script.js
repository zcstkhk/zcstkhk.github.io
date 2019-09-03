
dojo.extend(dijit.layout.BorderContainer, {
  _splitterClass:"dijit.layout._Splitter"
});

var flashSimObj=null;

controller.viewLoaded = function() {
  // Load the first file in the map list or the value of the goto variable
  alTGoto=getQueryValue(window.location.search,"goto"); 
  goto=alTGoto ? alTGoto : _self.xpsMapList[0].file[0];
  loadFile(goto);
  
  initTopNavButtons();
  
  // Set the Title
  var title=dojo.byId("topicSetTitle");
  title.innerHTML=_self.metadata.title;
  
  // Set the display of the items in the pull-down list
  selectMenuItem();
  
  //Load the simulation page
  var simulationPane=dijit.byId("simulationPane");
  simulationPane.attr("href",controller.metadata.simulationPage);
  
  // Open the confirmation dialog
  showConfirm=dojo.cookie("dontShowConfirmSim");
  if (!showConfirm || showConfirm!="true") {
    var confirmSimulationDialog=dijit.byId('confirmSimulationDialog');
    confirmSimulationDialog.attr('title',messages.confirmSimulationDialog);
    
    var simulatedEnv=dijit.byId('simulatedEnv');
    simulatedEnv.attr('content',messages.simulatedEnv);
    
    var performSteps=dijit.byId('performSteps');
    performSteps.attr('content',messages.performSteps);
    
    var dontShowAgain=dojo.byId('dontShowAgain');
    dontShowAgain.innerHTML=messages.dontShowAgain;
    
    var closeButton=dijit.byId('closeButton');
    closeButton.attr('label',messages.close);
  
  	confirmSimulationDialog.show();    
  }
  
}

/* ----------------------------------------------- */

closeConfirmSimulationDialog = function() {
  dijit.byId('confirmSimulationDialog').hide();

  checkbox=dojo.byId('confirmSim');
  if (checkbox.checked) dojo.cookie("dontShowConfirmSim","true",{expires: 365});
}

/* ----------------------------------------------- */

controller.pageLoader=function(item) {
  // Set the label on the drop-down button
  var dropDownButton=dijit.byId('dropDownButton');
  dropDownButton.attr('label',(controller.currentIndex+1) + " " + messages.of + " " + controller.xpsMapList.length);

  // Set the disabled status of the buttons
  var leftButton=dijit.byId('leftButton');
  leftButton.attr('disabled',controller.currentIndex==0);

  var rightButton=dijit.byId('rightButton');
  rightButton.attr('disabled',controller.currentIndex==controller.xpsMapList.length-1);

  // Init the page
  initPage();

  // Set the display of the items in the pull-down list
  selectMenuItem();
  
  // Setup popups
  initPopups();
}

/* ----------------------------------------------- */

controller.footerLoaded = function() {
  var closeInfo=dijit.byId("closeInfo");
  
  if (closeInfo)
    closeInfo.attr("content","<p>" + messages.clickCloseActivity + "</p>");

  var exitButton = dijit.byId("exitButton");
  if (exitButton)
    exitButton.attr("title",messages.closeActivity);
    
}

/* ----------------------------------------------- */

controller.mainUnloaded = function() {
  var footer=dijit.byId("footer");
  if (footer) footer.destroyRecursive();  
}

/* ----------------------------------------------- */

fileLoading=function(fileIndex) {

  //parseInt is needed because selectDropDownItem passes in fileIndex as a string
  var idx = parseInt(fileIndex) + 1;
  console.debug("changeFlashTask: " + idx);
  
  var obj=getFlashSimulationObject();
  
  if (obj!=null) {
    try {
      obj.changeFlashTask(idx);
    } catch (e) {
      console.error(e.message);
    }
  }
 
}

/* ----------------------------------------------- */

stepSelected=function(stepNum) {
  console.debug("changeFlashStep: " + stepNum);
  
  var obj=getFlashSimulationObject();
  if (obj!=null) {
    try {
      obj.changeFlashStep(stepNum);
    } catch (e) {
      console.error(e.message);
    }
  }
}

/* ----------------------------------------------- */

function getFlashSimulationObject() {
  
  if (flashSimObj==null || !flashSimObj.changeFlashTask) {
    var objects=dojo.query("#simulationPane").query(".flash").query("object");
    if (objects.length>0) flashSimObj=objects[0];
  }
  
  return flashSimObj;
}

controller.unloadView=function(h,w,x,y) {
 if (opener && opener.simulationWin) {
    opener.simulationWin.size.h=h;
    opener.simulationWin.size.w=w;
    opener.simulationWin.location.x=x;
    opener.simulationWin.location.y=y;
 
    dojo.cookie("simulationWin",dojo.toJson(opener.simulationWin),{expires: 365});    
  }

}