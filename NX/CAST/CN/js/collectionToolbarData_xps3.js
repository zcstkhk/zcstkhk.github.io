/*
This software and related documentation are proprietary to Siemens Product Lifecycle Management Software Inc.

(c) 2010 Siemens Product Lifecycle Management Software Inc. All Rights Reserved. 

All trademarks belong to their respective holders.
*/
 logo=null;
 collectionToolbar=new Toolbar("collectionToolbar","#f6f6f6","false","top.nav",logo,"","");
 collectionToolbar.addItem(contents=new Icon("contents","Contents","top.showHideAux('contents')","icons/contents.gif","","icons/contents_ovr.gif","icons/contents_tog.gif","left","25","25"));
 collectionToolbar.addItem(search=new Icon("search","Search","top.showHideAux('search')","icons/search.gif","","icons/search_ovr.gif","icons/search_tog.gif","left","25","25"));
 collectionToolbar.addItem(bookmarks=new Icon("bookmarks","Go to bookmarks","top.showHideAux('bookmarks')","icons/bookmarks.gif","","icons/bookmarks_ovr.gif","icons/bookmarks_tog.gif","left","25","25"));
 collectionToolbar.addItem(assessments=new Icon("assessments","Assessments","top.showHideAux('assessments')","icons/assessment.gif","","icons/assessment_ovr.gif","icons/assessment_tog.gif","left","25","25"));
