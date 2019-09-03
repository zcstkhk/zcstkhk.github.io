/*
 Copyright (c) 2007 UGS Corp.
    
 All Rights Reserved.
    
 This software and related documentation are proprietary to UGS Corp.
 */
 
var test;
var testMode=false;
var userName=null;
var userId=null;
var swfFile=(testMode) ? "assessment-testing.swf" : "assessment.swf";
var InternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
top.resizeTo(600,700);

// standard plugin detection
// this is the VBScript for MSIE Windows
var WM_startTagFix = '</';
var msie_windows = 0;
if ((navigator.userAgent.indexOf('MSIE') != -1) && (navigator.userAgent.indexOf('Win') != -1)){
  msie_windows = 1;
  document.writeln('<script language="VBscript">');
  document.writeln('\'This will scan for plugins for all versions of Internet Explorer that have a VBscript engine version 2 or greater.');
  document.writeln('\'This includes all versions of IE4 and beyond and some versions of IE 3.');
  document.writeln('Dim WM_detect_through_vb');
  document.writeln('WM_detect_through_vb = 0');
  document.writeln('If ScriptEngineMajorVersion >= 2 then');
  document.writeln('  WM_detect_through_vb = 1');
  document.writeln('End If');
  document.writeln('Function WM_activeXDetect(activeXname)');
  document.writeln('  on error resume next');
  document.writeln('  If ScriptEngineMajorVersion >= 2 then');
  document.writeln('     WM_activeXDetect = False');
  document.writeln('     WM_activeXDetect = IsObject(CreateObject(activeXname))');
  document.writeln('     If (err) then');
  document.writeln('        WM_activeXDetect = False');
  document.writeln('     End If');
  document.writeln('   Else');
  document.writeln('     WM_activeXDetect = False');
  document.writeln('   End If');
  document.writeln('End Function');
  document.writeln(WM_startTagFix+'script>');
}

if (navigator.appName && navigator.appName.indexOf("Microsoft") != -1 && navigator.userAgent.indexOf("Windows") != -1 && navigator.userAgent.indexOf("Windows 3.1") == -1) {
  document.write('<SCRIPT LANGUAGE=VBScript\> \n');
  document.write('on error resume next \n');
  document.write('Sub assessment_FSCommand(ByVal command, ByVal args)\n');
  document.write('call assessment_DoFSCommand(command, args)\n');
  document.write('end sub\n');
  document.write('</SCRIPT\> \n');
}


// Three arguments can be pass into Flash here:
// 'test' is the xml questions/answers file to load minus the .xml extension
// 'url' is the http path to this assessment shell
// 'user' is the user validation response from the validatelogin.cgi
//
// In an LMS course environment the opener will have these variable for Flash:
// opener.userId
// opener.userName

function getInput() {
	var input="";
	
	// If user or userId is passed with the URL
	if (((document.location.search.indexOf('user=') > -1)
	    && (document.location.search.indexOf('user=nomatch') == -1))
	    || (document.location.search.indexOf('userId=') > -1)) {
	
		input = document.location.search;
  		if (test && test!='') input+= "&test=" + test;
    
    // When launched by way if AICC
 	} else if (userName!=null && userId!=null) {
 		input = document.location.search + "&test=" + test + '&userId='+ escape(userId) + '&userName=' + escape(userName);
   
	// If userId and userName are sent from opener, test should be part of the url string.
	} else if (opener
	    && opener.userId
	    && opener.userName 
	    && (opener.userId!="")
	    && (document.location.search.indexOf('test=') > -1)) {
		
		input = document.location.search + '&userId='+ opener.userId.toLowerCase() + '&userName=' + opener.userName + '&aicc_url=';
		if (opener.lms && opener.lms!="") input+= opener.lms;

	} else if (test && test!='') {
		input = '?url=' + document.location.pathname + "&test=" + test + '&aicc_url=';
    
	// If login validation failed, pass path and pass full query
	// string (user=nomatch and file).
	} else if (document.location.search.indexOf('user=nomatch') == -1) {
		input = document.location.search + '&url=' + document.location.pathname + '&aicc_url=';

	// If nothing else applies then just pass the arg through.
	} else {
		input = document.location.search + '&aicc_url=';
	}
	
	if(document.location.search.indexOf("graphicRoot")!=-1){
		var graphicRootIndex = document.location.search.indexOf("graphicRoot");
		
		if(document.location.search.indexOf("&")!=-1){
			var findGraphicRoot=document.location.search.substring(graphicRootIndex,document.location.search.indexOf("&"));
		} else {
			var findGraphicRoot=document.location.search.substring(graphicRootIndex);
		}
	
		input += '&' + findGraphicRoot;
	}
	
	return input;
	
}

 /////////////////////////////////////////////////////////////
 // Call the GetKaTotalScore servlet to get the overall score.
 /////////////////////////////////////////////////////////////

function getAssessmentScore() {
    
    databaseId=dbid + "::n";
  
    // Build the url that will query the server for the total score.
    urlStr=top.document.location.protocol + "//" + top.document.location.host + "/xps30/GetKaTotalScore?userName=" + escape(userName) + "&userId=" + userId + "&assessList=" + escape(databaseId);

    // Make the call using Ajax
    request=initRequest();
    response=null;
      
    request.open("POST",urlStr,false);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded;charset=UTF-8;');
    request.send(data);
  
    if (request.status == 200) {
      response=request.responseText;
      
      if ((aicc) && !isNaN(response) && (response!=-1)) {
            aicc.setAICCParam("score",response);
            aicc.setAICCParam("lesson_status","C");
      }
    }
}

/////////////////////////////////////////////////////////////

function closeAssessment() {
	getAssessmentScore();
	unloadAll();
}

/////////////////////////////////////////////////////////////

function getElement(doc, nodeID) {
  if(doc.getElementById) return doc.getElementById(nodeID);
  else if(doc.all) return doc.all(nodeID);
    
  return null;
}  
  
/////////////////////////////////////////////////////////////
// 
/////////////////////////////////////////////////////////////
document.onmousewheel=function() {
  // this only works in IE 6
  window.document.assessment.setVariable("_root.vscrollbarMC.wheelHandlerMC.wheelDelta",event.wheelDelta);
  window.document.assessment.TcallLabel("_root.vscrollbarMC.wheelHandlerMC","wheel");
}

// This is for Flash to Javascript
function assessment_DoFSCommand(command, args) {
  var myFlashObj = InternetExplorer ? assessment : document.assessment;
  alert ("The Message was : " + args);
}

// this is for Javascript to Flash --- Testing function
function doPassVar (args){ // assumes args is a form object
  var sendText = args.value;
  window.document.assessment.SetVariable("message2Txt.text", sendText);
}

// this is for the helpLinks -- called from flash
function openTheURL (link){ 
  var goToLink = "goto=";
  var thisLink = link;

  window.open(thisLink);
}

function writeObject(divId) {
	var theDiv=getElement(document,divId);
	
 	if ((!aicc.lmsOK || (userName && userId)) && theDiv!=null) {
 		var input=getInput();
  	    
 	  	// Check for Flash version 6 or greater in Netscape version 4.61 or higher
		if ( parseFloat(navigator.appVersion.substring(0,4))>4.61 && plugin && parseInt(plugin.description.substring(16,plugin.description.indexOf("."))) >= 6 ) {
			dhtml='<embed src="'+swfFile+input+'" width="100%" height="100%" name="assessment" loop="false" menu="false" quality="high" salign="T" bgcolor="#D4D0C8"';
		    dhtml+=' allowScriptAccess="sameDomain" swLiveConnect="true"';
		    dhtml+=' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></embed>';
		    
		} else if (msie_windows && WM_activeXDetect("ShockwaveFlash.ShockwaveFlash.6")){
		
			// Windows Plugin Check
		    dhtml='<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="assessment" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" ID="assessment" WIDTH=100% HEIGHT=100%>';
		    dhtml+='<PARAM NAME=movie VALUE="'+swfFile+input+'">';
		    dhtml+='<PARAM NAME=loop VALUE="false">';
		    dhtml+='<PARAM NAME=menu VALUE="false">';
		    dhtml+='<PARAM NAME=quality VALUE="high">';
		    dhtml+='<PARAM NAME=bgcolor VALUE="#D4D0C8">';
		    dhtml+='<PARAM name="swliveconnect" value="true">';
		    dhtml+='<PARAM name="allowScriptAccess" value="sameDomain">';
		    dhtml+='</OBJECT>';
		  
		} else {
		    dhtml='<TABLE BORDER="0" WIDTH="100%" HEIGHT="100%"><TR><TD VALIGN="MIDDLE" ALIGN="CENTER"><IMG BORDER=0 SRC="graphics/getFlash.jpg">';
		    dhtml+='</TD></TR></TABLE>';

  		}
  		
		theDiv.innerHTML=dhtml;
		
 	} else {
 		setTimeout("writeObject('" + divId + "')",200);
 	}
  

}