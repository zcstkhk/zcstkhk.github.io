/*
 Copyright (c) 2005 UGS Corp.
    
 All Rights Reserved.
    
 This software and related documentation are proprietary to UGS Corp.
 */
  
  var aicc=null;
  var keepAliveTime=600000;
  var debug=false;
  
  /*
  User data example:
  
  [core]
  student_id=david.vanfleet@ugsplm.com
  student_name=vanfleet,david
  output_file=
  lesson_location=
  credit=C
  lesson_mode=
  lesson_status=N
  path=
  time=00:00:00
  score=
  [core_vendor]
  [core_lesson]
  [evaluation]
  course_id=prdct000000000031936
  [objectives_status]
  [student_data]
  */
  
  //////////////////////////////////////////////////////////
  // Constructor for the AICC object
  //////////////////////////////////////////////////////////

  function AICC() {
    this.aicc_url="";
    this.aicc_sid="";
    this.hostName=top.document.location.hostname;
    this.aiccLoc=new String(top.document.location);
    this.lmsOK=false;
    this.portNumber=""; // should be empty or :# (i.e :8080)
    this.hostName;
    this.sabaFwd="/xps30/UGSFwd";
    this.aicc_data;
  
    if ((this.aiccLoc.indexOf("aicc_url")!=-1) | (this.aiccLoc.indexOf("AICC_URL")!=-1)) this.lmsOK=true;
    
    if (this.lmsOK) {
      this.aicc_url=(this.aiccLoc.indexOf("aicc_url")!=-1 ?  getURLParam(this.aiccLoc,"aicc_url") : getURLParam(this.aiccLoc,"AICC_URL"));
      
      if (this.aicc_url.indexOf("http")!=0) this.aicc_url= top.document.location.protocol + "//" + this.aicc_url;
    
      this.aicc_sid=(this.aiccLoc.indexOf("aicc_sid")!=-1 ? getURLParam(this.aiccLoc,"aicc_sid") : getURLParam(this.aiccLoc,"AICC_SID"));

      url= top.document.location.protocol + "//" + this.hostName + this.portNumber + this.sabaFwd;
      data="url=" + this.aicc_url + "&session_id=" + this.aicc_sid + "&command=getParam&version=2.0&aicc_data=";

      // Make the AICC call to LMS server
      response=makeCall("AICC",url,data);
      
      // display errors if any
      if (response.indexOf("error=0")==-1 || debug)
        alert(response);
      
      returnData=response.substring(response.indexOf("aicc_data="));
      returnData=returnData.substring(returnData.indexOf("=")+1);        
              
      // Create an array of strings to hold the aicc data.
      this.aicc_data=((returnData.indexOf("\n")!=-1) ? returnData.split("\n") : returnData.split(" "));
            
      top.userName=this.getAICCParam("student_name");
      top.userId=this.getAICCParam("student_id");
      
      // Call runKeepAlive every 10 min to keep the session from timing out.
      setTimeout("runKeepAlive()",keepAliveTime);

    }

  }
  
  //////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////
  
  AICC.prototype.getAICCData=function() {
    tmpStr="";
    
    for (ii=0;ii<this.aicc_data.length;ii++) {
      if (ii<this.aicc_data.length-1) tmpStr+=this.aicc_data[ii] + "\n";
      else tmpStr+=this.aicc_data[ii];
    }
    
    return tmpStr;  

  }
  
  //////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////
  
  AICC.prototype.getAICCParam=function(paramName) {    
    c=0;
    found=false;
    paramValue=""
    
    while ((c<this.aicc_data.length) && (! found)) {
      tmp=this.aicc_data[c];
      
      if (tmp.indexOf(paramName+"=")==0) {
        paramValue=tmp.substring(tmp.indexOf("=")+1)
        found=true;
      }
      
      c++;
      
    }
    
    return paramValue;
    
  }
  
  //////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////
  
  AICC.prototype.setAICCParam=function(paramName, paramValue) {
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
    
  }

  //////////////////////////////////////////////////////////
  // Send the current AICC data (aicc_data) back to the lms
  // and wait for a response. If the transfer is sucessful
  // then return true, otherwise return false.
  //////////////////////////////////////////////////////////
  
  AICC.prototype.sendAICCData=function() {
    if (this.lmsOK) {
      url=top.document.location.protocol + "//" + this.hostName + this.portNumber + this.sabaFwd;
      data="url=" + this.aicc_url + "&session_id=" + this.aicc_sid + "&command=putParam&version=2.0&aicc_data=" + escape(this.getAICCData());
      
      response=makeCall("AICC",url,data);
      
      // Check for an error in the response;
      if (response.indexOf("error=0")==-1 || debug)
        alert(response);

      return response;
    }

  }
  
  //////////////////////////////////////////////////////////
  // 
  //////////////////////////////////////////////////////////

  AICC.prototype.setLessonLocation=function(loc) {
  
    if (this.lmsOK) {
      this.setAICCParam("lesson_location",loc);
      lessonStatus=this.getAICCParam("lesson_status");
      
      // If this is the last page then set the lesson status 
      // to completed "C".
      if (toc.currentPage.file==lastPage) {      
        this.setAICCParam("lesson_status","C");
        
      // Otherwise set it to incomplete (i).
      } else if ((lessonStatus!="C") && (lessonStatus!="P")) {
        this.setAICCParam("lesson_status","i");
        
      }      
            
    }

  }
  
  
  AICC.prototype.scheduleExit=function() {    
    if (this.lmsOK) {
    
      // Send the final data to the server
      response=this.sendAICCData();
  
      data="url=" + this.aicc_url + "&session_id=" + this.aicc_sid + "&command=exitau&version=2.0";
      url=top.document.location.protocol + "//" + this.hostName + this.portNumber + this.sabaFwd;
      
      response=makeCall("exitAu",url,data);
      
      if (response.indexOf("error=0")==-1 || debug)
        alert(response);
      
      this.lmsOK=false;
    }
    
  }
  
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  
  
  //////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////
  
  function unloadAll() {
    if (aicc!=null && aicc.lmsOK) aicc.scheduleExit();
  }

  //////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////

  function getURLParam(theUrl, theParam) {
    theVal=new String("");

    // If the parameter is not in the url then return empty.
    if (theUrl.indexOf(theParam)==-1) return theVal;

    theVal=theUrl.substring(theUrl.indexOf(theParam));
    theVal=theVal.substring(theVal.indexOf("=")+1);

    if (theVal.indexOf("&")!=-1)
      theVal=theVal.substring(0,theVal.indexOf("&"));

    return theVal;

  }
  
  //////////////////////////////////////////////////////////
  //
  //////////////////////////////////////////////////////////
  
  function runKeepAlive() {
    response=aicc.sendAICCData();
    setTimeout("runKeepAlive()",keepAliveTime);
  }
  
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  // Make the call to the server with the give id, url and data
  function makeCall(id,url,data) {
    request=initRequest();
    response=null;
      
    request.open("POST",url,false);                                                                                                                                                                                                                                                                                                                                                        
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded;charset=UTF-8;');
  
    request.send(data);
  
    if (request.status == 200) {
      response=request.responseText;
    }
    
    return response;

  }
  
  // Get the request object.
  function initRequest() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      isIE = true;
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
  }  
