

controller.viewLoaded = function() {
  console.debug("viewLoaded...");
  
  // Load the first file in the map list or the value of the goto variable
  alTGoto=getQueryValue(window.location.search,"goto"); 
  goto=alTGoto ? alTGoto : _self.xpsMapList[0].file[0];
  loadFile(goto);

  //constructDropDownButton();
    
  // Set the Title
  //var title=dojo.byId("topicSetTitle");
  //title.innerHTML=_self.metadata.title;
}

/* ----------------------------------------------- */


controller.pageLoader=function(item) {
  console.debug("pageLoader...");

  /*
  // Set the label on the drop-down button
  var dropDownButton=dijit.byId('dropDownButton');
  dropDownButton.attr('label',(controller.currentIndex+1) + " of " + controller.xpsMapList.length);
    
  // Set the disabled status of the buttons
  var leftButton=dijit.byId('leftButton');
  leftButton.attr('disabled',controller.currentIndex==0);
      
  var rightButton=dijit.byId('rightButton');
  rightButton.attr('disabled',controller.currentIndex==controller.xpsMapList.length-1);
  */
  
  //Add the next/prev buttons to the bottom of each page
  var footer=dijit.byId("footer");

  if (footer) {
    footer.attr("href","../xps3/selfPacedExt/footer.html");
    
    dojo.connect(footer,"onLoad",function() {
      var bottomLeftButton=dijit.byId('bottomLeftButton');
      if (bottomLeftButton) bottomLeftButton.attr('disabled',controller.currentIndex==0);
         
      var bottomRightButton=dijit.byId('bottomRightButton');
      if (bottomRightButton) bottomRightButton.attr('disabled',controller.currentIndex==controller.xpsMapList.length-1);

    });
    
  }
      
  //Update the tree
  //updateTree();
 

}

/* ----------------------------------------------- */

controller.mainUnloaded = function() {
  var footer=dijit.byId("footer");
  if (footer) footer.destroyRecursive();  
}