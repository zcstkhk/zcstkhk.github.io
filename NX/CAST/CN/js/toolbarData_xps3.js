/*
This software and related documentation are proprietary to Siemens Product Lifecycle Management Software Inc.

(c) 2010 Siemens Product Lifecycle Management Software Inc. All Rights Reserved. 

All trademarks belong to their respective holders.
*/
 logo=null;
 toolbar=new Toolbar("toolbar","#f6f6f6","false","top.nav",logo,"","");
 toolbar.addItem(contents=new Icon("contents","Contents","top.showHideAux('contents')","icons/contents.gif","","icons/contents_ovr.gif","icons/contents_tog.gif","left","25","25"));
 toolbar.addItem(indexTab=new Icon("indexTab","Index","top.showHideAux('indexTab')","icons/index.gif","","icons/index_ovr.gif","icons/index_tog.gif","left","25","25"));
 toolbar.addItem(search=new Icon("search","Search","top.showHideAux('search')","icons/search.gif","","icons/search_ovr.gif","icons/search_tog.gif","left","25","25"));
 toolbar.addItem(bookmarks=new Icon("bookmarks","Go to bookmarks","top.showHideAux('bookmarks')","icons/bookmarks.gif","","icons/bookmarks_ovr.gif","icons/bookmarks_tog.gif","left","25","25"));
 toolbar.addItem(partfileIcon=new Icon("partfileIcon","Part File Information","top.popUpPage('partfile','partfile','resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars,width=450,height=450')","icons/partfiles.gif","","icons/partfiles_ovr.gif","","right","25","25"));
 toolbar.addItem(glossaryIcon=new Icon("glossaryIcon","Glossary","top.popUpPage('glossary','glossary','resizable=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars,width=450,height=450')","icons/glossary.gif","","icons/glossary_ovr.gif","","right","25","25"));
 toolbar.addItem(bar3=new Separator("bar3","icons/separator.gif","right","",""));
 toolbar.addItem(home=new Icon("home","Go Home","top.goHome()","icons/home.gif","","icons/home_ovr.gif","","right","25","25"));
 toolbar.addItem(bookmark=new Icon("bookmark","Set Bookmark","top.bookmarkTool.setBookmark()","icons/bookmark.gif","icons/bookmark_dis.gif","icons/bookmark_ovr.gif","","right","25","25"));
 toolbar.addItem(lessInfo=new Icon("lessInfo","Less Information","top.setShowAll(false)","icons/abridged.gif","","icons/abridged_ovr.gif","","right","25","25"));
 toolbar.addItem(lessInfo1=new Icon("lessInfo1","Less Information","top.setShowAll(false)","icons/abridged1.gif","","icons/abridged1_ovr.gif","","right","25","25"));
 toolbar.addItem(moreInfo=new Icon("moreInfo","More Information","top.setShowAll(true)","icons/complete.gif","","icons/complete_ovr.gif","","right","25","25"));
 toolbar.addItem(moreInfo1=new Icon("moreInfo1","More Information","top.setShowAll(true)","icons/complete1.gif","","icons/complete1_ovr.gif","","right","25","25"));
 toolbar.addItem(bar4=new Separator("bar4","icons/separator.gif","right","",""));
 toolbar.addItem(prev=new Icon("prev","Previous Page","top.gotoPrevPage()","icons/previous.gif","icons/previous_dis.gif","icons/previous_ovr.gif","","right","25","25"));
 toolbar.addItem(next=new Icon("next","Next Page","top.gotoNextPage()","icons/next.gif","icons/next_dis.gif","icons/next_ovr.gif","","right","25","25"));
 toolbar.addItem(back=new Icon("back","Go Back","top.goBack()","icons/back.gif","","icons/back_ovr.gif","","right","25","25"));
 toolbar.addItem(bar5=new Separator("bar5","icons/separator.gif","right","",""));
