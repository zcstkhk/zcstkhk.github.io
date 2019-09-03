// $Id: $
/*
bcprt
Copyright (c) 2005 UGS Corp.

All Rights Reserved. 

This software and related documentation are proprietary to UGS Corp.
ecprt
*/

var indexArr = new Array();
var str;

function add(position,name,url1)
{
  this.position = position;
  this.name     = name;
  this.url1     = url1;
}

function addArr(position,name,url1) {
  // push the title and url into the indexArr array
  this.indexArr.push(new add(position,name,url1));
}

// check the position of the index entry
// space it over if position 2 or 3
function listArrTemp(){

  for(var i=0; i<indexArr.length; i++) {
    if(indexArr[i].position == 2){
      indexArr[i].name = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + indexArr[i].name;
    }
    else if (indexArr[i].position == 3){
      indexArr[i].name = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + indexArr[i].name;
    }
  }
  
}

// when the item in the list is selected, get the url
function getURL()
{
  var listIndex = document.menuform.itemlist.selectedIndex;
  var testURL1 = indexArr[listIndex].url1;
  
  // if there is no url, pop up message
  if(testURL1 == null){
    document.menuform.itemlist.selectedIndex = listIndex;
    alert(top.txt_noIndexDocument);
    return;
  }
  else{
    // get the url from the options form
    var url = indexArr[listIndex].url1;
    window.open(url,"main");
    document.menuform.itemlist.selectedIndex = listIndex;
    return;
  }
}

// constructor
function setUp() { 
  // menuform - form; itemlist - select menu; entry - text box  
  obj1 = new SelObj( 'menuform', 'itemlist', 'entry' );
} 

function SelObj( formname, selname, textname, str ) { 
    this.formname   = formname; 
    this.selname    = selname; 
    this.textname   = textname; 
    this.select_str = str || '';
    this.bldUpdate  = bldUpdate; 
} 
 
function bldUpdate() { 
    str = document.forms[this.formname][this.textname].value.replace( '^\\s*', '' );
    if( str == '' ) { 
        var indexSel = document.forms[this.formname][this.selname].selectedIndex;
        document.forms[this.formname][this.selname].selectedIndex =  indexSel;
        return; 
    } 
    var j = 0; 
    pattern1 = new RegExp( "^" + str, "i" ); 
    var formLength = indexArr.length;
    var indexPos = document.forms[this.formname][this.selname].selectedIndex;
    for( var i=0; i<formLength; i++ ) { 
        if( pattern1.test( indexArr[i].name )) {  
      document.forms[this.formname][this.selname].selectedIndex = i;
            return;
  } 
  else{
            document.forms[this.formname][this.selname].selectedIndex = indexPos;
        }
    }
}
