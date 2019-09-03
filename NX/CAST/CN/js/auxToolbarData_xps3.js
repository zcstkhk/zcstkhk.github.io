/*
This software and related documentation are proprietary to Siemens Product Lifecycle Management Software Inc.

(c) 2010 Siemens Product Lifecycle Management Software Inc. All Rights Reserved. 

All trademarks belong to their respective holders.
*/
 logo=null;
 auxToolbar=new Toolbar("auxToolbar","#f6f6f6","false","top.content.aux.aux_nav",logo,"top.resizeAuxToolbar()","");
 auxToolbar.addItem(expandAll=new Icon("expandAll","Expand All","top.toc.expandAll()","icons/expand_all.gif","","icons/expand_all_ovr.gif","","right","",""));
 auxToolbar.addItem(collapseAll=new Icon("collapseAll","Collapse All","top.toc.collapseAll()","icons/collapse_all.gif","","icons/collapse_all_ovr.gif","","right","",""));
 auxToolbar.addItem(auxbar1=new Separator("auxbar1","graphics/space.gif","right","2","12"));
 auxToolbar.addItem(dismissAuxFrame=new Icon("dismissAuxFrame","Hide Frame","top.showHideAux('')","icons/x.gif","","icons/x_ovr.gif","","right","",""));
