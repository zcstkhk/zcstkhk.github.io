
dojo.require("dojo.parser");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.LinkPane");
dojo.require("dijit.Tree");
dojo.require("dojox.layout.ToggleSplitter");
dojo.require("dijit.Dialog");
dojo.require("dojo.i18n");
dojo.require("dojo.back");
dojo.require("dojo.cookie");
dojo.require("xps.form.Button");
dojo.require("xps.form.DropDownButton");

// Get message object for localization
dojo.registerModulePath("xps", "../xps");
var messages = null;

var floating=null;
var metadataOverride=null;
var selectedStep=null;
var searchResultFile=null;
var loading=false;

var swfCount=0;
var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;

var activityWin={
	size:{w:'400',h:'800'},
	location:{x:'1',y:'1'}};

var simulationWin={
	size:{w:'1000',h:'800'},
	location:{x:'1',y:'1'}};

var controller = {
  metadata:null,
  xpsMapData:null,
  xpsMapList:null,
  currentIndex:null,
  mainDiv:null,
  topicSetDir:null,
  rootDir:null,
  startFile:null,
  vars:getQueryValue(window.location.search,"vars"),
  
  init: function() {
    // If debug and IE then make room for firebug
    if (dojo.config.isDebug && dojo.isIE) dojo.byId("view").style.height="400px";
    
    this.topicSetDir=new String(document.location);
    
    if (this.topicSetDir.indexOf("?")!=-1)
    	this.topicSetDir=this.topicSetDir.substring(0,this.topicSetDir.lastIndexOf('?'));
    
    if (this.topicSetDir.indexOf("#")!=-1) 
    	this.topicSetDir=this.topicSetDir.substring(0,this.topicSetDir.lastIndexOf('#'));

    this.startFile=this.topicSetDir.substring(this.topicSetDir.lastIndexOf('/')+1);
        
    this.topicSetDir=this.topicSetDir.substring(0,this.topicSetDir.lastIndexOf('/'));
    this.rootDir=this.topicSetDir.substring(0,this.topicSetDir.lastIndexOf('/'));

    // Start by getting the metadata
    mdata=this.topicSetDir + "/metadata.json";
    
    dojo.xhrGet({
	  url:mdata,
	  handleAs:"json",
      load:this._loadView,
      error:function(responseObject, ioArgs) {
        console.error(responseObject);
        console.error(ioArgs);
      }
    });
  },
  
  // Context of loadView (this) is the dojo.xhrGet object!!
  _loadView:function(responseObject, ioArgs) {
    _self=top.controller;
    _self.metadata=responseObject;
    
    //get the localized messages for the given language
    dojo.requireLocalization("xps", "messages",_self.metadata.language);
    messages = dojo.i18n.getLocalization("xps","messages",_self.metadata.language);
    
    if (metadataOverride) {
      _self.metadata.title=metadataOverride.title;
      _self.metadata.view=metadataOverride.view;
      _self.metadata.simulationPage=metadataOverride.simulationPage;
    }
    
    _self.xpsMapData = new dojo.data.ItemFileReadStore({
      url:_self.startFile.substring(0,_self.startFile.lastIndexOf(".")) + "_map.json",
      queryOptions:{deep:true}
    });
    
    // Get a flat list of toc objects with file settings
    var query={file:'*'};
    _self.xpsMapData.fetch({query:query,onComplete:_self._getItemsWithFiles,queryOptions:{deep:true}});

    // Get the view div and load the appropiate view into it.
    viewDiv=dijit.byId('view');
  
    //call "_viewLoaded" after the view template is done loading
    dojo.addOnLoad(viewDiv,_self._viewLoaded);
    
    // Get the view
    altView=getQueryValue(window.location.search,"view");
    var view=altView ? altView : _self.metadata.view;
    
    if (altView) _self.metadata.view=altView;
    
    //Load the custom script for this view.
    dojo._loadPath(_self.rootDir + "/xps3/" + view + "/js/script.js");
    
    //Set the view
    viewDiv.attr('href',_self.rootDir + "/xps3/" + view + "/view.html");
    
    //Set the stylesheets
    viewStyle = dojo.byId('viewStyles');
    viewStyle.setAttribute('href',_self.rootDir + "/xps3/" + view + "/css/styles.css");

    //load custom javascript
    if (_self.metadata.workingConfigurationMap.customJavaScript && _self.metadata.workingConfigurationMap.customJavaScript!='')
    	dojo._loadPath(_self.rootDir + "/" + _self.metadata.workingConfigurationMap.customJavaScript);
  
    //TODO Set custom stylesheet if there is one.
    
  },
  
  _getItemsWithFiles: function(items, request) {
    _self=top.controller;
    _self.xpsMapList=items;
  },
  
  _viewLoaded: function() {
    _self=top.controller;
    
    // Get the main div and load it
    _self.mainDiv=dijit.byId('mainDiv');
    
    if (_self.mainDiv && _self.xpsMapList) {
      // Fire the onLoad function each time the mainDiv tag is loaded
      dojo.connect(_self.mainDiv,"onLoad",_self._mainLoaded);
      dojo.connect(_self.mainDiv,"onUnload",_self.mainUnloaded);
      dojo.connect(_self.mainDiv,"resize",resizePage);
      
      // call public function
      _self.viewLoaded();
      
      // This is a hack to fix a problem with the main layout area 
      // overlaping the top area. Calling resize seems to fix the problem!!
      var bc=dijit.byId("topBorderContainer");
      bc.resize();
    
    } else {
      setTimeout(dojo.hitch(_self,_self._viewLoaded),100);
    }
  
  },
  
  viewLoaded: function() {
    //stub
  },
  
  _mainLoaded: function() {
    _self=top.controller;
    
    var currentPage=new String(_self.mainDiv.attr('href'));
    currentPage=currentPage.substring(_self.topicSetDir.length+1);
    
    // If there is an anchor then remove it
	if (currentPage.indexOf("#")!=-1)
		currentPage=currentPage.substring(0,currentPage.indexOf("#"));
    
    //If the page loaded is from a search then use the searchResultFile
    if (currentPage=='' && searchResultFile!=null) {
      currentPage=searchResultFile;
      searchResultFile=null;
    }
       
    // Call pageLoader after the query is complete
    var query={file:currentPage};
    _self.xpsMapData.fetch({query: query,onComplete:_self._pageLoader,queryOptions: {deep:true}});
  },
  
  mainUnloaded: function() {
    //Stub
  },
  
  _pageLoader: function(items, request) {
    _self=top.controller;
    
    if (items.length==1 && dojo.indexOf(_self.xpsMapList,items[0])!=-1) {
      _self.currentIndex=dojo.indexOf(_self.xpsMapList,items[0]); 
      
      //move the scrollbars to the top
      var mainDiv=dojo.byId("mainDiv");
      mainDiv.scrollTop=0;
      
      _self.pageLoader(items[0]);
      
      // setup the footer content.
      _self._initFooter();
      
      loading=false;
  
    }
  },
  
  pageLoader: function(item) {
    //stub
  },
  
  _initFooter: function() {
    _self=top.controller;
    _self.mainUnloaded();
    
    if (_self.vars && _self.vars.indexOf("-nav")!=-1) {
    	//Do nothing
    } else {
    	//Add the next/prev buttons to the bottom of each page
    	var footer=new dijit.layout.ContentPane({}, "footer");
     
    	var footerFile="footer.html";
    	if (_self.currentIndex==_self.xpsMapList.length-1)
      		footerFile="footer_last.html";
      
    	if (footer!=null) {
      		footer.attr("href","../xps3/" + controller.metadata.view + "/" + footerFile);
      		dojo.addOnLoad(footer,_self._footerLoaded);
    	}
    
    }
    
  },

  _footerLoaded: function() {
    _self=top.controller;
    
    var bottomLeftButton=dijit.byId('bottomLeftButton');
    var bottomRightButton=dijit.byId('bottomRightButton');
    
    if (bottomLeftButton && bottomRightButton) {
      bottomLeftButton.attr('disabled',controller.currentIndex==0);
	  bottomLeftButton.attr("title",messages.prevPage);
      
      bottomRightButton.attr('disabled',controller.currentIndex==controller.xpsMapList.length-1);
	  bottomRightButton.attr("title",messages.nextPage);
      
      _self.footerLoaded();
      
      top.resizePage();
      
    } else {
      setTimeout('_self._footerLoaded()',100);
    }
  
  },
  
  footerLoaded: function() {
    //stub
  },
  
  unload: function() {
    _self=top.controller;
    
    if (dojo.isIE) {
        h = document.body.offsetHeight;
        w = document.body.offsetWidth;
  	  	x = (document.all)?window.screenLeft-8:window.screenX;
    } else {
        h = window.innerHeight;
        w = window.innerWidth;
        x = (document.all)?window.screenLeft-4:window.screenX;
    }

    y = (document.all)?window.screenTop-30:window.screenY;
      
    _self.unloadView(h,w,x,y);
  },
  
  
  unloadView:function(h,w,x,y) {
    //stub
  },
  
  
  initTree:function() {
  	//stub
  }
  
  
}

function init() {
  controller.init();
}

function unload() {
  controller.unload();
  
  if (aicc.lmsOK) aicc.scheduleExit();
}


dojo.addOnLoad(init);
dojo.addOnUnload(unload);

var resizePage=function() {
  dojo.query(".flash").forEach(function(item) {
    if (item.id) {
	  resizeFlashObj(item.id);
    }
  });
}

/* ----------------------------------------------- */
/* ----------------------------------------------- */
/* ----------------------------------------------- */

function findNodeYPos(obj) {
  var curtop = 0;

  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
      
    } while ((obj = obj.offsetParent) && (obj.id.indexOf("TreeNode")!=-1));
  }
  
  return curtop+1;
}

/* ----------------------------------------------- */

function setFloatingSelection(tagId) {
  var topBorderContainer=dijit.byId("topBorderContainer");
  var leftSplitter=topBorderContainer.getSplitter("left");
  
  // if the splitter does not exist then return
  if (leftSplitter==null) return;
  
  if (floating==null) floating=dojo.byId('floatingSelection');
    
  if (!leftSplitter.open) {
    floating.style.display="none";
    return;
  }
     
  var widgetNode=dijit.byId(tagId);
  var tagNode=dojo.byId(tagId);
      
  if (widgetNode && tagNode) {
    if (floating) {  
      var topLoc=findNodeYPos(tagNode);
      if (topLoc>1) floating.style.top=topLoc + "px";
      floating.style.display="block";
      
      // Scroll to the correct location
      var treeDiv=dojo.byId("treeDiv");
      if (treeDiv) treeDiv.scrollTop=topLoc;
      
    }
      
  } else {
    setTimeout("setFloatingSelection('" + tagId + "')",100);
  }
  
}

/* ----------------------------------------------- */

function resetSelection() {
  var tree=dijit.byId("mytree");

  // Hide the floating selecting
  if (floating==null) floating=dojo.byId('floatingSelection');
  
  if (!floating) return;
  
  floating.style.display="none";
            
  // Reset the floating background on the floating node
  if (tree.selectedNode!=null) {
    var n=dijit.byId(tree.selectedNode.id);
        
    if (n && tree.isVisible(n))
      setTimeout("setFloatingSelection('" + tree.selectedNode.id + "')",300);
   
  }
}

/* ----------------------------------------------- */

function popUpPageType(popupPage,type) {  
  //Default vars when type is "activity" or "visualLanguage"
  var vars="menubar=no,status=no,resizable=yes,toolbar=no,scrollbars=yes,location=no,directories=no,left=" + activityWin.location.x + ",top=" + activityWin.location.y + ",height=" + activityWin.size.h + ",width=" + activityWin.size.w;
  
  if (type=="simulation")
    vars="menubar=no,status=no,resizable=yes,toolbar=no,scrollbars=yes,location=no,directories=no,left=" + simulationWin.location.x + ",top=" + simulationWin.location.y + ",height=" + simulationWin.size.h + ",width=" + simulationWin.size.w;
  
  popUpPage(controller.metadata.topicSetId + "/" + popupPage,type,vars);
  
}

/* ----------------------------------------------- */

function popUpPage(popupPage,wName,vars) {
  // Set the window name and remove all dashes
  winName=(((wName!=null) && (wName!='')) ? wName : "newWindow");
  winName=winName.replace("-","");
    
  // If the page is a full url address then just use it.
  if (popupPage.match('^http') || popupPage.match('^ftp:') || popupPage.match('^file:')) theURL=popupPage;
  else theURL=controller.rootDir + "/" + popupPage;

  // Add the topicSet dir into the path if needed.    
  if (theURL.indexOf("{$topicSetDir}")) theURL=theURL.replace("{$topicSetDir}",controller.metadata.topicSetId);
   
  // Open the pupup window
  newWin=open(theURL,winName,vars);
   
  // Make sure the new window has focus.
  newWin.focus();
  this.blur();

  // If this is an assessment windows being popped up then return the window.    
  if (wName=="assessWin_" + controller.metadata.topicSetId) return newWin;
    
}

/* ----------------------------------------------- */

function loadFile(newFile,fileIndex) {
  loading=true;   
  controller.mainDiv.attr('href',controller.topicSetDir + "/" + newFile);
  
  if (fileIndex>-1) fileLoading(fileIndex);
  
}

function loadContent(content,fileName) {
  searchResultFile=fileName;
  controller.mainDiv.attr('content',content);
}

var fileLoading=function(fileIndex) {
  // stub, override as needed
}

/* ----------------------------------------------- */

function gotoPage(num) {
  console.debug("gotoPage, called from flash: " + num );
  if (loading) return;
  
  if (num>controller.xpsMapList.length) {
    console.error("gotoPage: This activity has no page '" + num + "'.");
    
  } else {
    selectedStep=1;
    var goto=alTGoto ? alTGoto : controller.xpsMapList[num-1].file[0];
    loadFile(goto);
    
  }
  
}

/* ----------------------------------------------- */

function updateTree() {
  var tree=dijit.byId("mytree");
  
  if (tree) {
    var path=getPath(controller.xpsMapList[controller.currentIndex]);
    var pathAlreadyVisible=tree.isPathVisible(path);  
    tree.expandPath(path);
    
    // Avoid the 300ms delay if we know the path is already visible
    if (pathAlreadyVisible) setFloatingSelection(tree.selectedNode.id);
    else setTimeout("setFloatingSelection('" + tree.selectedNode.id + "')",300);
    
  } else {
    setTimeout("updateTree()",100);
  } 
}

/* ----------------------------------------------- */

var gotoNextPage=function() {
  if (controller.currentIndex+1 == controller.xpsMapList.length) return;
  
  loadFile(controller.xpsMapList[controller.currentIndex+1].file,controller.currentIndex+1);

}

/* ----------------------------------------------- */

var gotoPrevPage=function() {
  if (controller.currentIndex == 0) return;
  
  loadFile(controller.xpsMapList[controller.currentIndex-1].file,controller.currentIndex-1);

}

/* ----------------------------------------------- */

var selectDropDownItem = function(event) {
  targetId=new String(event.currentTarget.id).split("_")[1];
  loadFile(controller.xpsMapList[targetId].file,targetId);
}


/* ----------------------------------------------- */
// Called when item is selected from the tree

function treeNodeSelected(node,item) {
  if (item.file) loadFile(item.file);
  
  var widgetNode=dijit.byId(node.id);
  
  // Not sure how I want this to work??
  if(widgetNode.isExpandable && !widgetNode.isExpanded) {
    tree=dijit.byId("mytree");
    tree._onExpandoClick({node:widgetNode});
  }
  
}

/* ----------------------------------------------- */

function initTopNavButtons() {
  var menu=dijit.byId('dropDownMenu');
  
  if (menu) {
    dojo.forEach(controller.xpsMapList,
      function(entry,index, array) {
        theDiv=document.createElement("div");
        theDiv.setAttribute('id',"div_" + index);
      
        menuItem=new dijit.MenuItem({
        label: (index+1) + ' - ' + entry.title,
        title: (entry.type=="activity" ? messages.activity + " " : "") +  entry.title,
        showLabel:true,
        iconClass:(entry.type=='activity' ? "activityIcon" : ""),
        onClick: selectDropDownItem},theDiv);
            
        menu.addChild(menuItem);
      }
    );
  }
  
  //Set the tooltip for the top nav buttons
  var leftButton=dijit.byId("leftButton");
  leftButton.attr("title",messages.prevPage);
    
  var rightButton=dijit.byId("rightButton");
  rightButton.attr("title",messages.nextPage);
  
  var dropDownButton=dijit.byId("dropDownButton");
  dropDownButton.attr("title",messages.jumpToPage);
  
}

/* ----------------------------------------------- */

function collapseAllTree() {
  var treeObj = dijit.byId('mytree');
  treeObj.collapseAllChildren();
}

/* ----------------------------------------------- */

function expandAllTree() {
  var treeObj = dijit.byId('mytree');
  treeObj.expandAllChildren();
}

/* ----------------------------------------------- */

function getQueryValue(query,varName) {
  value=null;
    
  if (query.indexOf(varName + "=")!=-1) {
    value=query.substring(query.indexOf(varName + "="));
    value=value.substring(value.indexOf("=")+1);
     
    if (value.indexOf("&")!=-1) value=value.substring(0,value.indexOf("&"));
      
  }
    
  return value;
}
  
/* ----------------------------------------------- */

function getPath(item) {
  var path="/" + item.id;
  var _parentId=item.parent[0];
  
  while(_parentId!='') {
    _par=controller.xpsMapData._getItemByIdentity(_parentId);
        
    path="/" + _par.id + path;
    _parentId=_par.parent[0];
  }
  
  return path;
}

/* ----------------------------------------------- */

dojo.extend(dojox.layout.ToggleSplitter, {
  onOpen: function(){
	setTimeout("resetSelection()",300);
  }
});

/* ----------------------------------------------- */

dojo.extend(dijit.layout.TabContainer, {
  selectChild: function(page) {
	page = dijit.byId(page);

	if(this.selectedChildWidget != page){
		// Deselect old page and select new one
		this._transition(page, this.selectedChildWidget);
		this.selectedChildWidget = page;
		dojo.publish(this.id+"-selectChild", [page]);
	}
    
    if (page.id=="tocTab") {
      updateTree();
    }
  }
});

/* ----------------------------------------------- */

if(!dijit.Tree.prototype.expandPath) {
  dojo.extend(dijit.Tree, {
    selectedNode:null,
    
    _waitThenFocusNode: function(n) {
      // Set the highlighting of the selected nodes,
      dojo.query(".tocItemSelected").removeClass("tocItemSelected");
      dojo.query("#" + n.id + " > .dijitTreeRow").query(".dijitTreeLabel").addClass("menuItemVisited tocItemSelected");
      
      var _t = this;
      setTimeout(function() {
        if (_t.isFocusable()) _t.focusNode(n);
      }, 300);
    },

    expandPath: function(path) {
      var _tree = this;
      var _node = _tree.rootNode;
      var _children= _node.getChildren();
          
      // Remove the first slash if there is one
      if(path.indexOf('/') == 0) { path = path.substring(1); }
            
      var pathArray = path.split('/');
                    
      // go throught each item in the path
      dojo.forEach(pathArray,function(p) {
            
        for(var ii=0; ii<_children.length;ii++) {
            
          _node=_children[ii];
          if (_node.item.id == p) {
                
            // Don't expand the last node in the path
            if (_node.item.id!=pathArray[pathArray.length-1]) _tree._expandNode(_node);
                
            _children=_node.getChildren();
            break;
          }
        }     
      });
          
      // Set the selected node
      _tree.selectedNode=_node;
      
      // Set focus on the node and set the visited state.
      //var topBorderContainer=dijit.byId("topBorderContainer");
	  //var leftSplitter=topBorderContainer.getSplitter("left");
	  //if (leftSplitter.open)  
	  _tree._waitThenFocusNode(_node);
          
    },
        
    isVisible: function(node) {
      var _par=node.getParent();
		              
      while(_par) {
		if (!_par.isExpanded) return false;
		    
		_par=_par.getParent();
		                 
      }
      return true;
          
    },
    
    isPathVisible: function(path) {
      var _tree = this;
      var _node = _tree.rootNode;
      var _children= _node.getChildren();
          
      // Remove the first slash if there is one
      if(path.indexOf('/') == 0) { path = path.substring(1); }
            
      var pathArray = path.split('/');
      var c=0;
      
      // go throught each item in the path
      for (var cc=0;cc<pathArray.length-1;cc++) {
        var p=pathArray[cc];
        
        for(var ii=0; ii<_children.length;ii++) {    
          _node=_children[ii];
          if (_node.item.id == p) {
            if (!_node.isExpanded) return false;

            _children=_node.getChildren();
            break;
          }          
          
        }             
        
      }
      
      return true;
          
    },
    
	_onExpandoClick: function(message) {
	    
	  // summary: user clicked the +/- icon; expand or collapse my children.
	  var node = message.node;
						
	  // If we are collapsing, we might be hiding the currently focused node.
	  // Also, clicking the expando node might have erased focus from the current node.
	  // For simplicity's sake just focus on the node with the expando.
	  this.focusNode(node);

	  if(node.isExpanded){
		this._collapseNode(node);
	  } else {
		this._expandNode(node);
		this.setTitle(node);
	  }
	
	  resetSelection();
		
    },
		
    collapseAllChildren: function() {
      this._collapseChildren(this.rootNode);
      resetSelection();
    },

    _collapseChildren: function(node) {
      var _tree = this;
      var _c = node.getChildren();
      
      for (var i = 0; i < _c.length; i++) {
        var _n = _c[i];
    
        if (_n.isExpandable && _n.isExpanded)
          _tree._collapseNode(_n);
       
        _tree._collapseChildren(_n);
        
      }
    },
    
    expandAllChildren: function() {
      this._expandChildren(this.rootNode);
      resetSelection();
    },
    
    _expandChildren: function(node) {
      var _tree = this;
      var _c = node.getChildren();
      
      for (var i = 0; i < _c.length; i++) {
        var _n = _c[i];
    
        if (_n.isExpandable && !_n.isExpanded)
          _tree._expandNode(_n);
       
        _tree._expandChildren(_n);
        _tree.setTitle(_n);
      }

    },


    setTitle: function(node) {
      var _tree = this;
      var _c = node.getChildren();
      
      for (var i = 0; i < _c.length; i++) {
        var _n = _c[i];
        if (_n.item.type=="activity") _n.attr("title",messages.activity + " " + _n.item.title);
        else _n.attr("title","" + _n.item.title);
    
        if (_n.isExpandable && _n.getChildren().length>0)  {
          _tree.setTitle(_n);
        }
        
      }

    },
    
    getIconClass: function(/*dojo.data.Item*/ item, /*Boolean*/ opened){   
		return (item.type && item.type=="activity") ? "activityIcon" : "dijitLeaf";
	}
    
  });
}

/* ----------------------------------------------- */


function initPopups() {
  dojo.query(".popup").onmouseenter(
    function(evt) {
      var node=evt.currentTarget;
      dojo.addClass(node, "glossaryHover");
      
    }).onmouseleave(
    function(evt) {
      var node=evt.currentTarget;
      dojo.removeClass(node, "glossaryHover");
      
    }).onclick(
    function(evt) {
      var node=evt.currentTarget;
      var id=node.id;
     
      var dialog=dijit.byId(id + "_dialog");
      var link=dijit.byId(id);
     
      if (!dialog._isShown()) 
        dijit.popup.open({
          parent: link,
          popup: dialog,
          around: node
        });
      else 
        dijit.popup.close(dialog);

    });
}

function addStepHighlightBox(stepId) {	
	dojo.query(".step").forEach(
    	function(item) {
    		if (item.id==stepId && overStep==stepId) {
				item.style.border="1px dashed #C3C3C3";
			} else {
				item.style.border="1px solid #FFFFFF";
			}
    	}
    );
}

function initPage() {
  initAssessment();
  initStepList();
}

/* ----------------------------------------------- */
var activeQuestion=null;
function initAssessment() {
  dojo.query(".qButton").onclick(function(evt) {
      if (activeQuestion!=null) {
        dojo.query("#qButton_" + activeQuestion).removeClass("activeQuestionButton");
        dojo.query("#question" + activeQuestion).removeClass("showBlock");
        dojo.query("#questionHelp" + activeQuestion).removeClass("showBlock");
      }

      var qIndex=evt.currentTarget.id;
      qIndex=qIndex.substring(qIndex.indexOf("_")+1);
      
      activeQuestion=qIndex;
      
      questionSelected();
    });
    
  dojo.query("#topQuestionsContainer").forEach(
    function(item) {
      activeQuestion=1;
      questionSelected();
    }
  );    
    
}

/* ----------------------------------------------- */
function questionSelected() {
  
  if (activeQuestion!=null) {
    dojo.query("#qButton_" + activeQuestion).addClass("activeQuestionButton");
    dojo.query("#question" + activeQuestion).addClass("showBlock");
    dojo.query(".helpTextContainer").removeClass("showBlock");
    
    var feedbackButton=dijit.byId("feedbackButton");
    feedbackButton.attr('disabled',false);
    
    var question=dojo.byId("question" + activeQuestion);
    if (question.getAttribute("answered")=="true") {
      showQuestionFeedback();
    }

  }

}

/* ----------------------------------------------- */
function showQuestionFeedback() {
  dojo.query(".helpTextContainer").addClass("showBlock");
  dojo.query("#questionHelp" + activeQuestion).addClass("showBlock");
  
  var question=dojo.byId("question" + activeQuestion);
  question.setAttribute("answered","true");
  
  var feedbackButton=dijit.byId("feedbackButton");
  feedbackButton.attr('disabled',true);
  
  var allCorrect=true;
  dojo.query("input",question).forEach(
    function(item) {
      item.disabled=true;
      
      isCorrect=item.getAttribute("correct");
      
      if (isCorrect=="yes") {
        // Turn on the green checkmark
        dojo.query("#img_" + item.id).removeClass("hideBlock");
        
        if (!item.checked) {
          allCorrect=false;
        }
        
      } else {
      
        if (item.checked) {
          //Turn on red X
          dojo.query("#img_" + item.id).removeClass("hideBlock");
          
          allCorrect=false;
        }
        
      }

    });
    
    //Show the feedback
    if (allCorrect) {
      dojo.query("#incorrect").addClass("hideBlock");
      dojo.query("#correct").removeClass("hideBlock");
      
    } else {
      dojo.query("#incorrect").removeClass("hideBlock");
      dojo.query("#correct").addClass("hideBlock");
      
    }
}

/* ----------------------------------------------- */
var overStep=null;
function initStepList() {

  dojo.query(".step").forEach(
    function(item) {
      console.debug("Test: " + item.id);
      
      if (item.id=="step_1") {
        dojo.query(".stepDetails",item).style("display","block");        
        item.style.background="#F1F7F8";
        selectedStep=1;
      }

    }).onmouseenter(
    function(evt) {
      step=evt.currentTarget.id.split("_")[1];
      if (step!=selectedStep) {
      
        // Set the tooltip
        evt.currentTarget.setAttribute("title",messages.selectStep);
        
        //evt.currentTarget.style.border="1px dashed #C3C3C3";
        evt.currentTarget.style.cursor="pointer";
        
        overStep=evt.currentTarget.id;
        setTimeout("addStepHighlightBox('" + evt.currentTarget.id + "')",800);
      }
      
    }).onmouseleave(
    function(evt) {
      //remove the tooltip
      evt.currentTarget.removeAttribute("title");
      
      evt.currentTarget.style.border="1px solid #FFFFFF";
      evt.currentTarget.style.cursor="default";
      overStep=null;
      
    }).onclick(
    function(evt) {
      var p=evt.currentTarget;
      var stepNum=p.id.split("_")[1];
      gotoStep(stepNum);
      
      stepSelected(stepNum);
      
    });
  

}

var stepSelected=function(stepNum) {
  //stub
}

/* ----------------------------------------------- */

function gotoStep(stepNum) {
  console.debug("gotoStep: " + stepNum);
  
  var steps=dojo.query(".step");
  selectedStep=parseInt(stepNum);
  
  dojo.forEach(steps,
	function(item) {
      step=item.id.split("_")[1];
      item.style.background="#FFFFFF";

      if (step==selectedStep) {
        dojo.query(".stepDetails",item).style("display","block");
        item.style.background="#F1F7F8";
        dojo.query("p",item).removeClass("grayText");
        dojo.query(item).removeClass("grayText");
                               
      } else if (step<selectedStep) {
        dojo.query(".stepDetails",item).style("display","none");
        dojo.query("p",item).addClass("grayText");
        dojo.query(item).addClass("grayText");
                   
      } else if (step>selectedStep) {
        dojo.query(".stepDetails",item).style("display","block");
        dojo.query("p",item).removeClass("grayText");
        dojo.query(item).removeClass("grayText");
                   
      }
          
  });
  
}

/* ----------------------------------------------- */

var selectMenuItem = function() {
  // Grey out each visited item
  var selectedId = "div_" + controller.currentIndex;
  var textId=dojo.byId(selectedId + "_text");
  
  if (textId) {
    dojo.query("#" + selectedId + "_text").addClass("menuItemVisited");
    dojo.query(".menuItemSelected").removeClass("menuItemSelected");
    dojo.query("#" + selectedId).addClass("menuItemSelected");
  }
  
}

/* ----------------------------------------------- */
/* ----------------------------------------------- */

  function exit() {
    if (opener) opener.focus();
    
    window.close();
  }

 /////////////////////////////////////////////////////////////
 // Load the flash object so that active content can be loaded
 /////////////////////////////////////////////////////////////
 
  function loadFlash(obj,data) {     
    // Add the parameters to the src string
    swfSrc=data.swfSrc;
    if (data.parameters!='') {
      swfSrc+="?";
      params=data.parameters.split(",");
      for (ii=0;ii<params.length;ii++) {
        swfSrc+=params[ii];
        if (ii<params.length-1) swfSrc+="&";
      }
    }
    
    swfCount++;
    if (data.width=="100%" && data.height=="100%") {      
      dhtml='<div id="flashDiv'+ swfCount+'" class="flash" align="' + data.align + '">';
    } else {
      dhtml='<div class="flash" align="' + data.align + '">';
    }
    
    // If the plugin is available
    if ((parseFloat(navigator.appVersion.substring(0,4))>4.61 && plugin && parseInt(plugin.description.substring(16,plugin.description.indexOf("."))) >= data.flashVersion) 
          || (dojo.isIE && top.WM_activeXDetect("ShockwaveFlash.ShockwaveFlash." + data.flashVersion))) {
      dhtml+=getObject(data);
                        
    } else {
      if (data.graphSrc!='') {
        dhtml+='<p align="center">';
        dhtml+='<img src="' + data.graphSrc + '"/>';
        dhtml+='</p>';
      } else {
        dhtml+=getObject(data);
      }
    }

    dhtml+='</div>';
    obj.attr('content',dhtml);
    
  }
  
 /////////////////////////////////////////////////////////////
 // Define the object
 ///////////////////////////////////////////////////////////// 
  
  function getObject(data) {
  
   	if(navigator.appName.indexOf("Microsoft") != -1) {
		dhtml='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + data.flashVersion + ',0,0,0" id="ieswf' + swfCount + '" width="'+ data.width + '" height="'+ data.height + '">\n';
		dhtml+='<param name="movie" value="' + swfSrc + '"/>\n';
		dhtml+='<param name="loop" value="'+ data.looping +'">\n';
		dhtml+='<param name="play" value="'+ data.play +'">\n';
		dhtml+='<param name="quality" value="best">\n';
		dhtml+='<param name="menu" value="' + data.menu + '">\n';
		dhtml+='<param name="bgcolor" value="' + data.bgcolor + '">\n';
		dhtml+='<param name="base" value="' + data.base + '">\n';
		dhtml+='<param name="allowscriptaccess" value="always">\n';
		dhtml+='<param name="wmode" value="opaque">\n';
	}
		
	else {
		dhtml='<object type="application/x-shockwave-flash" data="' + swfSrc + '" width="'+ data.width + '" height="' + data.height + '" id="ffswf' + swfCount + '">\n';
		dhtml+='<param name="loop" value="'+ data.looping +'">\n';
		dhtml+='<param name="menu" value="true">\n';
		dhtml+='<param name="quality" value="best">\n';
		dhtml+='<param name="allowscriptaccess" value="always">\n';
		dhtml+='<param name="bgcolor" value="' + data.bgcolor + '">\n';
		dhtml+='<param name="base" value="' + data.base + '">\n';
		dhtml+='<param name="play" value="'+ data.play +'">\n';
		dhtml+='<param name="wmode" value="opaque">\n';
		dhtml+='<a href="http://www.adobe.com/go/getflashplayer">\n';
		dhtml+='<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player">\n';
		dhtml+='</a>\n';
		dhtml+='</object>\n';
	}
    
    return dhtml;
  }
  
  function closeToolTipDialog(id) {
    var dialog=dijit.byId(id);
    dijit.popup.close(dialog);
  }
  
  function showDialog(dialogId) {
    var dialog=dijit.byId(dialogId);
    
    if (dialog) dialog.show();
  }
  
 /////////////////////////////////////////////////////////////
 // Fix the size of the div tags that contain the flash tags.
 ///////////////////////////////////////////////////////////// 
  
  function resizeFlashObj(divId) {
  	if (divId=="") return;
  
    var flashIndex=divId.split('Div')[1];
    
    if (dojo.isIE) {
      obj=dojo.byId("ieswf" + flashIndex);
    } else {
      obj=dojo.byId("ffswf" + flashIndex);
    }

    var flashDiv=dojo.byId(divId);

   if (obj && flashDiv && flashDiv.offsetWidth>0 && obj.PercentLoaded()==100) {
	  try {
		w=obj.GetVariable("width");
		h=obj.GetVariable("height");

		if (w!=null && h!=null) {          
		  // Get the ratio
		  var ratio=h/w;

		  // get the width of the div tag.
		  divW = flashDiv.offsetWidth;

		  // Get the new height;
		  newHeight = Math.round(ratio*divW);
		  flashDiv.style.height = newHeight+'px';

		}

	  } catch (e) {}
      
    } else {
      setTimeout("resizeFlashObj('" + divId + "')",100);
    }

  }

/////////////////////////////////////////////////////////////
// aicc object used for communication with LMS
/////////////////////////////////////////////////////////////

var aicc = {
	keepAliveTime: 600000,
	debug: false,
	aicc_url: "",
	aicc_sid: "",
	hostName: top.document.location.hostname,
	aiccLoc: new String(top.document.location),
	lmsOK: false,
	portNumber: "",
	sabaFwd: "/xps30/servlet/UGSFwd",
	aicc_data: "",
	fwd_url:"",
    
    init: function() {
    	
		if ((this.aiccLoc.indexOf("aicc_url")!=-1) | (this.aiccLoc.indexOf("AICC_URL")!=-1)) this.lmsOK=true;

		if (this.lmsOK) {
			this.aicc_url=(this.aiccLoc.indexOf("aicc_url")!=-1 ?  this._getURLParam(this.aiccLoc,"aicc_url") : this._getURLParam(this.aiccLoc,"AICC_URL"));
			this.aicc_url=decodeURIComponent(this.aicc_url);

		  	if (this.aicc_url.indexOf("http")!=0) this.aicc_url=top.document.location.protocol + "//" + this.aicc_url;

		  	this.aicc_sid=(this.aiccLoc.indexOf("aicc_sid")!=-1 ? this._getURLParam(this.aiccLoc,"aicc_sid") : this._getURLParam(this.aiccLoc,"AICC_SID"));
		  	this.fwd_url= top.document.location.protocol + "//" + this.hostName + this.portNumber + this.sabaFwd;
			
		  	dojo.xhrGet({
				url:this.fwd_url,
				handleAs:"text",
				content: {url:this.aicc_url,session_id:this.aicc_sid,command:"getParam",version:"2.0",aicc_data:""},
				load:this.getDataResponse,
				error:this.connectionError
			});
			

		}
    },
    
    getDataResponse: function(response, ioArgs) {
    	console.debug("dataResponse");
    	
    	_self=top.aicc;
    
		// display errors if any
		if (response.indexOf("error=0")==-1 || _self.debug) {
			console.debug("AICC get data response:\n" + response);
			console.dir(ioArgs);
			alert(response);
		}

		returnData=response.substring(response.indexOf("aicc_data="));
		returnData=returnData.substring(returnData.indexOf("=")+1);

		// Create an array of strings to hold the aicc data.
		_self.aicc_data=((returnData.indexOf("\n")!=-1) ? returnData.split("\n") : returnData.split(" "));

		var lesson_location=_self.getAICCParam("lesson_location");
		var userName=_self.getAICCParam("student_name");
		var userId=_self.getAICCParam("student_id");
		
		// Load the file stored in lesson location.
		if (lesson_location!="" && confirm(messages.startAtPrevLoc)) 
			loadFile(dojo.trim(lesson_location));

		// Call runKeepAlive every 10 min to keep the session from timing out.
		setTimeout(dojo.hitch(_self,_self.runKeepAlive,1),_self.keepAliveTime);
		
		return response;
		
    },
    
    
    getAICCData: function() {
    	tmpStr="";
    
    	for (ii=0;ii<this.aicc_data.length;ii++) {
      		if (ii<this.aicc_data.length-1) tmpStr+=this.aicc_data[ii] + "\n";
      		else tmpStr+=this.aicc_data[ii];
    	}
    
    	return tmpStr;  

  	},
  
	getAICCParam: function(paramName) {
    	c=0;
    	found=false;
    	paramValue="";
    
    	while ((c<this.aicc_data.length) && (! found)) {
      		tmp=this.aicc_data[c];
      
      		if (tmp.indexOf(paramName+"=")==0) {
        		paramValue=tmp.substring(tmp.indexOf("=")+1);
        		found=true;
      		}

      		c++;

    	}
    	
    	return paramValue;
    
  	},
 	
 	setAICCParam: function(paramName, paramValue) {
    	c=0;
    	found=false;
    
    	while ((c<this.aicc_data.length) && (! found)) {
      		tmp=this.aicc_data[c];
      
      		if (tmp.indexOf(paramName+"=")==0) {
        		this.aicc_data[c]=paramName + "=" + paramValue;
        		found=true;
      		}
      
      		c++;
      
    	}
    
    	if (! found) alert("Can't find param: " + paramName);
    
  	},
  	
  	runKeepAlive: function(count) {
  		console.debug("called keepAlive... " + count);
  		count++;
  		this.sendAICCData();
	    setTimeout(dojo.hitch(this,this.runKeepAlive,count),this.keepAliveTime);
  	},
  	
  	sendAICCData: function() {
		if (this.lmsOK) {	      	
		  	dojo.xhrGet({
				url:this.fwd_url,
				handleAs:"text",
				content: {url:this.aicc_url,session_id:this.aicc_sid,command:"putParam",version:"2.0",aicc_data:this.getAICCData()},
				load:this.putDataResponse,
				error:this.connectionError
			});
			
		}
	
	},
	
	putDataResponse: function(response, ioArgs) {
    	_self=top.aicc;
    
		// display errors if any
		if (response.indexOf("error=0")==-1 || _self.debug) {
			console.debug("AICC put data response:\n" + response);
			console.dir(ioArgs);
		}
		
		return response;
	},
	
	setLessonLocation: function(currentPage) {
    	if (this.lmsOK) {
    		this.setAICCParam("lesson_location",currentPage);
    		lessonStatus=this.getAICCParam("lesson_status");
      
      		// If this is the last page then set the lesson status 
      		// to completed "C"
      		if (currentPage==controller.metadata.lastPage) {
      			console.debug("Hit last page, setting lesson status to 'C'");
      			this.setAICCParam("lesson_status","C");
        
      		// Otherwise set it to incomplete (i)
      		} else if ((lessonStatus!="C") && (lessonStatus!="P")) {
        		this.setAICCParam("lesson_status","i");
        		
      		}
            
    	}

	},
  
  
	scheduleExit: function() {
		
    	if (this.lmsOK) {
    	
    		// Send the final data to the lms server
		  	dojo.xhrGet({
				url:this.fwd_url,
				sync:true,
				handleAs:"text",
				content: {url:this.aicc_url,session_id:this.aicc_sid,command:"putParam",version:"2.0",aicc_data:this.getAICCData()},
				load:this.finalDataPostResponse,
				error:this.connectionError
			});
          
    	}
    
  	},
	
	finalDataPostResponse: function(response, ioArgs) {
    	_self=top.aicc;
    
		// display errors if any
		if (response.indexOf("error=0")==-1 || _self.debug) {
			console.debug("AICC final data post Response:\n" + response);
			console.dir(ioArgs);
			alert(response);
			
		} else {
			//Set exitAu
		  	dojo.xhrGet({
				url:_self.fwd_url,
				handleAs:"text",
				sync:true,
				content: {url:_self.aicc_url,session_id:_self.aicc_sid,command:"exitau",version:"2.0"},
				load:_self.exitAuResponse,
				error:this.connectionError
			});
		}
		
		
		return response;
	},
	
	exitAuResponse: function(response, ioArgs) {
		
		// display errors if any
		if (response.indexOf("error=0")==-1 || _self.debug) {
			console.debug("AICC ExitAu Response:\n" + response);
			console.dir(ioArgs);
		}
		
		return response;
	},
	
  	connectionError: function(response, ioArgs) {
  		alert("Connection Error: " + response);
		console.error(response);
		console.dir(ioArgs);  	
  		return response;
  	},
  
    _getURLParam: function(theUrl, theParam) {
      theVal=new String("");
  
      // If the parameter is not in the url then return empty.
      if (theUrl.indexOf(theParam)==-1) return theVal;
  
      theVal=theUrl.substring(theUrl.indexOf(theParam));
      theVal=theVal.substring(theVal.indexOf("=")+1);
  
      if (theVal.indexOf("&")!=-1)
        theVal=theVal.substring(0,theVal.indexOf("&"));
  
      return theVal;
  
  }
}

///////////////////////////////////////////////////////////// 
//
///////////////////////////////////////////////////////////// 
  
function openFileURL(theFile) {    
    theFile_lc=theFile.toLowerCase();
    // If it is a full url then open is as-is.
    if (theFile_lc.match('^http') || theFile_lc.match('^ftp:') || theFile_lc.match('^file:')) {
      loadFrame(top,theFile);
      
    // Otherwise assume that this is a relative path from the root 
    // directory (HTML Destination director).
    //
    // Note: I'm using location= below because in this case it
    // probably ok to add histroy data for this one.
    } else {       
      fullPath=controller.rootDir + "/" + theFile;
      loadFrame(top,fullPath);
    }
    
}

function loadFrame(frame,url) {
    frame.document.location=url;
}

/* ----------------------------------------------- */

 makeUserPrefs = function(page) {
	if (userPrefs==null) return;
	
	var dhtml="<table class='userPrefs'>";
		
	for (ii=0;ii<userPrefs.length;ii++) {
		cookieName="userPref_" + controller.metadata.topicSetId + "_" + userPrefs[ii].id;
		cookieValue=dojo.cookie(cookieName);
		if (cookieValue==null) cookieValue=userPrefs[ii].defaultValue;
		
		dhtml+="<tr><td><b>" + userPrefs[ii].label + ":</b></td><td><input size='40' id='" + userPrefs[ii].id + "' type='text' value='" + cookieValue + "'></td></tr>";
	}
	
	dhtml+="<tr><td>&nbsp;</td><td><button onclick='saveUserPrefs()'>Save</button></td></tr>";
	dhtml+="</table>";
	
	page.attr('content',dhtml);
	
}

/* ----------------------------------------------- */

saveUserPrefs = function() {
	
	for (ii=0;ii<userPrefs.length;ii++) {
		input=dojo.byId(userPrefs[ii].id);
		cookieName="userPref_" + controller.metadata.topicSetId + "_" + userPrefs[ii].id;
		
		dojo.cookie(cookieName,input.value,{expires: 365});
	}
	
	alert("User preferences have been saved.");
}

/* ----------------------------------------------- */

getUserPref = function(id) {
	for (ii=0;ii<userPrefs.length;ii++) {
		if (id==userPrefs[ii].id) {
			cookieName="userPref_" + controller.metadata.topicSetId + "_" + userPrefs[ii].id;
			cookieValue=dojo.cookie(cookieName);
			if (cookieValue==null) cookieValue=userPrefs[ii].defaultValue;
		
			return cookieValue;
		}
		
	}
	
	return null;
}


/**
 * 
 * Copyright 2007-2009
 * 
 * Paulius Uza
 * http://www.uza.lt
 * 
 * Dan Florio
 * http://www.polygeek.com
 * 
 * Arif Ali Saiyed
 * http://arif-ali-saiyed.blogspot.com/
 * 
 * Project website:
 * http://code.google.com/p/custom-context-menu/
 * 
 * --
 * RightClick for Flash Player. 
 * Version 0.6.3
 * 
 */

var RightClick = {
	/**
	 *  Constructor
	 */ 
	init: function (flashObjId,flashContId) {
		this.FlashObjectID = flashObjId;
		this.FlashContainerID = flashContId;
		
		this.Cache = this.FlashObjectID;
		if(window.addEventListener){
			 window.addEventListener("mousedown", this.onGeckoMouse(), true);
		} else {
			document.getElementById(this.FlashContainerID).onmouseup = function() { document.getElementById(RightClick.FlashContainerID).releaseCapture(); }
			document.oncontextmenu = function(){ if(window.event.srcElement.id == RightClick.FlashObjectID) { return false; } else { RightClick.Cache = "nan"; }}
			document.getElementById(this.FlashContainerID).onmousedown = RightClick.onIEMouse;
		}
	},
	/**
	 *  Disable the Right-Click event trap  and continue showing flash player menu
	 */ 
	UnInit: function () { 
		if(window.RemoveEventListener){
			window.addEventListener("mousedown", null, true);
			window.RemoveEventListener("mousedown",this.onGeckoMouse(),true);
		} else {
			document.getElementById(this.FlashContainerID).onmouseup = "" ;
			document.oncontextmenu = "";
			document.getElementById(this.FlashContainerID).onmousedown = "";
		}
	},

	/**
	 * GECKO / WEBKIT event overkill
	 * @param {Object} eventObject
	 */
	killEvents: function(eventObject) {
		if(eventObject) {
			if (eventObject.stopPropagation) eventObject.stopPropagation();
			if (eventObject.preventDefault) eventObject.preventDefault();
			if (eventObject.preventCapture) eventObject.preventCapture();
	   		if (eventObject.preventBubble) eventObject.preventBubble();
		}
	},
	/**
	 * GECKO / WEBKIT call right click
	 * @param {Object} ev
	 */
	onGeckoMouse: function(ev) {
		return function(ev) {
			if (ev.button != 0) {
				RightClick.killEvents(ev);
				if(ev.target.id == RightClick.FlashObjectID && RightClick.Cache == RightClick.FlashObjectID) { RightClick.call(); }
				RightClick.Cache = ev.target.id;
			}
	  	}
	},
	/**
	 * IE call right click
	 * @param {Object} ev
	 */
	onIEMouse: function() {
	  	if (event.button > 1) {
			if(window.event.srcElement.id == RightClick.FlashObjectID && RightClick.Cache == RightClick.FlashObjectID) { RightClick.call(); }
			document.getElementById(RightClick.FlashContainerID).setCapture();
			if(window.event.srcElement.id)	RightClick.Cache = window.event.srcElement.id;
		}
	},
	/**
	 * Main call to Flash External Interface
	 */
	call: function() {
		document.getElementById(this.FlashObjectID).rightClick();
	}
}

/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();