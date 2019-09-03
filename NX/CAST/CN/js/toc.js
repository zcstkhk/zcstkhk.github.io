/*
 Copyright (c) 2005 UGS Corp.
    
 All Rights Reserved.
    
 This software and related documentation are proprietary to UGS Corp.
 */
 
var toc;
var parts=new Array();
var expandPartNode;

// Shared functions common to Toc, Topic and Part

/////////////////////////////////////////////////////////////////
// Add a child node
/////////////////////////////////////////////////////////////////

addChild=function(child) {
  child.parent=this;  
  this.children.push(child);
  
}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

findPage = function(url,stripAnchors) {
  this.node = null;
  this.cntr = 0;
  tempFile = this.file;
  tempURL = url;
 
  // If searching for an index or stripAnchors is true then remove 
  // the anchors.
  if ((tempURL.indexOf("#ndx") != -1) || (stripAnchors)) {
    if (tempURL.indexOf("#") != -1)
      tempURL = tempURL.substr(0,tempURL.indexOf("#"));

    if ((tempFile) && (tempFile.indexOf("#") != -1))
      tempFile = tempFile.substr(0,tempFile.indexOf("#"));
   
  }
  
  // get the real page if this is a global search
  if (tempURL.indexOf("qagent_") != -1 || top.openedByGlobal) {
    if (top.realFile == "") {
      if (window.opener != null && window.opener.location.toString().indexOf("qagent_") != -1) {
        top.realFile = window.opener.docBaseShort;
      }
    }
      
    tempURL = top.realFile;
    if (tempFile.indexOf("#") != -1) {
      tempFile = tempFile.substr(0,tempFile.indexOf("#"));
    }
  }
        
  // See if this is the page
  if ((tempFile != "") && (tempURL==tempFile)) {
    this.node = this;
    top.openedByGlobal = false;
  }
 
  // check all the children
  while ((this.node == null) && (this.cntr < this.children.length)) {
    this.node = this.children[this.cntr].findPage(url,stripAnchors);
    this.cntr++;
  }

  return this.node;
}

/////////////////////////////////////////////////////////////////
// Get the id for the tab (part) that this object belongs to
// of none then return "".
/////////////////////////////////////////////////////////////////

getTab = function() {
 
  // If tabs are not turned on then return
  if (! auxWindow.displayTabs) return "";
  
  if (this.type=="part") {
    return this.id;
  
  } else {
    par=this.parent;
    while (par!=null && par.type!="toc") {
      if (par.type=="part") return par.id;
      
      par=par.parent;
    }
  }
  
  return "";
}

/////////////////////////////////////////////////////////////////
// Return a list of files
/////////////////////////////////////////////////////////////////

getFileList=function(list) {
  
  if ((this.type=="part") 
    && (toc.currentPart) 
    && (toc.currentPart!=this.id) 
    && (toc.currentPart!="all")
    && (auxWindow.displayTabs)) return list;
    
  // If there is a display condition then check it.   
  if (this.displayCondition!="") {    
    dc=eval(this.displayCondition);
    if (!(eval(dc.value))) return list;
  }
  
  if (this.file!='') list.push(this.id);

  for (this.ii=0;this.ii<this.children.length;this.ii++) {
    list=this.children[this.ii].getFileList(list);
  }
  
  return list;
}


/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

setPageNumbers=function() {

  if (this.type=="lesson") {  
    lesLgth=this.addPageNumbers(-1,0);
    this.addPageNumbers(lesLgth,0);
    
  } else {
    for (this.kk=0;this.kk<this.children.length;this.kk++)
      this.children[this.kk].setPageNumbers();

  }

}

/////////////////////////////////////////////////////////////////
// First pass sends -1 as the lessLenght then returns the actuall
// lesson lenght. The second pass adds the page number and the lesson length. 
/////////////////////////////////////////////////////////////////

addPageNumbers=function(lessLength, num) {
  // If this has a file then add page numbers it  
  if (this.file!="") {
    num++;
    
    if (lessLength!=-1) {
      this.pageNum=num;
      this.lessonLength=lessLength;
    }
    
  }
  
  // check all the children
  for (this.cc=0;this.cc<this.children.length;this.cc++)
    num=this.children[this.cc].addPageNumbers(lessLength,num);
    
  return num;
}

/////////////////////////////////////////////////////////////////
// function used by all objects to expand or collapse the node.
/////////////////////////////////////////////////////////////////
setExpanded=function(exp) {
  this.expanded=exp;

  for (this.cc=0;this.cc<this.children.length;this.cc++)
    this.children[this.cc].setExpanded(exp);

}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
// Constructor for Toc object.
/////////////////////////////////////////////////////////////////

function Toc(name, bgcolor, expPrtNd) {
  this.children=new Array();
  this.name=name;
  this.type="toc";
  
  this.currentPage=null;
  this.currentPart=null;
  
  this.parent=null;
  this.bgcolor=(((bgcolor==null) || (bgcolor=='')) ? '#FFFFFF' : bgcolor);
  this.newScroll=-1;
  this.expanded=true;
  this.targetFrame="top.content.aux.aux_main";
  this.targetFrameTabs="top.content.aux.aux_tabs";
  this.linkTarget="top.content.main";
 
  expandPartNode=((expPrtNd!=null && expPrtNd=="true") ? true : false);
  
}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

Toc.prototype.doneLoading=function() {  
  if ((this.newScroll!=-1) && (this.newScroll!=0)) {
    doc=eval(this.targetFrame + ".document");
    if (doc) doc.body.scrollTop=this.newScroll;
    this.newScroll=-1;
  }
}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

Toc.prototype.setCurrentPage=function(pageURL, tool) {
  
  cnt=0;
  rebuildToc=false;
  
  doc=eval(this.targetFrame + ".document");

  // Unselect currentPage so a new currentPage can 
  // be selected.
  if (this.currentPage!=null) {
    tmpNode=this.currentPage;
    
    if (this.currentPage.hide) {
      this.currentPage.auxDisplay.selected=false;
      var obj=getElement(doc,this.currentPage.auxDisplay.id); 
      
    } else {
      this.currentPage.selected=false;
      var obj=getElement(doc,this.currentPage.id);
      
    }
    
    if (obj!=null) obj.style.backgroundColor="transparent";
    
    this.currentPage=null;
  }
  
  while ((this.currentPage==null) && (cnt<this.children.length)) {
    this.currentPage=this.children[cnt].findPage(pageURL,false);
    cnt++;
  }
  
  cnt=0;
  
  // If this.currentPage is still null then call findPage again, this time set 
  // the stripAnchor flag to "true" so any anchors (#xyz) attached to the file 
  // names will be removed (durning the search).
  if (this.currentPage == null) {
    while ((this.currentPage==null) && (cnt<this.children.length)) {
      this.currentPage=this.children[cnt].findPage(pageURL,true);
      cnt++;
    }
  }
  
  // If tabs are displayed then make sure the new currentPage
  // is in the visible tab.
  if ((this.currentPage!=null) && (auxWindow.displayTabs) && (toc.currentPart!="all")) {
    tmpPart=this.currentPage;
    while ((tmpPart!=null) && (tmpPart.type!="part"))
      tmpPart=tmpPart.parent;
    
    // If the new currentPage is in a different part then set it to null.
    if ((toc.currentPart!="all") && (tmpPart!=null) && (tmpPart.id!=toc.currentPart))
      this.currentPage=null;
  }
  
  if (this.currentPage!=null) {
  
    if (this.currentPage.hide) {
      this.currentPage.auxDisplay.selected=true;
      var obj=getElement(doc,this.currentPage.auxDisplay.id);    
      
    } else {
      this.currentPage.selected=true;
      var obj=getElement(doc,this.currentPage.id);
      
    }
    
    if (obj!=null) obj.style.backgroundColor="#c0d2ec";
    
    // Make sure the tree is expanded to display the 
    // selected item.
    par=this.currentPage.parent;

    while(par!=null) {
      if (!par.expanded) rebuildToc=true;
      par.expanded=true;
      par=par.parent;
    }
  
  // If the page was not found then keep the existing page
  } else {    
    this.currentPage=tmpNode;
    this.currentPage.selected=true;
    
    var obj=getElement(doc,this.currentPage.id);
    if (obj!=null) obj.style.backgroundColor="#c0d2ec";    
    
  }
  
  // If the contents tool is not active then just return.
  if (tool!="contents") return;  
  
  // Rebuild the entire toc if NS4 or IE55?
  if ((theBrowser=="NS") && (appVerNum<=4)) {
    this.makeToc();
     
  // Expand the node if the toc is displayed.
  } else if (rebuildToc)  {

    par=this.currentPage.parent;
    ele=getElement(doc,"T_" + par.id);
    
    while ((ele==null) && (par!=null)) {
      par=par.parent;
      ele=((par!=null) ? getElement(doc,"T_" + par.id) : null);
    }
    
    if (ele!=null) ele.innerHTML=par.getTocHTML(par.level);
  
  }
  
  // scroll to the selected item if needed.
  this.setScroll();

}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

Toc.prototype.setScroll=function() {
  doc=eval(this.targetFrame + ".document");
  theNode=getElement(doc,"T_" + this.currentPage.id);
  
  // Oct 14, 2004 fixed object not found error. When trying to 
  // get nNewScroll, sometimes "doc.body" is not valid and returns 
  // an error, when this is the case just return.
  if (doc.body) nNewScroll=doc.body.scrollTop;
  else return;
  
  if (theNode!=null) {
    nodeTop=theNode.offsetTop;
    nodeBottom=nodeTop+theNode.offsetHeight;
    
    if(doc.body.scrollTop + doc.body.clientHeight < nodeBottom){
      nNewScroll=nodeBottom - doc.body.clientHeight;
      }
    if(nodeBottom - nodeTop > doc.body.clientHeight){
      nNewScroll=nodeTop-20;
    }
    
    doc.body.scrollTop=nNewScroll;

    
  }

}

/////////////////////////////////////////////////////////////////
// Return the prev page or null
/////////////////////////////////////////////////////////////////

Toc.prototype.getPrevPage=function(showAll) {
  pp=this.currentPage.prevPage;
  return ((pp) ? pp.file : null);    

}

/////////////////////////////////////////////////////////////////
// Return the next page or null
/////////////////////////////////////////////////////////////////

Toc.prototype.getNextPage=function(showAll) {
  np=this.currentPage.nextPage;
  
  if (np && np.file=='') {
    	return (np.children && np.children.length>1 ? np.children[0].file : null);
  }
  
  return ((np) ? np.file : null);
    
}

/////////////////////////////////////////////////////////////////
// Expand the selected topic/part
/////////////////////////////////////////////////////////////////

Toc.prototype.expand=function(id, forceOpen) {
  node=eval(id);
  orig_expanded=node.expanded;
  doc=eval(this.targetFrame+ ".document");
  
  if (forceOpen) node.expanded=true;
  else node.expanded=!node.expanded;
    
  // Only expand if it is not already expanded.
  if (orig_expanded!=node.expanded) {
    ele=getElement(doc,"T_" + id);
    if (ele!=null) ele.innerHTML=node.getTocHTML(node.level);
  }
  
  // Reload the entire toc for NS4 and maybe IE5.5?
  if ((theBrowser=="NS") && (appVerNum<=4))
    this.makeToc();
    
  return;
  
}

/////////////////////////////////////////////////////////////////
// build the tabs
/////////////////////////////////////////////////////////////////

Toc.prototype.makeTabs=function() {

  // If there are no tabs the just return.
  if (! auxWindow.displayTabs) return;

  txt="";
  frm=eval(this.targetFrameTabs);
  doc=frm.document;
  
  stylesheet="css/ui.css";
  className="tocTabs";
  
  if (theBrowser=="IE") {
    if (doc.styleSheets.length==0) doc.createStyleSheet(stylesheet);  //IE only
  } else {
    this.headEle=doc.getElementsByTagName("head")[0];
    this.head="<title></title><link type='text/css' href='" + stylesheet + "' rel='stylesheet'>";
    this.headEle.innerHTML=this.head;
  }
  
  this.bodyEle=doc.getElementsByTagName("body")[0];
  this.bodyEle.className=className;
  this.bodyEle.setAttribute("bgColor",this.bgcolor);
  
  if ((parts.length>1) && auxWindow.tool=="contents") {

    if (auxWindow.showAllTab) {
      txt+="<nobr>";
      
      // TODO: "All" should be localized.
      if (this.currentPart=="all") {
        txt+="<a class=\"part_tab_selected\" href=\"javascript:top.toc.setCurrentPart('all')\">&nbsp;All&nbsp;</a>\n";
      } else {
        txt+="<a class=\"part_tab\" href=\"javascript:top.toc.setCurrentPart('all')\">&nbsp;All&nbsp;</a>\n";
    
      }
      txt+="</nobr>";
    }
    
    for (a=0;a<parts.length;a++) {
      part=parts[a];
      partid=part.id;
      
      showTab=true;
      
      // If there is a display condition then check it. 
      if (part.displayCondition!="") {
        dc=eval(part.displayCondition);
        if (! eval(dc.value)) showTab=false;
      }      
      
      if (showTab) {
        tmpName=(part.name.indexOf(":")!=-1 ? part.name.split(":")[1] :part.name);
        txt+="<nobr>";
        if (partid==this.currentPart) {
          txt+="<a class=\"part_tab_selected\" href=\"javascript:top.toc.setCurrentPart('" + partid + "')\">&nbsp;" + tmpName + "&nbsp;</a>\n";
        } else {
          txt+="<a class=\"part_tab\" href=\"javascript:top.toc.setCurrentPart('" + partid + "')\">&nbsp;" + tmpName + "&nbsp;</a>\n";
        }
        txt+="</nobr>";
      }
      
    }
  
  }
  
  if (frm) {
    this.bodyEle.innerHTML=txt;
  
  } else {
    setTimeout("toc.makeTabs()",100);
  }
 
}

/////////////////////////////////////////////////////////////////
// build the toc
/////////////////////////////////////////////////////////////////
 
Toc.prototype.makeToc=function() {
  this.makeTabs();
  txt="";
  
  doc=eval(this.targetFrame + ".document");  
  stylesheet=(this.targetFrame=="top.aux_win.aux_main")? "css/ui_collection.css" : "css/ui.css";
  className=(this.targetFrame=="top.aux_win.aux_main")? "collectionToc" : "topicSetToc";
  
  // Note (Sept 7, 2007): use the dom to create the link element for the 
  // stylesheet rather than innerHTML because Safari does not allow using 
  // innerHTML to change the head element.
  this.headEle=doc.getElementsByTagName("head")[0];
  newLink=doc.createElement("link");
  newLink.setAttribute("type","text/css");
  newLink.setAttribute("href",stylesheet);
  newLink.setAttribute("rel","stylesheet");
  this.headEle.appendChild(newLink);  
  
  // TODO: use "doc.body" rather than "this.bodyEle=doc.getElementsByTagName("body")[0]"
  this.bodyEle=doc.getElementsByTagName("body")[0];
  this.bodyEle.className=className;
  this.bodyEle.setAttribute("bgColor",this.bgcolor);
  if (top.toc) this.bodyEle.setAttribute("onLoad","top.toc.doneLoading()");  
  
  if (this.name!="") txt+="<h2><nobr>" + this.name + "</nobr></h2>";
  
  for (ii=0;ii<this.children.length;ii++) {
    txt+=this.children[ii].getTocHTML(0);
    
  }
    
  if (this.bodyEle!=null) {
    this.bodyEle.innerHTML=txt;
  } else {
    alert("Error, no document.");
  }  
  
  // scroll to the selected item if needed.
  this.setScroll();  
  
}

/////////////////////////////////////////////////////////////////
// 
/////////////////////////////////////////////////////////////////

Toc.prototype.setCurrentPart=function(partid) {
  this.currentPart=partid;
  this.setTocData(false);
  
  this.makeToc();
  
  if (this.currentPart!="all")
    this.displayPage(eval(this.currentPart).file);
}

/////////////////////////////////////////////////////////////////
// Change the displayed tab if necessary.
/////////////////////////////////////////////////////////////////

Toc.prototype.setTab=function(path) {
  // If tabs are not turned on or all tabs are displayed then just return
  if ((! auxWindow.displayTabs) || (toc.currentPart=="all")) return "";
    
  n=this.findPage(path);
  tabid=n.getTab();
  
  if ((tabid!="") && (tabid!=toc.currentPart)) {
    // Change the displayed tab
    toc.setCurrentPart(tabid);
    // Set the page
    toc.displayPage(n.file);
  }
  
  
}

/////////////////////////////////////////////////////////////////
// Set the following data in the toc:
// 
//   next Page
//   previous page
//   pageNumbers
//
/////////////////////////////////////////////////////////////////

Toc.prototype.setTocData=function(initAll) {
  fileList=new Array();
  
  // Set the current part
  if (initAll) {
    if ((auxWindow.displayTabs) && (parts.length>1)) {
      cnt=0;
      found=false;
      while ((! found) && (cnt<parts.length)) {
        prt=parts[cnt];
        
        if (prt.displayCondition!="") {
          dc=eval(prt.displayCondition);    
          if (eval(dc.value)) {
            this.currentPart=prt.id;
            found=true
          }
        } else {
          this.currentPart=prt.id;
          found=true        
        }
        
        cnt++;
      }  
    }
  }
  
  // Go throught each child
  for (ii=0;ii<this.children.length;ii++) {
    // get a list of all the files
    fileList=this.children[ii].getFileList(fileList);
    
    
    // set the page numbering for all lessons.
    if (initAll) this.children[ii].setPageNumbers();
    
  }
    
  // Set the startPage
  if (initAll)
    this.currentPage=eval(fileList[0]);
  
  // Go throught each item in fileList and set next 
  // and prev values.
  for (jj=0;jj<fileList.length;jj++) {
    node=eval(fileList[jj]);    
    nextPage=null;
    prevPage=null;
    
    // If first and last item
    if ((jj==0) && (jj==fileList.length-1)) {
      // Do nothing   
      
    // If first item
    } else if (jj==0) {
      nextPage=fileList[jj+1];
      
    // If last item
    } else if (jj==fileList.length-1) {
      prevPage=fileList[jj-1];
    
    // Anything in between
    } else {
      nextPage=fileList[jj+1];
      prevPage=fileList[jj-1];
    
    }
    
    node.nextPage=eval(nextPage);
    node.prevPage=eval(prevPage);
    
    // If this is a hidden node then we need to set its auxDisplay var.
    if ((node.hide) && (jj!=0)) {
      tmp=jj-1;
      while((eval(fileList[tmp]).hide) && (tmp!=0)) tmp--;
      
      node.auxDisplay=eval(fileList[tmp]);
    }
    
  }
  
  // Go throught each child
  for (ii=0;ii<this.children.length;ii++) {
    node=this.children[ii];
    //if (node.hide) this.fixHiddenNodes(node,ii);

    if (node.type=="part") {
      // Go throught each child
      for (jj=0;jj<node.children.length;jj++) {
        node1=node.children[jj];
        if (node1.hide) this.fixHiddenNodes(node1,jj,ii);
      }
      
    } else if (node.hide) {
      this.fixHiddenNodes(node,ii,0);
    }
    
    
  }
    
}

/////////////////////////////////////////////////////////////////
// Deal with first level topics for Activities when tocDisplay
// is set to hide.
/////////////////////////////////////////////////////////////////

Toc.prototype.fixHiddenNodes=function(node,idx,prtIdx) {
  
  if (node.parent.type=="toc") {
    
    //Find the previous node
    cnt=idx-1;
    prevUnhiddenNode=(cnt>=0) ? node.parent.children[cnt] : null;
    
    while ((cnt>=0) && (prevUnhiddenNode!=null) && (prevUnhiddenNode.hide)) {
      cnt--;
      prevUnhiddenNode=(cnt>=0) ? node.parent.children[cnt] : null;

    }
    
    prevUnhiddenNode=this.getLastChild(prevUnhiddenNode);
  
    //Find the next node
    cnt=idx+1;
    nextUnhiddenNode=(cnt<node.parent.children.length) ? node.parent.children[cnt] : null;
    while ((cnt<node.parent.children.length) && (nextUnhiddenNode!=null) && (nextUnhiddenNode.hide)) {
      cnt++;
      nextUnhiddenNode=(cnt<node.parent.children.length) ? node.parent.children[cnt] : null;
    }
        
  } else if (node.parent.type=="part") {
    
    // Find the previous node
    cnt=idx-1;
    prevUnhiddenNode=(cnt>=0) ? node.parent.children[cnt] : null;
    while ((cnt>=0) && (prevUnhiddenNode!=null) && (prevUnhiddenNode.hide)) {
      cnt--;
      prevUnhiddenNode=(cnt>=0) ? node.parent.children[cnt] : null;
    }
      
    // If all the prev siblings are also hidden then just use the parent (part)
    if (prevUnhiddenNode==null) prevUnhiddenNode=node.parent;
        
    // Find the next node
    cnt=idx+1;
    nextUnhiddenNode=(cnt<node.parent.children.length) ? node.parent.children[cnt] : null;
    while ((cnt<node.parent.children.length) && (nextUnhiddenNode!=null) && (nextUnhiddenNode.hide)) {
      cnt++;
      nextUnhiddenNode=(cnt<node.parent.children.length) ? node.parent.children[cnt] : null;
    }
    
    // If the next node is still null then find the next parent level node
    if (nextUnhiddenNode==null) {
      cnt=prtIdx+1;
      nextUnhiddenNode=(cnt<node.parent.parent.children.length) ? node.parent.parent.children[cnt] : null;
      while ((cnt<node.parent.parent.children.length) && (nextUnhiddenNode!=null) && (nextUnhiddenNode.hide)) {
        cnt++;
        nextUnhiddenNode=(cnt<node.parent.parent.children.length) ? node.parent.parent.children[cnt] : null;
      } 
    }
  }
  
  // Find the last child node of the activity.
  lastChild=this.getLastChild(node);
  
  // Reset next and prev values for the nodes before and after the activity pages.
  if (prevUnhiddenNode!=null) {
    if (nextUnhiddenNode!=null)  prevUnhiddenNode.nextPage=nextUnhiddenNode;
    else prevUnhiddenNode.nextPage="";
  }
  
  if (nextUnhiddenNode!=null) {
    if (prevUnhiddenNode!=null)  nextUnhiddenNode.prevPage=prevUnhiddenNode;
    else nextUnhiddenNode.prevPage="";
  }
  
  // Set the next/prev pages on the activity.
  lastChild.nextPage="";
  node.prevPage="";
  
}

/////////////////////////////////////////////////////////////////
// Find the last child for the given node, return the last leaf mode.
/////////////////////////////////////////////////////////////////
Toc.prototype.getLastChild=function(node) {
  
  lastChild=(node.children.length>0) ? node.children[node.children.length-1] : null;
  while(lastChild!=null && lastChild.children.length>0) {
    lastChild=(lastChild.children.length>0) ? lastChild.children[lastChild.children.length-1] : null;
  }
  if (lastChild==null) lastChild=node;
  
  return lastChild;
}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

Toc.prototype.displayPage=function(url, id, forceOpen) {
  // If there is a valid id sent to this function then call expand.
  if (id && (id!="")) this.expand(id,forceOpen);

  theFile=workDir + "/" + url;
  frm=eval(this.linkTarget);
  
  if (frm) {
    //frm.document.location.replace(theFile);    
    if (theBrowser=="IE") frm.document.location=theFile;
    else frm.document.location.replace(theFile);

  }
  
  //Call the top.pageLoader function if we are jumping to another 
  //anchor within the current page.
  if (url.indexOf("#")!=-1) {
    tmpUrl=url.substring(0,url.indexOf("#"));
    tmpCurrent=((this.currentPage.file.indexOf("#")!=-1) ? this.currentPage.file.substring(0,this.currentPage.file.indexOf("#")) : this.currentPage.file);
    
    if (tmpUrl==tmpCurrent) top.pageLoader();
    
  }
}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
Toc.prototype.expandAll=function() {
  this.setExpanded(true);
  this.makeToc();
  this.setScroll();

}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
Toc.prototype.collapseAll=function() {
  this.setExpanded(false);
  this.makeToc();
  this.setScroll();

}

Toc.prototype.addChild=addChild;
Toc.prototype.setExpanded=setExpanded;
Toc.prototype.findPage=findPage;

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
// Constructor for Topic Object
/////////////////////////////////////////////////////////////////

function Topic(name, type, id, file, hidden, displayCondition) {
  // Varables used in both Toc and Topics
  this.children=new Array();
  this.name=name;
  this.type=type;
  this.hide=((hidden=="true") ? true : false);
  this.displayCondition=displayCondition;
  
  // If this item is hidden then this var is used as a 
  // secendary display
  this.auxDisplay=null;
  
  // vars used in only the Topic
  this.id=id;
  this.expanded=false;
  this.selected=false;
  this.file=file;
  this.level=-1;
  
  this.parent=null;
  this.nextPage="";
  this.prevPage="";
  
  this.pageNum=-1;
  this.lessonLength=-1;
  
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// Return some informatin about the objects;
Topic.prototype.getTocHTML=function(level) {
  txt="";
  
  // If this is a hiden node then we are done.
  if (this.hide) return txt;
  
  // If there is a display condition then check it.    
  if (this.displayCondition!="") {
    dc=eval(this.displayCondition);
    if (!(eval(dc.value))) return txt;
  }
  
  if (this.level==-1) this.level=level;
    
  offset=this.level*16;  
  txt+="<div id='" + "T_" + this.id + "'>\n";
  txt+="<div class='node'><nobr>";
  
  // Add the indent for the node
  if (this.children.length>0) {
    if (offset>0)
      txt+="<img src='" + workDir + "/graphics/space.gif' width='" + offset + "' height='5' border='0'>";

  } else {
    txt+="<img src='" + workDir + "/graphics/space.gif' width='" + offset + "' height='5' border='0'>";
  
  }
  
  // put the icon here
  if ((this.type=="lesson") && (this.expanded)) icon="book_open.gif";
  else if ((this.type=="lesson") && (! this.expanded)) icon="book_closed.gif";
  else if ((this.type=="topic") && (this.children.length>0) && this.allChildrenHidden()) icon="concept.gif";  
  else if ((this.type=="topic") && (this.expanded) && (this.children.length>0)) icon="topic_open.gif";
  else if ((this.type=="topic") && (! this.expanded) && (this.children.length>0)) icon="topic_closed.gif";
  else if (this.type=="topicSet") icon="topic_closed.gif";
  else if (this.type=="url") icon="url.gif"; 
  else if (this.type=="action") icon="action.gif"; 
  else icon="concept.gif";
    
  // Add the icon
  if (this.children.length>0) txt+="<a href='javascript:top.toc.expand(\"" + this.id + "\")'><img src='" + workDir + "/icons/" + icon + "' border='0'></a>&nbsp;";
  else txt+="<img src='" + workDir + "/icons/" + icon + "' border='0'>&nbsp;";

  txt+=this.getHTMLLine(this.level) + "</nobr></div>";
    
  if (this.expanded) {
    level++;    
    for (this.ii=0;this.ii<this.children.length;this.ii++)
      txt+=this.children[this.ii].getTocHTML(level);
    
  }
  
  txt+="</div>\n";  
  return txt;
  
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

Topic.prototype.allChildrenHidden=function() {
  for (this.ii=0;this.ii<this.children.length;this.ii++)
      if (!this.children[this.ii].hide) return false
      
  return true;
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

Topic.prototype.getHTMLLine=function(level) {
  line="";
  
  // If the node is selected then add the nodeSel class  
  c=((this.selected) ? "class='selected' " : "");
     
  // If there is a file
  if (this.file!="") {
  
    // If this is a node in the collection list then type='topicSet' or 'url'
    if (this.type=="topicSet") {
      line+="<a id='" + this.id + "' href='javascript:top.launchCourse(\"" + this.file + "\")'>" + this.name + "</a>\n";
    
    } else if (this.type=="url") {
      if (this.file.toLowerCase().indexOf("javascript:")!=-1)
        line+="<a id='" + this.id + "' href=\"" + this.file + "\">" + this.name + "</a>\n";      
      else
        line+="<a id='" + this.id + "' href='javascript:top.launchCourse(\"" + this.file + "\")'>" + this.name + "</a>\n";
    
    // Other types of nodes with children
    } else if (this.children.length>0) {
      line+="<a id='" + this.id + "' " + c + "href='javascript:top.toc.displayPage(\"" + this.file + "\",\"" + this.id + "\",\"true\")'>" + this.name + "</a>\n";
    
    // All others (leaf nodes)
    } else {
      line+="<a id='" + this.id + "' " + c + "href='javascript:top.toc.displayPage(\"" + this.file + "\")' target='main'>" + this.name + "</a>\n";
    
    }
      
  } else if (this.children.length>0) {
    line+="<a id='" + this.id + "' href='javascript:top.toc.expand(\"" + this.id + "\")'>" + this.name + "</a>\n";
    
  } else {
    line+="<font class='nofile' id='" + this.id + "'>" + this.name + "</font>\n";
    
  }
    
  return line;

}

Topic.prototype.getFileList=getFileList;
Topic.prototype.setPageNumbers=setPageNumbers;
Topic.prototype.addPageNumbers=addPageNumbers;
Topic.prototype.findPage=findPage;
Topic.prototype.addChild=addChild;
Topic.prototype.setExpanded=setExpanded;
Topic.prototype.getTab=getTab;


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function Part(name, id, file, displayCondition) {
  this.children=new Array();
  this.name=name;
  this.id=id;
  this.type="part";
  this.level=-1;
  this.pageNum=-1;
  this.lessonLength=-1;
  this.file=file;
  this.displayCondition=displayCondition;
    
  this.expanded=expandPartNode;
  this.selected=false;
  this.hide=false;
  
  parts.push(this);
}

Part.prototype.getTocHTML=function(level) {
  if (this.level==-1) this.level=level;
  
  if ((toc.currentPart) 
    && (toc.currentPart!=this.id) 
    && (toc.currentPart!="all")
    && (auxWindow.displayTabs)) return "";

  // If there is a display condition then check it.    
  if (this.displayCondition!="") {
    dc=eval(this.displayCondition);
    if (!(eval(dc.value))) return "";
  }

  // If the node is selected then add the nodeSel class  
  c=((this.selected) ? "class='selected' " : "");
  
  this.txt="<div id='T_" + this.id + "'><nobr>\n";
  
  offset=this.level*16;
  indentImg="";
  
  // Add the indent for the node
  if (this.children.length>0) {
    if (offset>0)
      indentImg="<img src='" + workDir + "/graphics/space.gif' width='" + offset + "' height='5' border='0'>";

  } else {
    indentImg="<img src='" + workDir + "/graphics/space.gif' width='" + offset + "' height='5' border='0'>";
  
  }
  
  if (this.file!="") {
    this.txt+="<div class='part'>" + indentImg + "<a href='javascript:top.toc.expand(\"" + this.id + "\")'><img src='" + workDir + "/icons/" + ((this.expanded) ? "minus.gif" : "plus.gif") + "' border='0'></a>&nbsp;<a id='" + this.id + "' " + c + "href='javascript:top.toc.displayPage(\"" + this.file + "\",\"" + this.id + "\",\"true\")' target='main'>" + this.name + "</a></div>\n";
  
  } else {
    this.txt+="<div class='part'>" + indentImg + "<a href='javascript:top.toc.expand(\"" + this.id + "\")'><img src='" + workDir + "/icons/" + ((this.expanded) ? "minus.gif" : "plus.gif") + "' border='0'></a>&nbsp;<a id='" + this.id + "' " + c + "href='javascript:top.toc.expand(\"" + this.id + "\")'>" + this.name + "</a></div>\n";  
  
  }
  
  this.txt+="</nobr>\n";

    
  if (this.expanded) {
    level++;  
    for (this.ii=0;this.ii<this.children.length;this.ii++)
      this.txt+=this.children[this.ii].getTocHTML(level);
  }
  
  this.txt+="</div>\n";
  
  return this.txt;
}

Part.prototype.getFileList=getFileList;
Part.prototype.setPageNumbers=setPageNumbers;
Part.prototype.addPageNumbers=addPageNumbers;
Part.prototype.findPage=findPage;
Part.prototype.addChild=addChild;
Part.prototype.setExpanded=setExpanded;
Part.prototype.getTab=getTab;

