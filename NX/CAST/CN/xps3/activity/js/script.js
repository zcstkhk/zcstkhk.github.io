

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
  
  // Setup popups
  initPopups();

  // Set the display of the items in the pull-down list
  selectMenuItem();
}

/* ----------------------------------------------- */

controller.footerLoaded = function() {
  var closeInfo=dijit.byId("closeInfo");
  
  if (closeInfo)
    closeInfo.attr("content","<p>" + messages.clickCloseActivity + "</p>");
 
  var exitButton = dojo.byId("exitButton");
  if (exitButton) exitButton.setAttribute("title",messages.closeActivity);
  
}

/* ----------------------------------------------- */

controller.mainUnloaded = function() {
  var footer=dijit.byId("footer");
  if (footer) footer.destroyRecursive(); 
}

controller.unloadView=function(h,w,x,y) {
  if (opener && opener.activityWin) {
    opener.activityWin.size.h=h;
    opener.activityWin.size.w=w;
    opener.activityWin.location.x=x;
    opener.activityWin.location.y=y;
 
    dojo.cookie("activityWin",dojo.toJson(opener.activityWin),{expires: 365});    
  }

}