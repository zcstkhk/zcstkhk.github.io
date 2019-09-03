var usingBrowserNavButtons=false;

controller.viewLoaded = function() {
  // fix a problem with the left margin in IE
  if (dojo.isIE)
    dojo.query("#mainDiv").addClass("ieFix");
  
  // Load the first file in the map list or the value of the goto variable
  alTGoto=getQueryValue(window.location.search,"goto");
  goto=alTGoto ? alTGoto : controller.xpsMapList[0].file[0];
  
  // If the goto includes the topicSetId then remove it.
  if (goto.match("/") && goto.substring(0,goto.indexOf("/"))==_self.metadata.topicSetId) 
  	goto=goto.substring(goto.indexOf("/")+1);
  	
  loadFile(goto);
  
  initTopNavButtons();
  
  // Set the Title
  var title=dojo.byId("topicSetTitle");
  title.innerHTML=_self.metadata.title;
  
  controller.initTree();
  selectMenuItem();
  
  var appState = new ApplicationState(goto,true);
  dojo.back.setInitialState(appState);
  
  var topBorderContainer=dijit.byId("topBorderContainer");
  
  // Close or hide the left toc frame if needed
  if (controller.vars && controller.vars.indexOf("-nav")!=-1) {
    var tocContainer=dijit.byId("tocContainer");
  	topBorderContainer.removeChild(tocContainer);
  	dojo.query(".navMenu").style("display","none");
  	
  } else if ((dojo.cookie("tocPaneStatus") && dojo.cookie("tocPaneStatus")=="closed") || (controller.vars && controller.vars.indexOf("-aux")!=-1)) {
    var leftSplitter=topBorderContainer.getSplitter("left");
    leftSplitter.attr("open",false);
    
  }
  
  // Add the tooltip to the splitter bar
  dojo.query("#toggleArea").forEach(
    function(item) {
      item.setAttribute("title",messages.showHideToc);
    });
  
  if (dojo.cookie("activityWin")) activityWin=data=dojo.fromJson(dojo.cookie("activityWin"));
  else dojo.cookie("activityWin",dojo.toJson(activityWin),{expires: 365});
  
  if (dojo.cookie("simulationWin"))	simulationWin=data=dojo.fromJson(dojo.cookie("simulationWin"));	
  else 	dojo.cookie("simulationWin",dojo.toJson(simulationWin),{expires: 365});
    
}

controller.initTree = function() {
  var tree=dijit.byId("mytree");  
  
  if (tree) {
    tree.setTitle(tree.rootNode);
  
    //Set localized data on expand/collapse buttons
  	var expandTree=dijit.byId("expandTree");
  	expandTree.attr("label",messages.all);
  	expandTree.attr("title",messages.expandTree);

  	var collapseTree=dijit.byId("collapseTree");
  	collapseTree.attr("label",messages.all);
  	collapseTree.attr("title",messages.collapseTree);
  	  	
  	var topicsTab=dojo.byId("topicsTab");
  	topicsTab.innerHTML=messages.topics;
  	
  	//Search is currently disabled
  	//var searchTab=dojo.byId("searchTab");
  	//searchTab.innerHTML=messages.search;
  	
  	aicc.init();
  	
  } else {
  	setTimeout(dojo.hitch(controller,controller.initTree),100);
  }

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

  //Update the tree
  updateTree();
  
  // Init the page
  initPage();

  // Setup popups
  initPopups();
 
  // Set the display of the items in the pull-down list
  selectMenuItem();
  
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
  
  // Get the current page
  var currentPage=new String(controller.mainDiv.attr('href'));
  
  // If there is an anchor then jump to it.
  if (currentPage.indexOf("#")!=-1) {
    var anchor=currentPage.substring(currentPage.indexOf("#")+1);
	var mainDiv=dojo.byId("mainDiv");
	var anchorObj=dojo.byId(anchor);
	
	if (anchorObj!=null)
		mainDiv.scrollTop=anchorObj.offsetTop;
	
  }
   
  usingBrowserNavButtons=false;
  
  //Set the new lesson location
  if (aicc && aicc.lmsOK) aicc.setLessonLocation(item.file);
  
}

/* ----------------------------------------------- */

controller.footerLoaded = function() {
  var closeInfo=dijit.byId("closeInfo");
    
  if (closeInfo)
    closeInfo.attr("content",messages.clickCloseCourse);
  
  var exitButton = dojo.byId("exitButton");
  if (exitButton) exitButton.setAttribute("title",messages.closeCourse);
}

/* ----------------------------------------------- */

controller.mainUnloaded = function() {
  var footer=dijit.byId("footer");
  if (footer) footer.destroyRecursive();  
}

/* ----------------------------------------------- */

controller.unload = function() {
  var topBorderContainer=dijit.byId("topBorderContainer");
  var leftSplitter=topBorderContainer.getSplitter("left");
  dojo.cookie("tocPaneStatus",leftSplitter.attr("open") ? "open" : "closed",{expires: 365});
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

