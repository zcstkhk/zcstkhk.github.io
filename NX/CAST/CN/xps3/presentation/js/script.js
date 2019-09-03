var usingBrowserNavButtons=false;

controller.viewLoaded = function() {
  
  // Load the first file in the map list or the value of the goto variable
  alTGoto=getQueryValue(window.location.search,"goto"); 
  goto=alTGoto ? alTGoto : _self.xpsMapList[0].file[0];
  loadFile(goto);

  initTopNavButtons();
  
  initNav();
  
  var appState = new ApplicationState(goto,true);
  dojo.back.setInitialState(appState);
    
  // Set the Title
  var title=dojo.byId("topicSetTitle");
  title.innerHTML="Activity: " + _self.metadata.title;
  
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
  //initPage();
  
  //Setup browser back buttons
  if (!usingBrowserNavButtons) {
    var appState = new ApplicationState(item.file,true);
    try {
      // This is causing an error at times in IE when selecting search result links.
      dojo.back.addToHistory(appState);
    } catch(e) {
      console.error(e);
      console.dir(e);
    }
  }
   
  usingBrowserNavButtons=false;
  

}

/* ----------------------------------------------- */

controller.footerLoaded = function() {
  //var closeInfo=dijit.byId("closeInfo");    
  //if (closeInfo)
  //  closeInfo.attr("content",messages.clickCloseActivity);
}

/* ----------------------------------------------- */

controller.mainUnloaded = function() {
  var footer=dijit.byId("footer");
  if (footer) footer.destroyRecursive();  
}

/* ----------------------------------------------- */

ApplicationState = function(page,bookmark) {
  this.page = page;
}
	
dojo.extend(ApplicationState, {
  back: function() {
    loadFile(this.page);
    usingBrowserNavButtons=true;
  },
  forward: function() {
    loadFile(this.page);
    usingBrowserNavButtons=true;
  },
  changeUrl:false
});

/* ----------------------------------------------- */

var overNavDiv=false;
function initNav() {
  dojo.query("#navDiv").onmouseover(
    function(evt) {
      overNavDiv=true;
      setTimeout(dojo.hitch(this,expandNavDiv),500);
    }
  ).onmouseleave(
    function(evt) {
      overNavDiv=false;
      evt.currentTarget.style.height="5px";
    }
  );
  
}

expandNavDiv = function() {
  var navDiv=dojo.byId('navDiv');
  if (overNavDiv) navDiv.style.height="35px";
}