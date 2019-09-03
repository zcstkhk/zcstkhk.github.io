

/////////////////////////////////////////////////////////////
// Functions used to create, delete and get http cookies
///////////////////////////////////////////////////////////// 
  
  function setCookie(name, value, expire) { 
  
    // If no expiration date has been send then create one.
    if (! expire) {
      var today = new Date() 
      var expire = new Date() 

      expire.setTime(today.getTime() + 1000*60*60*24*365); 
    }
    
    document.cookie = name + "=" + escape(value) + ((expire == null) ? "" : ("; expires=" + expire.toGMTString())) + "; path=/"; 

  }
  
////////////////////////////////////////////////////////////// 
  
  function deleteCookie(aname, avalue) {    
    aexp = new Date("july 24, 1998"); 
    setCookie(aname, avalue,aexp); 

  }
  
//////////////////////////////////////////////////////////////

  function getCookie(name) {
    var search = name + "="; 

    if (document.cookie.length > 0) { // if there are any cookies 
      offset = document.cookie.indexOf(search);
      
    
      if (offset != -1) { // if cookie exists 
    
        // set index of beginning of value 
        offset += search.length; 
    
        // set index of end of cookie value 
        end = document.cookie.indexOf(";",offset); 
      
        if (end == -1) 
          end = document.cookie.length; 
  
        theVal = unescape(document.cookie.substring(offset,end)); 

        return theVal;

      }  
    }

  }
  
  function allowCookies() 
  {
  	return allowCookies2(true);
  }
  
    
    function allowCookies2(doAlert) {
      // Cookie test, set a cookie then see if it can be retrieved.
      setCookie("ugsTestCookie","test");
      test=getCookie("ugsTestCookie");
      
      // localize the text below!
      if ((test) && (test=="test")) {
        deleteCookie("ugsTestCookie");
      } 
      else  
      {
      	if(doAlert)
      	{
        	alert(txt_cookieNotSupported);
        }
        return false;
      }
      
      return true;
  }
  
  