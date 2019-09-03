/*
 Copyright (c) 2005 UGS Corp.

 All Rights Reserved.

 This software and related documentation are proprietary to UGS Corp.
 */

var workDir;
var bookmarkTool;
workDir=new String(top.document.location);
workDir=workDir.substring(0,workDir.lastIndexOf("/"));

var auxWindow= {
  showAllTab : false,
  displayTabs : false,
  tool : "contents"
}

/////////////////////////////////////////////////////
//Find the Browser and its version
/////////////////////////////////////////////////////

var theAppName=navigator.appName;
var appVerNum=navigator.appVersion.split(".")[0];
var theBrowser="";


if (theAppName!="") {
  // Is Netscape 4 being used
  if ((theAppName=="Netscape") && (appVerNum>="4")) {
    theBrowser="NS";

  // Is IE being used
  } else  if ((theAppName=="Microsoft Internet Explorer") && (appVerNum>="4")) {
    theBrowser="IE";

  }

} else {
  var theBrowser="other";

}

function initCollection () {

  if (top.aux_win
      && top.aux_win.aux_main
      && top.aux_win.aux_main.document
      && top.aux_win.aux_main.document.body) {

    contents.visible=showContents;
    search.visible=showSearch;
    bookmarks.visible=showBookmarks;
    assessments.visible=showAssessments;

    var bookmarkConfig= {
      targetFrame : "",
      toolFrame : "top.aux_win.aux_main",
      ids : topicSetBookmarkIDArray,
      titles : topicSetBookmarkTitleArray,
      workDir : workDir,
      project : project,
      type : "collection",
      launchFile : launchFile
    }

    bookmarkTool=new Bookmarks(bookmarkConfig);

    showHideAux(auxWindow.tool);

  } else {
    setTimeout("initCollection()",100);
  }
}

/////////////////////////////////////////////////////////////////
// Get an element in the given document.
/////////////////////////////////////////////////////////////////

function getElement(doc, nodeID) {
  if(doc.getElementById) return doc.getElementById(nodeID);
  else if(doc.all) return doc.all(nodeID);

  return null;
}

/////////////////////////////////////////////////////////////////
// Launch the course from the collection list.
/////////////////////////////////////////////////////////////////
function launchCourse(launchFile) {

  if (launchFile.toLowerCase().indexOf("http")==0) {
    // If this is an http address then always open it in a new window.
    newWin=open(launchFile,"xps20url","resizable=yes,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars,width=" + popupWidth + ",height=" + popupHeight);

    // Make sure the new window has focus.
    newWin.focus();
  } else if (popupCourse) {
    // Open the popup window
    newWin=open(workDir + "/" + launchFile,"xps20crs","resizable=yes,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars,width=" + popupWidth + ",height=" + popupHeight);

    // Make sure the new window has focus.
    newWin.focus();
  } else {
    top.document.location=workDir + "/" + launchFile;

  }
}

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
function showHideAux(tool) {

  if (tool=="search") {

	if (collectionSearchFile != ""){
  		top.aux_win.aux_main.document.location=workDir + "/" + collectionSearchFile;
  	}
  	else {
    	top.aux_win.aux_main.document.location=workDir + "/search/qagent_start_global.html";
    }

    top.aux_win.aux_nav.document.location="about:blank";
    search.selected=true;
    contents.selected=false;
    bookmarks.selected=false;
    assessments.selected=false;


  } else if (tool=="contents") {

    // There is a problem when jumping from search to contents I think this
    // is caused because the new page tries to load before the search page is
    // unloaded???
    //
    // One way to fix is to reload the page with blank.html then wait until
    // it is completely loaded before loading the contents page. Only do this
    // if the search page is currently loaded.
    //
    // TODO: figure out why this is a problem jumping to the contents page
    // but not when jumping to the bookmarks page (when both are written
    // dynamically).
    loc=new String(top.aux_win.aux_main.document.location);
    if (loc.indexOf("qagent_start_global.html")!=-1 || loc.indexOf("assessmentList.html")!=-1) {
      top.aux_win.aux_main.document.location.replace(workDir + "/blank.html");
      setTimeout("callMakeToc()",100);
    } else {
      callMakeToc();
    }

  } else if (tool=="bookmarks") {
    top.aux_win.aux_nav.document.location="about:blank";
    search.selected=false;
    contents.selected=false;
    bookmarks.selected=true;
    assessments.selected=false;

    bookmarkTool.listBookmarks();
  } else if (tool=="assessments") {
    top.aux_win.aux_main.document.location.replace(workDir + "/assessmentList.html");
    top.aux_win.aux_nav.document.location="about:blank";

    search.selected=false;
    contents.selected=false;
    bookmarks.selected=false;
    assessments.selected=true;

  }

  collectionToolbar.makeToolbar();

}

/////////////////////////////////////////////////////////////////
// This callMakeToc function us used to wait until the new
// blank.html file has been completly loaded before the makeToc
// function is called.
/////////////////////////////////////////////////////////////////

  function callMakeToc() {
    loc=new String(top.aux_win.aux_main.document.location);

    if (loc.indexOf("blank.html")!=-1) {
      toc.makeToc();
      search.selected=false;
      contents.selected=true;
      bookmarks.selected=false;
      assessments.selected=false;

      collectionAuxToolbar.makeToolbar();
      collectionToolbar.makeToolbar();

    } else {
      setTimeout("callMakeToc()",100);
    }
  }

/////////////////////////////////////////////////////////////
// Popup a new page. If the popupPage is set to "glossary",
// "partfile" or "index" then find the corresponding
// file name and use it instead. If no height and with is set
// then don't set it in the open command.
/////////////////////////////////////////////////////////////
function popUpPage(popupPage,wName,w,h) {

  // Set the size of the window if one is specified.
  if ((w!=null) && (w!="") && (h!=null) && (h!=""))
    vars="resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars,width=" + w + ",height=" + h;
  else
    vars="";

  if ((vars=="") && (w.indexOf("resizable=")!=-1))
    vars=w;

  // Set the window name and remove all dashes
  winName=(((wName!=null) && (wName!='')) ? wName : "newWindow");
  winName=winName.replace("-","");

  // If the page is a full url address then just use it.
  if (popupPage.indexOf('http:')!=-1) theURL=popupPage;
  else if (popupPage=="glossary") theURL=workDir + "/" + courseDir + "/" + glossaryFile;
  else if (popupPage=="partfile") theURL=workDir + "/" + courseDir + "/" + partsFile;
  else if (popupPage=="index") theURL=workDir + "/" + indexFile;
  else theURL=workDir + "/" + popupPage;

  // Open the pupup window
  newWin=open(theURL,winName,vars);

  // Make sure the new window has focus.
  newWin.focus();

}

/////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////

  function openFile(theFile) {
    loadFrame(top.main,workDir + "/" + theFile);

  }

/////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////

  function openFileURL(theFile) {

    // If it is a full url then open is as-is.
    if (theFile.toLowerCase().indexOf("http")!=-1) {
      loadFrame(top,theFile);

    // Otherwise assume that this is a relative path from the root
    // directory (HTML Destination director).
    //
    // Note: I'm using location= below because in this case it
    // probably ok to add histroy data for this one.
    } else {
      fullPath=workDir + "/"+ theFile;
      loadFrame(top,fullPath);
    }

  }

 /////////////////////////////////////////////////////////////
 // Functions used to start an assessment.
 /////////////////////////////////////////////////////////////

  function startAssessment(testFile) {
    assess_win=popUpPage("assessment.html?test=" + "selftest/" + testFile,"assessWin","600","500");

  }


  function pageLoader() {
    setDisplayConditions();
  }

  /////////////////////////////////////////////////////////////
  // Define an object to define the display conditions data
  /////////////////////////////////////////////////////////////

  function DisplayCondition(id,value) {
    this.id=id;
    this.value=value;
  }

  /////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////

  function setDisplayConditions() {
    ss=(top.main.document.styleSheets.length==0)
      ? top.main.primary.document.styleSheets[0]
      : top.main.document.styleSheets[0];

    conditions=top.main.displayConditions;

    // If there are no display conditons then return.
    if (! conditions) return;

    for (ii=0;ii<conditions.length;ii++) {
      c=eval(conditions[ii]);
      flag=eval(c.value);
      id=c.id;

      if (theBrowser=="NS") {
        cssrules=ss.cssRules;

        if (flag) {
          ss.insertRule(".dc_" + id + " {display:block}",cssrules.length);
          ss.insertRule(".dc_" + id + "_inline {display:inline}",cssrules.length);


        } else {
          ss.insertRule(".dc_" + id + " {display:none}",cssrules.length);
          ss.insertRule(".dc_" + id + "_inline {display:none}",cssrules.length);

        }

      } else {
        cssrules=ss.rules;

        if (flag) {
          ss.addRule(".dc_" + id,"display:block");
          ss.addRule(".dc_" + id + "_inline","display:inline");

        } else {
          ss.addRule(".dc_" + id,"display:none");
          ss.addRule(".dc_" + id + "_inline","display:none");

        }

      }
    }

  }

/////////////////////////////////////////////////////////////
// Load the given frame with the given page
/////////////////////////////////////////////////////////////

  function loadFrame(frame,url) {
    if (theBrowser=="IE") frame.document.location=url;
    else frame.document.location.replace(url);
  }