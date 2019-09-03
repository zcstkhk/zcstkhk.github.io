/*
 Copyright (c) 2005 UGS Corp.
    
 All Rights Reserved.
    
 This software and related documentation are proprietary to UGS Corp.
 */
 
//////////////////////////////////////////////////////////////
// Bookmark object used to create and maintina bookmarks.
//////////////////////////////////////////////////////////////


function Bookmarks(config) {
  this.bookmarkList="";
  this.config=config;
}

//////////////////////////////////////////////////////////////
// Bookmarks Scripts
////////////////////////////////////////////////////////////
Bookmarks.prototype.setBookmark=function() {

  if (! allowCookies()) return;
  
  thisPage=getThisPage();
  res="";
  
  pageTitle=toc.currentPage.name;
  
  // Make sure there are no commas in the title.
  re=",";
  while (pageTitle.search(re)!=-1) pageTitle=pageTitle.replace(re,"&#44;");
  
  today = new Date();
  aexp = new Date();

  //Set the experation date to one year.
  aexp.setTime(today.getTime() + 1000*60*60*24*365);    

  // Add the version number to the cookie name to distinguish 
  // it from cookies set in previouse versions.
  cookieName=this.config.project + this.config.ids[0];
    
  curVal=getCookie(cookieName);
    
  // If there is not already a cookie for this page then
  // create one.
  if ((curVal==null) || (! curVal)) {
    setCookie(cookieName,thisPage + "::" + pageTitle,aexp);
    res=top.txt_bookmarkedPage;
      
  } else if (thisPage==null) {
    res=top.txt_notValidPage;

  } else {    
    if (this.findBookmark(curVal,thisPage)==-1) {
      setCookie(cookieName,curVal + "," + thisPage + "::" + pageTitle,aexp);
      res=top.txt_bookmarkedPage;

    } else {
      res=top.txt_pageAlreadyBookmarked;
      
    }
    
  }
  
  alert(res);

}

//////////////////////////////////////////////////////////////

Bookmarks.prototype.findBookmark=function(theCookie,theFile) {
  bookmarkArray=theCookie.split(",");
  
  for (jj = 0; jj < bookmarkArray.length; jj++) {
    if (bookmarkArray[jj].indexOf(theFile)!=-1) return jj;
  }

  return -1;

}


  
////////////////////////////////////////////////////////////// 
  
Bookmarks.prototype.listBookmarks=function () {
    
  doc=eval(this.config.toolFrame + ".document");         
  this.bookmarkList="";
  hasBookmark="false";
  
  dHTML="";  
  dHTML+="<html>\n<head>\n"
  dHTML+="<link rel='stylesheet' href='" + this.config.workDir + "/css/ui.css' type='text/css'>\n";
  dHTML+="</head>\n";
  
  dHTML+="<body bgcolor='white' marginwidth='5' marginheight='5' leftmargin='5' topmargin='5'>\n";
  dHTML+="<div class='bookmarkHead'>" + top.txt_bookmarks + "</div>\n";
  dHTML+="<hr noshade='true'>\n";
  
  dHTML+="<form name='bmForm'>";

  for (j = 0; j < this.config.ids.length; j++) {
    cookieName=this.config.project + this.config.ids[j];
    str=getCookie(cookieName);
    
    if ((str) && (str!="undefined")) {
      str=str.split(",");
    
      hasBookmark="true";
      if (this.config.type=="collection") 
        dHTML+="<div class='courseName'><nobr>" + this.config.titles[j] + "</nobr></div>";

      dHTML+="<table width='100%' border='0' cellspacing='0' cellpadding='0'>";

      for (jj = 0; jj < str.length; jj++) {
        bkInfo=str[jj].split("::");
        checkBoxName=this.config.ids[j] + "__" + bkInfo[0];
        
        //regular expression to look for "/", "." and #
        re=/\/|\.|\#/;
        while (checkBoxName.search(re)!=-1) checkBoxName=checkBoxName.replace(re,"");

        if (this.bookmarkList=="") {
          this.bookmarkList=checkBoxName;

        } else {
          this.bookmarkList+="," + checkBoxName;
        }
        
        dHTML+="<tr>";
        dHTML+="<td valign='middle' align='right' width='20'>";
        dHTML+="<input type='checkbox' name='" + checkBoxName + "'>";
        dHTML+="</td>";
        dHTML+="<td valign='middle' width='305'>";        
        dHTML+="<a href=\"javascript:top.bookmarkTool.gotoBookmark('" + bkInfo[0] + "','" + this.config.ids[j] + "')\" class='bookmarkLink'><nobr>" + bkInfo[1] + "</nobr></a>";
        dHTML+="</td>";
        dHTML+="<tr>";

      }

      dHTML+="</table>";
      dHTML+="<br>";
    }

  }
  
  if (hasBookmark=="true") {
    dHTML+="<input type='button' name='delete' value='"+ top.txt_delete + "' onclick='top.bookmarkTool.deleteSeletedBookmarks()'> ";
    dHTML+="<input type='button' name='deleteAll' value='" + top.txt_deleteAll + "' onclick='top.bookmarkTool.deleteAllBookmarks()'> ";
    
    if (this.config.type=="topicSet") dHTML+="<input type='button' name='refresh' value='" + top.txt_refresh + "' onclick='top.bookmarkTool.listBookmarks()'>";
     
  } else {  
    dHTML+="<p>" + top.txt_noBookmarks + "<p>";
    
    if (this.config.type=="topicSet") {
      dHTML+="<br>";      
      dHTML+="<input type='button' name='refresh' value='" + top.txt_refresh + "' onclick='top.bookmarkTool.listBookmarks()'>";
    }
    
  }

  dHTML+="</form>";
  dHTML+="</body>";
  dHTML+="</html>";
  
  doc.open();
  doc.write(dHTML);
  doc.close();

}

////////////////////////////////////////////////////////////// 

Bookmarks.prototype.gotoBookmark=function(target,theID) {
  
  // If this is a book then open the bookmarked page in the target frame.
  // If this is a collection then open the bookmarked page in a new window.
  if (this.config.type=="topicSet") {
    doc=eval(this.config.targetFrame + ".document");
    doc.location.replace(this.config.workDir + "/" + target);
    
  } else {

    theURL=workDir + "/" + theID + "/" + this.config.launchFile + "?goto=" + target;
    winVars="resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars";
    
    // Open the pupup window
    newWin=open(theURL,theID,winVars);
      
    // Make sure the new window has focus.
    newWin.focus();
  }

}

////////////////////////////////////////////////////////////// 
  
Bookmarks.prototype.deleteAllBookmarks=function () {

  // Have the user confirm that they want to delete all the bookmarks. 
  if (confirm(txt_confirmDeleteAllCookies)) {
    for (j=0;j<this.config.ids.length;j++) {
      id=this.config.ids[j];
      deleteCookie(this.config.project + id);
    }

    this.listBookmarks();
  }

}

////////////////////////////////////////////////////////////// 

Bookmarks.prototype.deleteSeletedBookmarks=function () {
  today = new Date();
  aexp = new Date();
  aexp.setTime(today.getTime() + 1000*60*60*24*365);

  //get the list of bookmarks from the parent window.
  tmpBk=this.bookmarkList.split(",");
  
  for (u=0;u<tmpBk.length;u++) {
    checkBoxStr=this.config.toolFrame + ".document.bmForm." + tmpBk[u];
    isChk=eval(checkBoxStr + ".checked");

    if (isChk==true) {
      info=tmpBk[u].split("__");

      //get the contents of the cookie that has the selected 
      //bookmark in it.
      cookieName=project + info[0];
      curCookie=getCookie(cookieName);
      curCookie=curCookie.split(",");
      newCookieVal="";

      for (uu = 0; uu < curCookie.length; uu++) {
        re=/\/|\.|\#/;
        tmpName=curCookie[uu].substring(0,curCookie[uu].indexOf("::"));        
        while (tmpName.search(re)!=-1) tmpName=tmpName.replace(re,"");
                
        if (tmpName.indexOf(info[1])!=0) {
          if (newCookieVal=="") {
            newCookieVal=curCookie[uu];

          } else {
            newCookieVal=newCookieVal + "," + curCookie[uu];

          }

        }

      }

      if (newCookieVal=="") {
        deleteCookie(cookieName);

      } else {
        setCookie(cookieName,newCookieVal,aexp);

      }
      
    }
    
  }

  this.listBookmarks();
 
}