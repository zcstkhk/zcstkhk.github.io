dojo.extend(dijit.layout.BorderContainer, {
  _splitterClass:"dijit.layout._Splitter"
});

controller.viewLoaded = function() {
  // Set the Title
  var title=dojo.byId("topicSetTitle");
  title.innerHTML="Information: " + _self.metadata.title;
  
  displayMetadata();
  displayPageList();
}

controller.pageLoader=function(item) {
  dojo.query(".glossaryPopup").forEach(
      function(item) {
        item.style.display="block";
      }
  );
}

// Override initFooter so they are not displayed
controller._initFooter=function() {}

function displayMetadata() {
    var metadataHTML="<div class='contentType_'><h2>Metadata</h2>";
    
    metadataHTML+="<p><span class='paraTitle'>Title: </span>" + controller.metadata.title + "</p>";
    metadataHTML+="<p><span class='paraTitle'>Topic Set ID: </span>" + controller.metadata.topicSetId + "</p>";
    metadataHTML+="<p><span class='paraTitle'>Default View: </span>" + controller.metadata.view + "</p>";
    metadataHTML+="<p><span class='paraTitle'>Build Date: </span>" + controller.metadata.buildDate + "</p>";
    metadataHTML+="<p><span class='paraTitle'>XPS Version: </span>" + controller.metadata.xpsVersion + "</p>";

    metadataHTML+="<p style='margin-bottom:0;'><span class='paraTitle'>WorkingConfiguration: </span></p><ul class='unmarkedList'>";
    dojo.forEach(controller.metadata.workingConfiguration,
      function(item,index,array) {
        metadataHTML+="<li>" + item.key + "=" + item.value + "</li>";
      }
    );
    
    metadataHTML+="</ul>";
    metadataHTML+="</div>";
    
    var mainDiv=dijit.byId("mainDiv");
    mainDiv.setContent(metadataHTML);
}

function displayPageList() {
    var pageHTML="<div class='contentType_ infoList'><h2>Course Content</h2>";
    pageHTML+="<ul><li><p><a href='#' onclick='displayMetadata()'>Show Metadata</a></p></li></ul>";
    pageHTML+=getChildList(controller.xpsMapData._arrayOfTopLevelItems);
    pageHTML+="</div>";
    
    var tocContainer=dijit.byId("tocContainer");
    tocContainer.setContent(pageHTML); 
}

function getChildList(listArray) {
  var list="<ul>";

  dojo.forEach(listArray,
    function(item,index,array) {
      //console.dir(item);
      list+="<li>";
      list+="<p><span class='paraTitle'>" + item.title[0] + "</span>";
      if (item.file) list+=" (<a href=\"#\" onclick=\"loadFile('" + item.file[0] + "')\">" + item.file[0] + "</a>)";
      list+="</p>";
      
      list+="<p class='indent'>type:" + item.type[0] + " - id:" + item.id[0] + " - parent:" + item.parent[0] + "</p>";
      
      if (item.children) {
        list+=getChildList(item.children);
      }
      
      list+="</li>";
    }
  );
    
  list+="</ul>";
  
  return list;
}