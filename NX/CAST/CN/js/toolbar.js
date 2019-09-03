/*
 Copyright (c) 2005 UGS Corp.
    
 All Rights Reserved.
    
 This software and related documentation are proprietary to UGS Corp.
 */
 
///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function Toolbar(name, bgcolor, pageNumbers, target, logo, onResize, background) {
  this.children=new Array();
  this.name=name;
  this.bgcolor=((bgcolor=='') ? '#C0C0CC' : bgcolor);
  this.background=background;
  this.showBackground=true;
  this.pageNumbers=(((pageNumbers=='') || (pageNumbers=='true')) ? true : false);
  this.target=target;
  this.logo=logo;
  this.onResize=onResize;
    
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

Toolbar.prototype.addItem=function(child) {
  this.children.push(child);
  child.parent=this;

}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

Toolbar.prototype.mouseOver=function(id) {
  node=eval(id);  
  
  if ((node) && (node.graphic_ovr!="")) {
    img=eval(this.target + ".document." + id);
      
    img.src="";
    img.src=workDir + "/" + node.graphic_ovr;
  
  }
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

Toolbar.prototype.mouseOut=function(id) {
  node=eval(id);
  
  if ((node) && (node.graphic!="")) {
    img=eval(this.target + ".document." + id);
  
    img.src="";
    img.src=workDir + "/" + node.graphic;
  
  }
  
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
Toolbar.prototype.makeToolbar=function() {
  this.txt="";
  
  win=eval(this.target);
  
  // TODO: Not implemented in IE, try something else.
  //if (this.onResize!="") win.onresize=this.onresize;
  
  // Get document
  doc=win.document;
  
  // Note (Sept 7, 2007): use the dom to create the link element for the 
  // stylesheet rather than innerHTML because Safari does not allow using 
  // innerHTML to change the head element.
  this.headEle=doc.getElementsByTagName("head")[0];  
  newLink=doc.createElement("link");
  newLink.setAttribute("type","text/css");
  newLink.setAttribute("href","css/ui.css");
  newLink.setAttribute("rel","stylesheet");  
  this.headEle.appendChild(newLink);  
    
  this.bodyEle=doc.getElementsByTagName("body")[0];
  this.bodyEle.className=this.name;
  this.bodyEle.setAttribute("bgColor",this.bgcolor);
  
  if ((this.showBackground) && (this.background!=''))
    this.bodyEle.setAttribute("background",this.background);
    
  this.txt+="<table width='100%' border='0'>\n";
  this.txt+="<tr>\n";
  
  //Add everything that goes on the left (logo and lcons).
  this.txt+="<td valign='center' align='left'>\n";
  this.txt+="<nobr>\n";
    
  // Add the logo if it's going on the left
  if ((this.logo) && (this.logo.align=="left")) this.txt+=this.logo.getToolbarHTML();
  
  // Go through each child and get the html.
  for (this.ii=0;this.ii<this.children.length;this.ii++) {
    if (this.children[this.ii].align=="left")
      this.txt+=this.children[this.ii].getToolbarHTML();
  }
    
  
  this.txt+="</nobr></td>\n";
  
  
  //Add everything that goes on the right (logo and lcons).
  this.txt+="<td valign='center' align='right'><nobr>\n";
    
  // Go through each child and get the html.
  for (this.ii=0;this.ii<this.children.length;this.ii++) {
    if (this.children[this.ii].align=="right")
      this.txt+=this.children[this.ii].getToolbarHTML();
  }
  
  // Add page numbers if there are any.
  if (this.pageNumbers) {    
    pageOf=toc.currentPage.pageNum + "/" + toc.currentPage.lessonLength
    
    tdWidth=(((this.logo!=null) && (this.logo.align=="right")) ? ((new Number(this.logo.width)) + 20) : 20);
    
    // don't add this line for NS4
    if (! ((theBrowser=="NS") && (appVerNum<=4))) 
      this.txt+="</nobr></td>\n<td valign='center' align='right' width='" + tdWidth + "'><nobr>\n";
    
    if (toc.currentPage.pageNum!=-1) {
      this.txt+="<font class='pageOf'>" + pageOf + "</font>";
      
    } else {
       this.txt+="&nbsp;";

    }
    
  }
  
  // Add the logo if it's going on the right
  if ((this.logo) && (this.logo.align=="right")) this.txt+=this.logo.getToolbarHTML();  
    
  this.txt+="</nobr>\n"
  this.txt+="</td>\n";  
  this.txt+="</tr>\n";
  this.txt+="</table>\n";
  
  if (this.bodyEle!=null) {
    this.bodyEle.innerHTML=this.txt;
  } else {
    alert("Error, no document.");
  }
  
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function Icon(name, toolTip, command, graphic, graphic_dis, graphic_ovr, graphic_tog, align, width, height) {
  this.name=name;
  this.graphic=graphic;
  this.graphic_dis=(((graphic_dis==null) || (graphic_dis=='')) ? graphic : graphic_dis);
  this.graphic_tog=(((graphic_tog==null) || (graphic_tog=='')) ? graphic_dis : graphic_tog);
  
  this.graphic_ovr=graphic_ovr;

  this.toolTip=toolTip;
  this.command=command;
  this.align=align;
  this.width=width;
  this.height=height;

  this.type='icon';
  this.disabled=false;
  this.visible=true;
  this.selected=false;
  this.parent=null;

}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

Icon.prototype.getToolbarHTML=function() {

  html="";
  
  // If the icon is to be displayed.
  if (this.visible) {
  
    // Note: don't bother with this part for NS4!
    mouseAction=" onMouseOver='top." + this.parent.name + ".mouseOver(\"" + this.name + "\")' onMouseOut='top." + this.parent.name + ".mouseOut(\"" + this.name + "\")'";
    
    // Add width and height
    size=((this.width!="") ? " width='" + this.width + "'" : "");
    size+=((this.height!="") ? " height='" + this.height + "'": "");
    
    theTip=((this.toolTip!="") ? (" alt=\"" + this.toolTip + "\" title=\"" + this.toolTip + "\" ") : " ");
  
    if (this.disabled) {
      html="<img src='" + workDir + "/" + this.graphic_dis + "'" + theTip + "border='0' name='" + this.name + "'" + size + ">"; 
    
    } else if (this.selected) {
      html="<img src='" + workDir + "/" + this.graphic_tog + "'" + theTip + "border='0' name='" + this.name + "'" + size + ">"; 
          
    } else {
      html="<a href=\"javascript:" + this.command + "\"><img src='" + workDir + "/" + this.graphic + "'" + theTip + "border='0' name='" + this.name + "'" + mouseAction + size + "></a>"; 
      
    }
      
  }
  
  html+="\n";
  return html;
  
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function Separator(name, graphic, align, width, height) {
  this.name=name;
  this.graphic=graphic
  this.type="separator";
  this.visible=true;
  this.align=align;
  this.width=width;
  this.height=height;
  
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

Separator.prototype.getToolbarHTML=function() {
  html="";
  
  size=((this.width!="") ? " width='" + this.width + "'" : "");
  size+=((this.height!="") ? " height='" + this.height + "'": "");
  
  if (this.visible)
    html="<img name='" + this.name + "' src='" + workDir + "/" + this.graphic + "' border='0'" + size + ">\n";
    
  return html;
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function Logo(graphic, align, altText, width, height, url, command) {
  this.graphic=graphic;
  this.align=align;
  this.alternateText=altText;
  this.width=width;
  this.height=height;
  this.url=url;
  this.command=command;
  
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

Logo.prototype.getToolbarHTML=function() {
  dhtml="";
  
  size=((this.width!="") ? " width='" + this.width + "'" : "");
  size+=((this.height!="") ? " height='" + this.height + "'": "");
  img="<img src='" + workDir + "/" + this.graphic + "' border='0' alt=\"" + this.alternateText + "\" title=\"" + this.alternateText + "\"" + size + ">";
  
  if (this.url!="") dhtml+="<a href='" + this.url + "' target='_new'> " + img + "</a>";
  else if (this.command!="") dhtml+="<a href=\"javascript:" + this.command + "\">" + img + "</a>";
  else dhtml=" " + img + " ";
    
  return dhtml;
}