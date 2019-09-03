/*
 Copyright (c) 2005 UGS Corp.
    
 All Rights Reserved.
    
 This software and related documentation are proprietary to UGS Corp.
 */
  
  var toc;
  var toolbar;
  var auxToolbar;
  var bookmarkTool;
  var showAll=true;
  var realFile="";
  var openedByGlobal = false;
  
  // Default display for the icons
  var showContents=true;
  var showSearch=true;
  var searchFile="search/qagent_start_topicSet.html";
  var showAssessment=true;
  var showBookmarks=true;
  var showHome=true;
  var showNextPrev=true;
    
  var showHelp=true;
  var showPartfile=true;
  var showGlossary=true;
  var showIndex=true;
  
  // Added to support assessments
  var assess_win=null;
  var assessmentList;

  // Default user information
  var userName="", userId="";
  var lms="";
  
  // Counter for the swf files
  var swfCount=0;
  
  // Get OS for Windows, Unix or Mac
  var windows_os=false;
  var unix_os=false;
  var mac_os=false;
  if (navigator.userAgent.indexOf("Windows")!=-1) windows_os=true;
  else if (navigator.userAgent.indexOf("X11")!=-1) unix_os=true;
  else if (navigator.userAgent.indexOf("Macintosh")!=-1) mac_os=true;
  
  // image needed to run the animations
  gif89=new Image();
  
  // optional tabs
  var glossaryTab, partfileTab, indexTab, glossaryIcon, partfileIcon, indexIcon;
  var glossaryFile, partsFile, homeFile, indexFile, collapseAll, expandAll;
  
  // optional vertical bars
  var bar3, bar4, bar5;
  
  var workDir;
  
  var gotoURL;
  var topURL=unescape(new String(document.location));
  gotoURL=getPostVar(topURL,"goto");

  // If a code is attached to the url then get it.
  var ruleStr=getPostVar(topURL,"vars");  
  var rules=ruleStr.split(",");
  
  var auxWindow= {
    size : "300",
    defaultSize: "300",
    navHeight : "25",
    tabHeight : "25",
    showAllTab : true,
    displayTabs : true,
    toolURL : "about:blank",
    mainURL : "about:blank",
    border : "3",
    tool : ""
  }
  
  
  // Variables used for flash animations. 
  var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
  var msie_windows = 0;
  
  // Determine if this is Internet Explorer running on a windows machine.
  if ((navigator.userAgent.indexOf('MSIE') != -1) && (navigator.userAgent.indexOf('Win') != -1)){
    msie_windows = 1;
     
  }
  
  
  /////////////////////////////////////////////////////
  // Find the Browser and its version
  // TODO: Need to add support for Safari Web browser
  /////////////////////////////////////////////////////
  var theAppName=navigator.appName;
  var appVerNum=navigator.appVersion.split(".")[0];
  var theBrowser="";
 
  if (theAppName!="") {

    // Is Netscape 4 being used
    if ((theAppName=="Netscape") && (appVerNum>="4")) {
      if (mac_os) theBrowser="IE";
      else theBrowser="NS";
      
    // Is IE being used
    } else  if ((theAppName=="Microsoft Internet Explorer") && (appVerNum>="4")) {
      theBrowser="IE";

    // Set theBrowser to NS.
    } else {
      theBrowser="NS";
    }

  } else {
    var theBrowser="other";

  }
    
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

  function pageLoader() {
    if ((top.content) && (top.content.aux) && (top.content.aux.aux_main)) {
      mainPage=new String(top.content.main.document.location);
      mainPage=mainPage.substr(workDir.length+1);  
      toc.setCurrentPage(mainPage, auxWindow.tool);
      setIcons();
      
      if (aicc) aicc.setLessonLocation(toc.currentPage.file);
    
      setVerboseDisplay();
      setDisplayConditions();
      toolbar.makeToolbar();
      toc.setTab(mainPage);
      
      // Catch, and ignore, the "unspecified error" that can 
      // occur here when using IE 7.
      try {
        top.focus();
      } catch (err) {}
      
      fixFlashDiv();
      initFeedback();

    } else {
      setTimeout("pageLoader()",100);

    }
    
  }

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

  function pageResize() {
    fixFlashDiv();
  }
  
  
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////

  function init() {
    swfCount=0;
    lastOverlayLinkObj=null;
    lastOverlayID=null;  
  }
  
/////////////////////////////////////////////////////////////////
// Initialize the course before the frameset is written.
// Call functions to get any previously set values for showAll 
// and layout.
/////////////////////////////////////////////////////////////////
  function initCourse() {
    
    // set workDir
    workDir=new String(top.document.location);
    launchPath=((courseDir=="") ? launchFile : courseDir + "/" + launchFile);
    workDir=workDir.substring(0,workDir.lastIndexOf(launchPath)-1);    
    
    setShowAllCookie(false);
    
    // Remove all the navigation
    if (hasRule("-nav")) {
      showAll=true;
      auxWindow.tool="";
      showContents=false;
      showAssessment=false;
      showBookmarks=false;
      showNextPrev=false;
      showSearch=false;
      showHome=false;
      showIndex=false;
      showPartfile=false;
      showGlossary=false;
      toolbar.pageNumbers=false;
    }
    
    // Remove all the navigation except next and prev buttons
    if (hasRule("-nav_nextprev")) {
      showNextPrev=true;
      showAll=true;
      auxWindow.tool="";
      showContents=false;
      showAssessment=false;
      showBookmarks=false;
      showSearch=false;
      showHome=false;
      showIndex=false;
      showPartfile=false;
      showGlossary=false;  
    }
    
    // Turn on/off the page numbers
    if (hasRule("-pgnum")) {
      toolbar.pageNumbers=false;
    } else if (hasRule("+pgnum")) {
      toolbar.pageNumbers=true;
    }
    
    // If the "-aux" rule is set then reset the tool to "".
    if (hasRule("-aux")) auxWindow.tool="";
    
    // See if the home icon should be displayed.
    if (hasRule("-home")) showHome=false;
    
    var bookmarkConfig= {
      targetFrame : "top.content.main",
      toolFrame : "top.content.aux.aux_main",
      ids : new Array(courseId),
      titles : new Array(courseName),
      workDir : workDir,
      project : project,
      type : "topicSet",
      launchFile : launchFile
    }
      
    bookmarkTool=new Bookmarks(bookmarkConfig);
    
  }
  
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
  
  function setIcons() {
    contents.visible=showContents;
    search.visible=showSearch;
    //assessments.visible=showAssessment;
    bookmarks.visible=showBookmarks;
    
    bookmark.visible=showBookmarks;
    home.visible=showHome;

    next.visible=false;
    prev.visible=false;
    back.visible=false;
      
    if (showNextPrev) {
      loc=new String(top.content.main.document.location);
    
      if (loc.indexOf("/demo/")==-1) {
        next.visible=true;
        prev.visible=true;    
        
        if (toc.getNextPage(showAll)==null) next.disabled=true;
        else next.disabled=false;
    
        if (toc.getPrevPage(showAll)==null) prev.disabled=true;
        else prev.disabled=false;
        
      } else {
        back.visible=true;
       
      }
      
    }
    
    // take care of the abridged and complete icons
    lessInfo.visible=false;
    lessInfo1.visible=false;
    moreInfo.visible=false;
    moreInfo1.visible=false;
            
    if ((top.content.main.abridged) && (showVerbose)) {
      if (showAll) {
        if (top.content.main.abridged=="true") lessInfo.visible=true;
        else lessInfo1.visible=true;
        
      } else {
        if (top.content.main.abridged=="true") moreInfo.visible=true;
        else moreInfo1.visible=true;      
      }
    }
    
    if (partfileIcon) partfileIcon.visible=showPartfile;
    if (glossaryIcon) glossaryIcon.visible=showGlossary;
    if (indexIcon) indexIcon.visible=showIndex;
    
    if (partfileTab) partfileTab.visible=showPartfile;
    if (glossaryTab) glossaryTab.visible=showGlossary;
    if (indexTab) indexTab.visible=showIndex;
        
    // Figure out which seperator bars should be displayed
    if (hasRule("-nav") || hasRule("-nav_nextprev")) {
      if (bar3) bar3.visible=false;
      if (bar4) bar4.visible=false;
      if (bar5) bar5.visible=false;

    } else {
      if (bar3) bar3.visible=((partfileIcon && partfileIcon.visible) || (glossaryIcon && glossaryIcon.visible) ? true : false);
      if (bar4) bar4.visible=(((showHome) || (showBookmarks) || ((top.content.main.abridged) && (top.content.main.abridged!="off"))) ? true : false);
      if (bar5) bar5.visible=(((showNextPrev) && (toolbar.pageNumbers)) ? true : false);    
    
    }
    
    
  }
  
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
  
  function gotoNextPage() {
    if (toc.getNextPage(showAll)!=null) 
      toc.displayPage(toc.getNextPage(showAll));
               
  }
  
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
  
  function gotoPrevPage() {
    if (toc.getPrevPage(showAll)!=null) 
      toc.displayPage(toc.getPrevPage(showAll));
        
  }
  
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
  
  function openCourse() {
  
    if ((theBrowser=="NS") && (appVerNum<=4)) dismissAuxFrame.visible=false;
        
    if (auxWindow.tool=="contents") {
      toc.makeToc();
      
    } else if (theBrowser!="NS" || auxWindow.tool=="bookmarks") {
      bookmarkTool.listBookmarks();
      
    }
    
    if (auxWindow.tool!="") {
      setExpandCollapseIcons();
      auxToolbar.makeToolbar();
    }
        
    // Create the aicc object if it's not already created.
    if (! aicc) aicc=new AICC();
    
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
//
/////////////////////////////////////////////////////////////////
  
  function setAuxFrame() {

    if (theBrowser=="IE") {
    
      top.content.document.body.cols=auxWindow.size + ",*";
      top.content.document.body.border=auxWindow.border;
      top.content.document.body.frameBorder=auxWindow.border;
      top.content.document.body.frameSpacing=auxWindow.border;
      
      if (auxWindow.tool!="") {
        // Fix the Tab frame if necessary.
        if (auxWindow.displayTabs) {
          if (auxWindow.tool=="contents") {
            top.content.aux.document.body.rows=auxWindow.navHeight + "," + auxWindow.tabHeight + ",*";

          } else {
            toc.makeTabs();            
            top.content.aux.document.body.rows=auxWindow.navHeight + ",0,*";
       
          }
          
        }
        
        if (auxWindow.tool=="contents") {
          toc.makeToc();
          
        } else if (auxWindow.tool=="bookmarks") {
          bookmarkTool.listBookmarks(); 
          
        } else  {
          loadFrame(top.content.aux.aux_main,workDir + "/" + auxWindow.toolURL);
        }
        


      }
        
    } else if (theBrowser=="NS") {      
      auxWindow.mainURL=top.content.main.document.location;
      loadFrame(top.content,workDir + "/frames.html");
    }
    
  }
  
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
  
  function showHideAux(tool) {

    if (theBrowser=="NS")
      tmpSize=top.content.aux.aux_main.innerWidth;
    else
      tmpSize=new String(top.content.document.body.cols).split(",")[0];

    
    if ((tmpSize!=null) && (tmpSize!="") && (tmpSize!="0")) auxWindow.defaultSize=tmpSize;
  
    icon=(tool!="" ? eval(tool) : null);
    
      
    // If this tool is already selected then close it.
    if ((icon==null) || (icon.selected)) {
      auxWindow.tool="";
      setAuxPrefs();
        
      // Close the tool
      setAuxFrame();  
      
    } else {
      icon.selected=true;
      openFrame=false;
      
      // If the current tool is empty (not open) then open it.
      if (auxWindow.tool=="") openFrame=true; 
      
      auxWindow.tool=tool;
      setAuxPrefs();
      
      if (openFrame) {
        setAuxFrame();
        
      } else {
        
        
        if (theBrowser=="IE") {  

          if (auxWindow.displayTabs) {
            if (auxWindow.tool=="contents") {
              top.content.aux.document.body.rows=auxWindow.navHeight + "," + auxWindow.tabHeight + ",*";

            } else {
              toc.makeTabs();              
              top.content.aux.document.body.rows=auxWindow.navHeight + ",0,*";
       
            }
          
          }
        
        } else if (theBrowser=="NS") {
          auxWindow.mainURL=top.content.main.document.location;
          top.content.document.location.replace(workDir + "/frames.html");        
          
        }
        
        if (auxWindow.tool=="contents") {
          // There is a problem when jumping from search to contents I think this
          // is caused because the new page tries to load before the search page is
          // unloaded???
          //
          // One way to fix is to reload the page with blank.html then wait until
          // it is completly loaded.
          top.content.aux.aux_main.document.location.replace(workDir + "/blank.html");           
          setTimeout("callMakeToc()",100);
          
        } else if (auxWindow.tool=="bookmarks") {
          bookmarkTool.listBookmarks();
        } else {
          top.content.aux.aux_main.document.location.replace(workDir + "/" + auxWindow.toolURL);
        }
        
      }

    }
    
    toolbar.makeToolbar();
    
    if (auxWindow.tool!="") {
      setExpandCollapseIcons();
      auxToolbar.makeToolbar();
    }
    
  }
  
/////////////////////////////////////////////////////////////////
// This callMakeToc function us used to wait until the new
// blank.html file has been completly loaded before the makeToc
// function is called.
/////////////////////////////////////////////////////////////////
  
  function callMakeToc() {
    loc=new String(top.content.aux.aux_main.document.location);    
    if (loc.indexOf("blank.html")!=-1) {
      toc.makeToc();
    } else {
      setTimeout("callMakeToc()",100);
    }
  }

/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
  
  function setExpandCollapseIcons() {
    if (! expandAll) return;
    
    if (auxWindow.tool=="contents") {
      expandAll.visible=true;
      collapseAll.visible=true;
    } else {
      expandAll.visible=false;
      collapseAll.visible=false;  
    }
    
  }
  
/////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////
    
  function setAuxPrefs() {
    bookmarks.selected=false;
    contents.selected=false;
    search.selected=false;
    //assessments.selected=false;
    
    // Optional help, glossary, or part file tabs.
    if (glossaryTab) glossaryTab.selected=false;
    if (partfileTab) partfileTab.selected=false;
    if (indexTab) indexTab.selected=false;
    
    // If NS4 then make sure a tool is loaded.
    if ((theBrowser=="NS") && (appVerNum<=4) && (auxWindow.tool=="")) auxWindow.tool="contents";
      
    if (auxWindow.tool!="") {
      tool=eval(auxWindow.tool);
      if (tool) tool.selected=true;
    
      if (auxWindow.tool=="contents") auxWindow.toolURL="blank.html";
      else if (auxWindow.tool=="bookmarks") auxWindow.toolURL="blank.html";
      else if (auxWindow.tool=="search") auxWindow.toolURL=searchFile;
      //else if (auxWindow.tool=="assessments") auxWindow.toolURL=assessmentsFile;
      else if (auxWindow.tool=="glossaryTab") auxWindow.toolURL=glossaryFile;
      else if (auxWindow.tool=="partfileTab") auxWindow.toolURL=partsFile;
      else if (auxWindow.tool=="indexTab") auxWindow.toolURL=indexFile;
            
      auxWindow.size=auxWindow.defaultSize;
      auxWindow.border="3";
      
    } else {
      auxWindow.size="0";
      auxWindow.border="0";
      auxWindow.toolURL="about:blank";

    }
            
    if ((gotoURL) && (gotoURL!="")) {
      auxWindow.mainURL=workDir + "/" + gotoURL;  
    
    } else {
      auxWindow.mainURL=workDir + "/" + toc.currentPage.file;
      
    }
        
  }
  
/////////////////////////////////////////////////////////////////
// Called when we just want to jump back to the homeFile
/////////////////////////////////////////////////////////////////
  
  function goHome() {
    if (aicc) aicc.scheduleExit();
    top.document.location=workDir + "/" + homeFile;

  }
  
/////////////////////////////////////////////////////////////////
// called when we want to exit the browser window.
/////////////////////////////////////////////////////////////////  

  function exitCourse() {
    if (aicc) aicc.scheduleExit();
    close();
    
  }
  
  
/////////////////////////////////////////////////////////////////
// Reset the showAll flag and reload the page. This is called
// when the users switches between abridged and complete mode.
// Called from Nav applet.
/////////////////////////////////////////////////////////////////

  function setShowAll(flag) {
    showAll=flag;
    
    setVerboseDisplay();
    setDisplayConditions();
    
    setIcons();
    toolbar.makeToolbar();
    
    setShowAllCookie(true);

  }
  
  ///////////////////////////////////////////////////////////// 
  //
  /////////////////////////////////////////////////////////////   
  
  function setVerboseDisplay() {
    ss=(top.content.main.document.styleSheets.length==0) 
      ? top.content.main.primary.document.styleSheets[0] 
      : top.content.main.document.styleSheets[0];
      
    if (theBrowser=="NS") {
      cssrules=ss.cssRules;

      if (showAll) {
        ss.insertRule(".verbose {display:block}",cssrules.length);
        ss.insertRule(".verbose_inline {display:inline}",cssrules.length);
        
        
      } else {
        ss.insertRule(".verbose {display:none}",cssrules.length);
        ss.insertRule(".verbose_inline {display:none}",cssrules.length);

      }
      
    } else {
      cssrules=ss.rules;
      
      if (showAll) {
        ss.addRule(".verbose","display:block");
        ss.addRule(".verbose_inline","display:inline");
        
      } else {
        ss.addRule(".verbose","display:none");
        ss.addRule(".verbose_inline","display:none");
        
      }
      
    }
    
  }
  
  ///////////////////////////////////////////////////////////// 
  //
  /////////////////////////////////////////////////////////////   
  
  function setDisplayConditions() {    
    ss=(top.content.main.document.styleSheets.length==0) 
      ? top.content.main.primary.document.styleSheets[0] 
      : top.content.main.document.styleSheets[0];
      
    conditions=top.content.main.displayConditions;
    
    // If there are no display conditons then return.
    if (! conditions) return;
    
    for (ii=0;ii<conditions.length;ii++) {
      c=eval(conditions[ii]);
      flag=eval(c.value);
      id=c.id;

      // If the flag is false then remove the tag from display, otherwise
      // do nothing because the item should already be displayed.
      if (!flag) {
        if (theBrowser=="NS") {
          cssrules=ss.cssRules;
          ss.insertRule(".dc_" + id + " {display:none}",cssrules.length);
          ss.insertRule(".dc_" + id + "_inline {display:none}",cssrules.length);

        } else {
          ss.addRule(".dc_" + id,"display:none");
          ss.addRule(".dc_" + id + "_inline","display:none");

        }
          
      }
      
    }
  
  }
  
  ///////////////////////////////////////////////////////////// 
  //
  /////////////////////////////////////////////////////////////     
  
  function setShowAllCookie(forceReset) {
    showAllCookieName=project + "showAll";
    showAllCookieValue=getCookie(showAllCookieName);
        
    // If forceReset or the cookie is not set then reset the cookie
    if ((forceReset) || (showAllCookieValue==null)) {
      setCookie(showAllCookieName,showAll);

    // Otherwise reset showAll to whatever the cookie was set to
    } else {
      showAll=(showAllCookieValue=="false" ? false : true);
    
    }
      
  }
  
  ///////////////////////////////////////////////////////////// 
  //
  ///////////////////////////////////////////////////////////// 
  
  function resizeAuxToolbar() {
    if ((theBrowser=="NS") && (appVerNum<=4) && (!showAll)) {
      // When resizing Netscape 4 in abridged mode the display of the page
      // is changed to Complete mode. 
      //
      // To fix this problem call changeShowAll a tenth of a second after
      // the page is resized.
      setTimeout("setShowAll(" + showAll + ")",100);

    }
  }
  
  ///////////////////////////////////////////////////////////// 
  // Return the relative path for the current page.
  ///////////////////////////////////////////////////////////// 

  function getThisPage() {
    fullPath=new String(parent.content.main.document.location);
    
    if ((courseDir!="") && (fullPath.indexOf(courseDir)!=-1)) {
      tmp=fullPath.substring(workDir.length +1);
      return tmp;
      
    } else {
      return toc.currentPage.file;
      
    }

  }
  
///////////////////////////////////////////////////////////// 
// Popup a new page. If the popupPage is set to "help", 
// "glossary", "partfile" or "index" then find the corresponding 
// file name and use it instead. If no height and with is set
// then don't set it in the open command.
///////////////////////////////////////////////////////////// 
  
  function popUpPage(popupPage,wName,vars) {
      
    // Set the window name and remove all dashes
    winName=(((wName!=null) && (wName!='')) ? wName : "newWindow");
    winName=winName.replace("-","");
    
    // If the page is a full url address then just use it.
    if (popupPage.match('^http') || popupPage.match('^ftp:') || popupPage.match('^file:')) theURL=popupPage;
    else if (popupPage=="glossary") theURL=workDir + "/" + courseDir + "/" + glossaryFile;
    else if (popupPage=="partfile") theURL=workDir + "/" + courseDir + "/" + partsFile;
    else if (popupPage=="index") theURL=workDir + "/" + indexFile;
    else theURL=workDir + "/" + popupPage;

    // Add the topicSet dir into the path if needed.    
    if (theURL.indexOf("{$topicSetDir}")) theURL=theURL.replace("{$topicSetDir}",courseDir);
    
    // Open the pupup window
    newWin=open(theURL,winName,vars);
    
    // Make sure the new window has focus.
    newWin.focus();

    // If this is an assessment windows being popped up then return the window.    
    if (wName=="assessWin_" + courseId) return newWin;
    
  }
  
///////////////////////////////////////////////////////////// 
//
/////////////////////////////////////////////////////////////

function loadTopicComponentFrame(theFile,frame) {
  frm=eval("top.content.main." + frame);
 
  var theFile_lower=theFile.toLowerCase();
    
  // If it is a full url then open is as-is.
  if (theFile_lower.match('^http') || theFile_lower.match('^file') || theFile_lower.match('^ftp')) {
    loadFrame(frm,theFile);
    
  // Otherwise assume that this is a relative path from the file
  // containing the link.
  } else {
    loadFrame(frm,workDir + "/" + theFile);
    
  }
}

///////////////////////////////////////////////////////////// 
//
///////////////////////////////////////////////////////////// 
  
  function openFile(theFile) {
    loadFrame(top.content.main,workDir + "/" + theFile);
    
    if (theFile.indexOf("#")!=-1) {
      tmpUrl=theFile.substring(0,theFile.indexOf("#"));
      tmpCurrent=((toc.currentPage.file.indexOf("#")!=-1) ? toc.currentPage.file.substring(0,toc.currentPage.file.indexOf("#")) : toc.currentPage.file);
      
      if (tmpUrl==tmpCurrent) top.pageLoader();
    }
    
  }
  
///////////////////////////////////////////////////////////// 
//
///////////////////////////////////////////////////////////// 
  
  function openFileTop(theFile) {
    loadFrame(top,workDir + "/" + theFile);
  }
  
///////////////////////////////////////////////////////////// 
//
///////////////////////////////////////////////////////////// 
  
  function openFileURL(theFile) {
    
    var theFile_lower=theFile.toLowerCase();
    
    // If it is a full url then open is as-is.
    if (theFile_lower.match('^http') || theFile_lower.match('^file') || theFile_lower.match('^ftp')) {
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
// Go back to the currentPage
///////////////////////////////////////////////////////////// 
  
  function goBack() {
    loadFrame(top.content.main,workDir + "/" + toc.currentPage.file);
  }
  
///////////////////////////////////////////////////////////// 
// Functions added to deal with page and topic names
///////////////////////////////////////////////////////////// 
  
///////////////////////////////////////////////////////////// 
// Return true if there is a "|" in the title otherwise 
// return false.
///////////////////////////////////////////////////////////// 
  
  function hasPageName() {
    title=top.content.main.document.title;
    
    // Note: this statement should also check to see if we are
    // in a linked course then we should return false.
    if (title.indexOf(" | ")==-1) return false;
    else return true;
    
  }

 
 /////////////////////////////////////////////////////////////
 //
 /////////////////////////////////////////////////////////////
 
 function hasRule(ruleName) {
   for (ii=0;ii<rules.length;ii++) if (rules[ii]==ruleName) return true;
   
   // Otherwise
   return false;
 }
 
  ////////////////////////////////////////////////////////////// 
  // Used for starting animated gif animations. The static 
  // image is switched with the gif89 to run the animation.
  ////////////////////////////////////////////////////////////// 

  function startAnimation(id,animatedGif) {
    dirPath=new String(top.content.main.document.location);
    dirPath=dirPath.substring(0,dirPath.lastIndexOf("/")+1);

    aGif=eval("top.content.main.document." + id);
    aGif.src="";

    gif89.src=dirPath + animatedGif;
    aGif.src=gif89.src;
        
  }
  
 /////////////////////////////////////////////////////////////
 // Functions used to start an assessment.
 /////////////////////////////////////////////////////////////
  
  function startAssessment(testFile) {
    // Set lms is there is aicc data
    if ((aicc) && (aicc.lmsOK)) lms=aicc.aicc_url.split("://")[1];
    
    // Uncomment for testing so userdata can be passed in from a form on opener.
    //if ((opener) && (opener.document.userInfo) && (opener.document.userInfo.last.value!="")) {
    //  userId=new String(opener.document.userInfo.last.value).toLowerCase();
    //  userName=new String(opener.document.userInfo.first.value + " " + opener.document.userInfo.last.value);  
    //}
    
    winVars="resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars,width=600,height=500";
    assess_win=popUpPage("assessment.html?test=" + testFile,"assessWin_" + courseId,winVars);
    
    // If this course is to communicate with the LMS server.
    if ((aicc) && (aicc.lmsOK)) trackAssessmentWindow();
    
  }
  
 /////////////////////////////////////////////////////////////
 // Wait for the assessment window to close so we can
 // call to the server to get the overall score.
 /////////////////////////////////////////////////////////////
  
  function trackAssessmentWindow() {
  
    // Wait until the window has closed
    if ((assess_win!=null) && (assess_win.closed)) {
      
      // Get the total assessment scores for all the assessments combined, 
      // if they are all completed.
      getTotalAssessmentScores();
      
    } else {
      setTimeout("trackAssessmentWindow()",1000);

    }
  
  }
  
 /////////////////////////////////////////////////////////////
 // Call the GetKaTotalScore servlet to get the overall score.
 /////////////////////////////////////////////////////////////

  function getTotalAssessmentScores() {
    // Get the list of assessments to send to the server.
    theList="";
    for (ii=0;ii<assessmentList.length;ii++) theList+=assessmentList[ii] + "::n,";
     
    // Remove the last comma,
    theList=theList.substring(0,theList.length-1);
  
    // Build the url that will query the server for the total score.
    urlStr=top.document.location.protocol + "//" + top.document.location.host + "/xps30/servlet/GetKaTotalScore?userName=" + escape(userName) + "&userId=" + userId + "&assessList=" + escape(theList);

    // Make the call using Ajax
    request=initRequest();
    response=null;
      
    request.open("POST",urlStr,false);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded;charset=UTF-8;');
    request.send(data);
  
    if (request.status == 200) {
      response=request.responseText;
      
      if ((aicc) && !isNaN(response) && (response!=-1))
            aicc.setAICCParam("score",response);

    }
  }

 /////////////////////////////////////////////////////////////
 //
 /////////////////////////////////////////////////////////////
  
  function updateUI() {
    pageLoader();
    
    if (auxWindow.tool=="contents") {
      toc.setTocData(false);
      toc.makeToc();
    }
    
  }
  
 /////////////////////////////////////////////////////////////
 // Define an object to define the display conditions data
 /////////////////////////////////////////////////////////////

  function DisplayCondition(id,value) {
    this.id=id;
    this.value=value;
  }
  
 /////////////////////////////////////////////////////////////
 // Get the given post variable attached to the url.
 /////////////////////////////////////////////////////////////
  function getPostVar(topURL,varName) {
    value="";
    
    if (topURL.indexOf(varName + "=")!=-1) {
      value=topURL.substring(topURL.indexOf(varName + "="));
      value=value.substring(value.indexOf("=")+1);
      
      if (value.indexOf("&")!=-1) value=value.substring(0,value.indexOf("&"));
      
    }
    
    return value.replace("=","");
  }
  
 /////////////////////////////////////////////////////////////
 // When revealGraphic is off then this function is called
 // to poen a seperate window displaying the graphic
 /////////////////////////////////////////////////////////////
  
  function revealGraphic(graphic) {  
    fullPath=new String(top.content.main.document.location);
    fullPath=fullPath.substring(0,fullPath.lastIndexOf("/")+1);
    fullPath+=graphic;
        
    width=600;
    height=500;
    
    // Open window and set focus.
    newWin=open("about:blank","revealGraphic","resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars,width=" + width + ",height=" + height);
    newWin.focus();
    newWin.resizeTo(width,height);

    dhtml="<html><head>\n<link type='text/css' href='" + workDir + "/css/ui.css' rel='stylesheet'></head>\n";
    dhtml+="<body bgcolor='beige' marginwidth='10' marginheight='10' leftmargin='10' topmargin='10'>\n";
    dhtml+="<p align='center' ><img src='" + fullPath + "' class='revealGraphicsBorder'></p>\n";
    dhtml+="<p align='center'><a href='javaScript:close()'>Close</a></p>\n";
    dhtml+="</body></html>\n";
    
    // Create the document.
    doc=newWin.document;
    doc.open();
    doc.write(dhtml);
    doc.close();
      
  }
  
 /////////////////////////////////////////////////////////////
 // Get the data that defines part of the row attribute of the
 // frameset definition of the main launch file.
 /////////////////////////////////////////////////////////////
  
  function getRowData() {
    if (hasRule("-title")) showTitleFrame=false;
    rowData=(showTitleFrame) ? titleFrameHeight + ',' : '';
    rowData+=(hasRule("-nav")) ? '0,' : mainToolbarHeight + ',';
    
    return rowData;
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
    if (data.width.indexOf("%")!=-1) {
      dhtml='<div id="flashDiv'+ swfCount+ '" class="flash align-' + data.align + '">';
    } else {
      dhtml='<div class="flash align-' + data.align + '">';
    }
    
    // If the plugin is available
    if ((parseFloat(navigator.appVersion.substring(0,4))>4.61 && plugin && parseInt(plugin.description.substring(16,plugin.description.indexOf("."))) >= data.flashVersion) 
          || (top.msie_windows && top.WM_activeXDetect("ShockwaveFlash.ShockwaveFlash." + data.flashVersion))) {
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
    obj.document.write(dhtml);
    
  }
  
 /////////////////////////////////////////////////////////////
 // Define the object
 ///////////////////////////////////////////////////////////// 
 
  function getObject(data) {
    dhtml='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + data.flashVersion + ',0,0,0" id="swf' + swfCount + '" width="'+ data.width + '" height="'+ data.height + '">\n';
    dhtml+='<param name="movie" value="' + swfSrc + '">\n';
    dhtml+='<param name="loop" value="'+ data.looping +'">\n';
    dhtml+='<param name="play" value="'+ data.play +'">\n';
    dhtml+='<param name="quality" value="best">\n';
    dhtml+='<param name="menu" value="' + data.menu + '">\n';
    dhtml+='<param name="bgcolor" value="' + data.bgcolor + '">\n';
    dhtml+='<param name="base" value="' + data.base + '">\n';
    dhtml+='<param name="allowscriptaccess" value="always">\n';
	dhtml+='<!--[if !IE]>-->\n';
	dhtml+='<object type="application/x-shockwave-flash" data="' + swfSrc + '" width="'+ data.width + '" height="' + data.height + '" id="ffswf' + swfCount + '">\n';
	dhtml+='<param name="loop" value="'+ data.looping +'">\n';
	dhtml+='<param name="menu" value="true">\n';
	dhtml+='<param name="quality" value="best">\n';
	dhtml+='<param name="allowscriptaccess" value="always">\n';
	dhtml+='<param name="bgcolor" value="' + data.bgcolor + '">\n';
	dhtml+='<param name="base" value="' + data.base + '">\n';
	dhtml+='<param name="play" value="'+ data.play +'">\n';
	dhtml+='<!--<![endif]-->\n';
	dhtml+='<a href="http://www.adobe.com/go/getflashplayer">\n';
	dhtml+='<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player">\n';
	dhtml+='</a>\n';
	dhtml+='<!--[if !IE]>-->\n';
	dhtml+='</object>\n';
	dhtml+='<!--<![endif]-->\n'; 
    dhtml+='</object>';
    
    return dhtml;
  }
 
 /////////////////////////////////////////////////////////////
 // Fix the size of the div tags that contain the flash tags.
 ///////////////////////////////////////////////////////////// 
 
  function fixFlashDiv() {
    // If there are no swf objects then return
    if (swfCount==0) return;
    
    // Go through each swf, first see of the objects are in a 
    // primary or secondary frame (for topicComponents). If not
    // then all the objects are in the "main" frame
    if (top.content.main.primary) {
      primaryPath="top.content.main.primary";
      secondaryPath="top.content.main.secondary";
      
      for (ii=1;ii<=swfCount;ii++) {
        div=getElement(eval(primaryPath + ".document"),"flashDiv" + ii);
        if (div!=null) {
          data=primaryPath + ":" + ii;
          resizeFlashObj(data);        
        } else {
          div=getElement(eval(secondaryPath + ".document"),"flashDiv" + ii);
          if (div!=null) {
            data=secondaryPath + ":" + ii;
            resizeFlashObj(data);  
          }
          
        }
        
      }
   
    } else {
      for (ii=1;ii<=swfCount;ii++) {
        data="top.content.main:" + ii;
        resizeFlashObj(data);
      }     
    }
  
  }

  /////////////////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////////////////
  
  function resizeFlashObj(data) {
    brsStr=(theBrowser=="NS") ? "ff" : "";
    dataArray=data.split(":");
    doc=eval(dataArray[0] + ".document");
    obj=eval(dataArray[0] + ".document." + brsStr + "swf" + dataArray[1]);
    flashDiv=getElement(doc,"flashDiv" + dataArray[1]);
    
    if (obj && obj.PercentLoaded()==100) {
    
      if (flashDiv && flashDiv.offsetWidth>0) {      
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
			  flashDiv.innerHTML = flashDiv.innerHTML;

			}

		  } catch (e) {}      
      }
      
    } else {
      setTimeout("resizeFlashObj('" + data + "')",100);
    }

  }
  
 /////////////////////////////////////////////////////////////
 // Activate the given object after the main frame is loaded.
 ///////////////////////////////////////////////////////////// 
 
  function activateObject(objID) {
    if (top.content && top.content.main) {
      doc=top.content.main.document; 
      obj=getElement(doc,objID);
      obj.outerHTML=obj.outerHTML;
    } else {
      setTimeout("pageLoader(" + objID + ")",100);
    }
  }
  
///////////////////////////////////////////////////////////// 
// Switch two graphics given the current graphicID
/////////////////////////////////////////////////////////////

  function switchGraphic(graphicID,newGraphic) {
  
    // Try to find the graphic object in the correct frame
    if (top.content.main.primary) {
      primaryDoc=top.content.main.primary.document;
      secondaryDoc=top.content.main.secondary.document;
    
      graph=getElement(primaryDoc,graphicID);
    
      if (graph==null)
        graph=getElement(secondaryDoc,graphicID);
    
    } else {
      mainDoc=top.content.main.document;
      graph=getElement(mainDoc,graphicID);
    }
    
    if (graph && graph.src) {
      newGraph=new Image();
      graphSrc=graph.src;
      graphDir=graphSrc.substring(0,graphSrc.lastIndexOf("/")+1);    
      newGraphSrc=graphDir + newGraphic;
      newGraph.src=newGraphSrc;
    
      if (newGraphSrc!=graphSrc) graph.src=newGraph.src;
    } else {
      // If this does not work then the response should be silent.
      //alert("No graphic found with id: " + graphicID);
    }

  }
  
///////////////////////////////////////////////////////////// 
// Load the given frame with the given page
/////////////////////////////////////////////////////////////

  function loadFrame(frame,url) {
    if (theBrowser=="IE") frame.document.location=url;
    else frame.document.location.replace(url);
  }

///////////////////////////////////////////////////////////// 
// functions needed to support the glossary popup
/////////////////////////////////////////////////////////////  
  var lastOverlayID=null;
  var lastOverlayLinkObj=null;
  var so_interval;

  function showOverlay(e,overlayid,spanTag) {
    doc=top.content.main.document;

    var glossaryDiv=getElement(doc,overlayid);
  
    h=glossaryDiv.offsetHeight;
    w=glossaryDiv.offsetWidth;
    docW=doc.body.clientWidth;
    docH=doc.body.clientHeight;

    // Remove the open glossary entry if there is one.
    if (lastOverlayID!=null && lastOverlayID!=overlayid) {
      removeOverlay(lastOverlayID);
    }

    if (glossaryDiv==null) {
      alert("bad glossary id: " + overlayid);
    } else if (glossaryDiv.style.visibility=="visible") {
      removeOverlay(overlayid);

    } else {
      lastOverlayID=overlayid;
      
      left=e.clientX;
      if ((left+w)>docW) left=docW-w-50;
      
      if (left<0) left=20;
      
      topTarget=e.clientY;
      
      if ((topTarget + h) > docH) topTarget=topTarget-h-30;
      
      topTarget=topTarget+getScrollingPosition(top.content.main)[1];
      
      // If the window is outside of the top edge then move it
      if (topTarget<0) topTarget=e.clientY+getScrollingPosition(top.content.main)[1];

      glossaryDiv.style.left=left + "px";
      glossaryDiv.style.top=topTarget + "px";
      glossaryDiv.style.height="1px";
      glossaryDiv.style.visibility="visible";

      lastOverlayLinkObj=spanTag;

      slide(overlayid, h,10);

    }

  }

  function getScrollingPosition(win) {
    var position = [0, 0];
  
    if (typeof win.pageYOffset != 'undefined') {
      position = [win.pageXOffset,win.pageYOffset];
    
    } else if (typeof win.document.documentElement.scrollTop!= 'undefined' && win.document.documentElement.scrollTop > 0) {
      position = [win.document.documentElement.scrollLeft,win.document.documentElement.scrollTop];
  
    } else if (typeof win.document.body.scrollTop != 'undefined') {
      position = [win.document.body.scrollLeft,win.document.body.scrollTop];
	
    }
  
    return position;
  }

  
  function removeOverlay(overlayid) {
    doc=top.content.main.document;
    var overlayDiv=getElement(doc,overlayid);
   
    overlayDiv.style.visibility="hidden";

    if (lastOverlayLinkObj!=null) {
      lastOverlayLinkObj.style.background="none";
      lastOverlayLinkObj=null;
    }
  }
  

  function slide(target, expandTo, speed) {
	var intv_call = 'slideIt(\'' + target + ':' + expandTo + '\')';
	clearInterval(so_interval);
	so_interval = setInterval(intv_call,speed);
  }

  ///////////////////////////////////////////////////////////// 
  // Note: setInterval was giving an error when I sent target and 
  // expandTo as two vars. Combining them as one fixed the problem.
  ///////////////////////////////////////////////////////////// 
  function slideIt(data) {
    var dataArray=data.split(":");
    target=dataArray[0];
    expandTo=dataArray[1];
    
    var doc=top.content.main.document;
    var targetDiv=getElement(doc,target);
    var current=targetDiv.offsetHeight;

	distTo = Math.abs(current - expandTo);
	var goSize = distTo/3;
	if( goSize < 1 ) goSize = 1;

	if( current > expandTo ) {
		//make shorter
		targetDiv.style.height = Math.abs(current-goSize) + "px";
	} else {
		// make taller
		targetDiv.style.height = Math.abs(current+goSize) + "px";
	}

	if( distTo < 2 ) {
		// very close, kill the timer, set it to the right height
		targetDiv.style.height = expandTo + "px";
		//alert("done now " + expandTo);
		// if opening, set to auto so new ajax content or lower level expansion forces div expansion
		if (expandTo > 0) {targetDiv.style.height = "auto";}
		clearInterval(so_interval);
	}

  }

///////////////////////////////////////////////////////////// 
// Functions used for feedback form
///////////////////////////////////////////////////////////// 

var feedback=false;
var showFeedback=false;
var feedbackTarget="http://lmdcontent.industrysoftware.automation.siemens.com/feedback/feedback.action";
var feedbackType="";
  
function initFeedback() {
  var doc=top.content.main.document;
  var feedback=getElement(doc,"feedback");
  
  if (feedback && showFeedback) { 
    feedback.style.visibility="visible";
    feedback.innerHTML=getWasUseful();
  }
 
}

function feedbackResultsLoaded() {
  var doc=top.content.main.document;
  var feedback=getElement(doc,"feedback");
  
  if (feedbackType!="") 
    feedback.innerHTML=getThankYou();
}

function setFeedbackType(type) {
  var doc=top.content.main.document;
  var feedback=getElement(doc,"feedback");
  
  if (feedback && showFeedback) { 
    feedback.style.visibility="visible";
    feedback.innerHTML=getFeedbackForm(type);
  }    
}

function postFeedback() {
  // Get the form
  var doc=top.content.main.document;
  var form=top.getElement(doc,"feedbackForm");
  
  // Submit the form
  form.submit();
}

function getWasUseful() {
  var wasUseful="<p>" + txt_wasThisUseful + "</p>";
  wasUseful+="<button id='yesButton' onClick=\"top.setFeedbackType('yes')\">" + txt_yes + "</button>&nbsp;";
  wasUseful+="<button id='noButton' onClick=\"top.setFeedbackType('no')\">" + txt_no + "</button>&nbsp;";
  wasUseful+="<button id='dontKnowButton' onClick=\"top.setFeedbackType('dontknow')\">" + txt_dontKnow + "</button>";
  return wasUseful;
}

function getFeedbackForm(type) {
  para=txt_howYes;
  if (type=="no") para=txt_howNo;
  else if (type=="dontknow") para=txt_howDontKnow;
  
  // Get some needed values to add to the form  
  project=top.project;
  courseName=top.courseName;
  courseId=top.courseId;
  page=top.toc.currentPage;
  pageTitle=page.name;
  re=new RegExp("^([0-9]*\\. )","g");
  pageTitle=pageTitle.replace(re,"");
  
  fbForm="<form method='post' action='" + feedbackTarget + "' id='feedbackForm' class='theForm' target='feedbackResults'>";
  fbForm+="<p>" + para + "</p>";
  fbForm+="<textarea name='comments'></textarea>";
  fbForm+="<input type='hidden' name='type' value='" + type + "'/>";
  fbForm+="<input type='hidden' name='project' value='" + project + "'/>";  
  fbForm+="<input type='hidden' name='courseName' value='" + courseName + "'/>";  
  fbForm+="<input type='hidden' name='courseId' value='" + courseId + "'/>";  
  fbForm+="<input type='hidden' name='pageTitle' value='" + pageTitle + "'/>";  
  fbForm+="<input type='hidden' name='pageType' value='" + page.type + "'/>";  
  fbForm+="<input type='hidden' name='pageFile' value='" + page.file + "'/>";  
  fbForm+="<input type='hidden' name='workDir' value='" + top.workDir + "'/>";  
  fbForm+="<input type='hidden' name='cc' value=''/>";
  
  fbForm+="<div class='buttonDiv'>";
  fbForm+="<button onClick='top.initFeedback()'>" + txt_back + "</button>&nbsp;";
  fbForm+="<button onClick='top.postFeedback()'>" + txt_submit + "</button>";
  fbForm+="</div></form>";
  
  feedbackType=type;
  
  return fbForm;

}

function getThankYou() {
  var thanks="<p>" + txt_thanks_p1 + "</p>";
  thanks+="<p>" + txt_thanks_p2 + "</p>";
  return thanks;
}

///////////////////////////////////////////////////////////// 
// User Preference functions
///////////////////////////////////////////////////////////// 

function makeUserPrefs(page) {
	page.document.write("<table class='userPrefs'>");
	
	for (ii=0;ii<userPrefs.length;ii++) {
		cookieName="datasheet_" + courseId + "_" + userPrefs[ii].id;
		cookieValue=getCookie(cookieName);
		if (cookieValue==null) cookieValue=userPrefs[ii].defaultValue;
		
		page.document.write("<tr><td><b>" + userPrefs[ii].label + ":</b></td><td><input size='40' id='" + userPrefs[ii].id + "' type='text' value='" + cookieValue + "'></td></tr>");
	}
	
	page.document.write("<tr><td>&nbsp;</td><td><button onclick='top.saveUserPrefs()'>Save</button></td></tr>");
	page.document.write("</table>");
	
}

/***********************************************************************/

function saveUserPrefs() {
	
	for (ii=0;ii<userPrefs.length;ii++) {	
		input=getElement(top.content.main.document,userPrefs[ii].id);
		cookieName="datasheet_" + courseId + "_" + userPrefs[ii].id;		
		setCookie(cookieName,input.value);
	}
	
	alert("User preferences have been saved.");
}

/***********************************************************************/

function getUserPref(id) {
	for (ii=0;ii<userPrefs.length;ii++) {
		if (id==userPrefs[ii].id) {
			cookieName="datasheet_" + courseId + "_" + userPrefs[ii].id;
			cookieValue=getCookie(cookieName);
			if (cookieValue==null) cookieValue=userPrefs[ii].defaultValue;
		
			return cookieValue;
		}
		
	}
	
	return "Undefined user preference: '" + id + "'";
}