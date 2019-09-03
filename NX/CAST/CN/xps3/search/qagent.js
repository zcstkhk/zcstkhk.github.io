/**********************************************************************
qagent.js
Constructs the search form and interacts with the search applet
**********************************************************************/

// Adding indexOf function to arrays
if (!Array.prototype.indexOf)
{
	  Array.prototype.indexOf = function(elt /*, from*/)
	  {
	    var len = this.length;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
		 ? Math.ceil(from)
		 : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++)
	    {
	      if (from in this &&
		  this[from] === elt)
		return from;
	    }
	    return -1;
	  };
}
	
var highlightOn = true;
var highlightAvailable = true;

/*
//Include this if statement only if the highlighted pages contain dynamically written content (such as the navbars in I-DEAS help) - dynamically writing pages that contain dynamic content in NS6+ caused the dynamic content to display at the bottom of the file instead of the top, so we turned off highlighting.
if ( (navigator.appName.indexOf("Netscape") != -1) && (parseInt(navigator.appVersion)>=5) ) {
	highlightOn = false;
	highlightAvailable = false;
}
*/

var locPrefix = "../";
var resultLayout = "fullDescription";
var selectedCollections = new Array();
var hits = new Array();
var maxHits = 50;
var qaframeLoaded = false;
var lastQuery = "";
var showNavTags = false;
var docOpenMethod = "winopen";
var docBase = "";
var docBaseShort = "";
var results = "";
var locTopicSet = "";
var hlTagBefore = '<b style="background-color: #ffff66; color: black">';
var hlTagAfter = '</b>';
var lastHighlightedDoc = "";
var collectionCount = 0;
var hlHitLocation = null;
var collections = new Array();

function performSearch(win, qform, qagent) {
	collectionCount = 0;
	hits = new Array();
	_collectQueryOptions(qform);
	results = '<font face="sans-serif, arial, helvetica" size="-1">';
	doSearch(win, qagent);
}


// Executes the search
function doSearch(win, qagent) {

	qagent.unselectAllCollections();
	qagent.selectCollection(collections[selectedCollections[collectionCount]].id);
	qagent.setMaxHits(maxHits);

	message=window.open("", "qaview");
	message.document.write('<html><head><link rel="stylesheet" type="text/css" href="qagent.css" title="Style"></head>');
	message.document.write('<body bgcolor="ffffff"><p class="title2">' + searchingText + ' <i>' + collections[selectedCollections[collectionCount]].name + '</i>... ' + pleaseWaitText + '.</p></body></html>');
	message.document.close();

	lastHighlightedDocIndex = "";
	lastHighlightedDoc = "";

	var currentHits = qagent.search(lastQuery);
	if(currentHits == -2) {
		//do nothing - java callback will be used
	}
	else {
		appendResults(win, qagent, currentHits);
	}
	
}


// Format search results for display
function appendResults(win, qagent, currentHits) {
	
	hits.push(currentHits);
	
	if (currentHits == 1) 
	{
		useDocs = "&nbsp;" + documentText;
	}
	else 
	{
		useDocs = "&nbsp;" + documentsText;
	}

	if (selectedCollections.length > 1) 
	{
		results += '<div><font class="title2"><a name="' + collectionCount + '"></a>' + collections[selectedCollections[collectionCount]].name + ': ' + currentHits + useDocs + '</font>';
	}
	else 
	{
		results += '<div>';
	}

	currentHits = parseInt(currentHits);

	if(currentHits >= -1) 
	{
		for (i=1; i <= currentHits; i++) 
		{
			results += _printHit(qagent, i);
		}
	}
	
	results += "</div>";
	collectionCount++;

	if (collectionCount == selectedCollections.length) 
	{
		win.location.replace("../search/qagent_showresults.html");
	}
	else
	{
		doSearch(win, qagent);
	}
	
}


// Get the options selected on the search form
function _collectQueryOptions(qform) {

	selectedCollections = _getCollection(qform);
	
//	var colls = "";

//	for (var m=0; m< selectedCollections.length; m++) {
//		colls += selectedCollections[m] + " ";
//	}

	lastQuery = _getQuery(qform);
	maxHits = _getMaxHits(qform);
	resultLayout = _getResultLayout(qform);
	highlightOn = _getShowHighlighted(qform);
	
}


// Determine which collections were selected on the search form - if the drop-down list of collections is not included on the search form, use the first (and only) collection as the selected collection.
function _getCollection(qform) {
	var selectedColls = new Array();
	if (qform.collection) {
		for (var j=0; j < qform.collection.length; j++) {
			if (qform.collection.options[j].selected == true) {
				selectedColls.push(qform.collection.options[j].value);
			}
		}
	}
	else {
		selectedColls.push(0);
	}
	return selectedColls;
}


function _getQuery(qform) {
	return qform.query.value;
}


function _getMaxHits(qform) {
	var maxh = maxHits;

	if(qform && qform.maxhits != null) 
	{
		var mh = qform.maxhits.options[qform.maxhits.selectedIndex].value;
		maxh = eval(mh);
	}
	else // try to get the value from the cookie
	{
		var cookieValue = getCookie("maxHits");
		if(cookieValue)
		{
			maxh = cookieValue;
		}
	}

	return maxh;
}


function _getResultLayout(qform) {
	var l = resultLayout;
	if(qform && qform.resultLayout != null) {
		l = qform.resultLayout.options[qform.resultLayout.selectedIndex].value;
	}
	else // try to get the value from the cookie
	{
		var cookieValue = getCookie("resultLayout");
		if(cookieValue)
		{
			l = cookieValue;
		}
	}
	
	return l;
}


function _getShowHighlighted(qform) 
{
	var hl = highlightOn;
	
	if(qform && qform.showHighlighted != null) {
		if(qform.showHighlighted.checked) {
			hl = true;
		}
		else {
			hl = false;
		}
	}
	else // try to get the value from the cookie
	{
		var cookieValue = getCookie("highlightOn");
		if(cookieValue)
		{
			if(cookieValue == "true")
			{
				hl = true;
			}
			if(cookieValue == "false")
			{
				hl = false;
			}
		}

	}
	
	return hl;
}


// Write the search results to the qaview frame
function _printSearchResults(doc, qagent) {

	if(!qagent.hasCachedResults()) {
		// page was reloaded; return to the main page...
		window.open("blank.html", "qaview");
		return;
	}

	var totalHits = 0;
	for (var x=0; x<hits.length; x++) {
		totalHits += hits[x];
	}

	var msgCount = qagent.getLogMessagesCount();

	doc.open();

	if(msgCount > 0) {
		doc.writeln('<ul>');
		
		for(var i = 0; i < msgCount; i++) {
			var t = qagent.getLogMessageType(i);
			if(t<4) {
				doc.writeln('<li>' + qagent.getLogMessage(i) + '</li>');
			}
			else {
				doc.writeln('<li><b>' + qagent.getLogMessage(i) + '</b></li>');
			}
		}
		doc.writeln('</ul>');
		doc.writeln('<br>');
	}

	if(totalHits == 0) {
		doc.write('<b>' + nothingFoundText + '</b>');
	}

	else {
		if (selectedCollections.length == 1) {
			doc.write('<font class="title2">' + collections[selectedCollections[0]].name + ': <font color="#808080">' + hits[0] + ' ' + useDocs + '</font></font><br><br>');
		}
		else if(selectedCollections.length > 1) {
			doc.write('<ul><font class="title2">');
			for (var i=0; i<selectedCollections.length; i++) {
				doc.write('<li><b><a href=#' + i + '>' + collections[selectedCollections[i]].name + ': <font color="#808080">' + hits[i] + ' ' + useDocs + '</font></a></b></li>');
			}
			doc.write('</ul></font>');
		}
		doc.write(results);
	}
	
}


function _openResultsPage(doc) {
	doc.open();
	doc.writeln('<html>');
	doc.writeln('<meta>');
	doc.writeln('<link rel="stylesheet" type="text/css" href="qagent.css" title="Style">');
	doc.writeln('</meta>');
	doc.writeln('<body>');
	doc.writeln('<hr size="1" color="navy">');
}


function _closeResultsPage(doc) {
	doc.write( '<hr size="1" color="navy"/><font size=-2>' );
	// REMOVAL OR MODIFICATION OF THE MESSAGE BELLOW IS IN VIOLATION OF THE LICENSE AGREEMENT - DO NOT TOUCH!
	doc.write( "<i>Search technology by JObjects International (<a href='http://www.jobjects.com' target='_blank'>http://www.jobjects.com</a>)</i>" );
	doc.writeln( '</font><hr size="1" color="navy">' );
	doc.writeln( "</body></html>" );
	doc.close();
}


// Adds the html code for an individual search result to the results string
function _printHit(qagent, hitIndex) {

	if(hitIndex < 0)
		return;
		
	var loc = qagent.getHitLocation(hitIndex);
	var title = qagent.getHitTitle(hitIndex);
	var hitResults = "";

	if(title == null) {
		title = loc;
	}
	title = "" + title;
	if(title.length == 0) {
		title = loc;
	}

	// add link to file
	hitResults += '<div style="margin:5px;"><b><a href="javascript:parent.showDocument(\'' + loc + '\', parent.qawin.document.searchForm, parent.qaapplet.document.QuestAgent, ' + hitIndex + ');">' + title + '</b></a><br/>';
	//hitResults += '<font color="#808080"> - ' + qagent.getHitRelevance(hitIndex) + '%</font></a><BR>';

	// add description if available
	var desc = qagent.getHitField(hitIndex, "(summary_hl)");
	//var desc = qagent.getHitField(hitIndex, "description");
	if (desc != null) {
		var jsdesc = "" + desc;
		if (jsdesc.length > 0 && resultLayout == "fullDescription") {
			hitResults += '<span class="results">' + jsdesc + '...</span><br>';
		}
	}

	hitResults += "</div>";
	return hitResults;
	
}


function _printCollectionChoice(doc, qagent) 
{
	doc.writeln('<select name="collection" size="2" multiple>');
	var selectedDefault = false;
	
	for(var i = 0; i < collections.length; i++) 
	{
		var collection = collections[i];
		if(collection.id == "all" || collection.id == top._self.metadata.topicSetId)
		{
			doc.write('\n<option value="' + i + '"');
			if (selectedCollections.length == 0 && !selectedDefault) 
			{
				doc.write(' selected="selected"');
				selectedDefault=true;
			}
			else 
			{
				for (var x=0; x<selectedCollections.length; x++) 
				{
					if(selectedCollections[x] == i) 
					{
						doc.write(' selected="selected"');
					}
				}
			}
			doc.write('>' + collection.name);
		}
	}
	doc.writeln('</select>');
}


// Called by the applet when it is done loading - we need to wait for the applet to finish loading before constructing the search form
function onPageLoaded() {
	qaframeLoaded = true;	
	window.open("../search/qagent_printui.html", "qawin");
}
function _loadCollections(doc, qagent)
{
	var collectionIds = new Array();
	
	collections = new Array();
	
	// load collections
	for(var i=0; i<qagent.getCollectionCount(); i++)
	{
		collections.push({id: qagent.getCollectionId(i), name: qagent.getCollectionName(i)});
		collectionIds.push(qagent.getCollectionId(i));
	}
	
	if(top._self.metadata.topicSetId)
	{
		// order the collection by putting the topicSet id on top
		var index = collectionIds.indexOf(top._self.metadata.topicSetId);
		var thisCourse = collections[index];
		collections.splice(index,1);
		collections.unshift(thisCourse);
	}
	
	//alert(collections);
}


// Constructs the search form
function _printSearchForm(doc, qagent) {
	var q = "" + lastQuery;
	if(q.length > 0) {
		q = qagent.replace(lastQuery, "\"", "&quot;");
	}

	doc.writeln('<head>');
	doc.writeln('<link rel="stylesheet" type="text/css" href="qagent.css" title="Style">');
	doc.writeln('<meta http-equiv="content-type" content="text/html; charset=utf-8">');
	doc.writeln('</head>');
	doc.writeln('<body bgcolor="#FFFFFF" style="margin:0px;">');
	doc.writeln('<table style="margin:0px;" border="0" width="100%" marginwidth="0" marginheight="0" leftmargin="0" topmargin="0">');
	doc.writeln('<form name="searchForm"');
	doc.writeln('onSubmit="parent.performSearch(parent.qaview, parent.qawin.document.searchForm, parent.qaapplet.document.QuestAgent); return false;">');

	// show collections if there is more than one
	if(top._self.metadata.workingConfigurationMap.searchCollection)
	{
		doc.writeln('<tr>');
		doc.writeln('<td colspan="2" valign=top>');
		_printCollectionChoice(doc, qagent);
		doc.writeln('</td>');
		doc.writeln('</tr>');
	}

	doc.writeln('<tr>');
	doc.writeln('<td colspan="2" valign=top>');
	doc.writeln('<input type="text" name="query" value="', q, '" size="20">&nbsp;');
	doc.writeln('<nobr><input type="image" src="../graphics/go.gif" alt="' + findText + '" onClick="document.searchForm.submit();" VALUE="' + findText + '">');
	
	if(allowCookies2(false))
	{
		doc.writeln('<a href="#" onClick="window.open(\'../search/qagent_advanced_options.html\',\'options\',\'	toolbar=no,menubar=no,scrollbars=yes,resizable=yes,width=320,height=250\')" style="margin-left:10px;font-size:8pt;">' + advancedText + '</a>');
	}
	
	doc.writeln("</nobr></td></tr>");

	doc.writeln('</form>');
	doc.writeln('</table>');
	
	doc.writeln('<script language="JavaScript">');
	doc.writeln('document.searchForm.query.focus();');
	doc.writeln('</script>');

}

function printOptionsPage(doc)
{
	doc.writeln('<div align="center" style="margin:20px;">');
	doc.writeln('<a href="#" onClick="window.open(\'../search/qagent_tips.html\',\'tips\',\'	toolbar=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=600\')"><b>' + searchTipsText + '</b></a>');
	doc.writeln('</div>');
	
	doc.writeln('<fieldset>');
	
	doc.writeln('<form name="optionsForm">');
	printAdvancedOptions(doc);
	doc.writeln('</form>');
	doc.writeln('</fieldset>');
}

function printAdvancedOptions(doc)
{
	doc.writeln('<table>');
	doc.writeln('<tr>');
	doc.writeln('<td valign="middle">');
	doc.writeln('<label for="resultLayout">' + descriptionLabel + '</label>');
	doc.writeln('</td>');
	doc.writeln('<td>');
	doc.writeln('<select name="resultLayout">');
	doc.write('<option value="fullDescription" ');
		if(_getResultLayout() == "fullDescription")
		{
			doc.write('selected="selected" ');
		}
	doc.writeln('>' + fullDescriptionText);
	doc.write('<option value="titleOnly" ');
			if(_getResultLayout() == "titleOnly")
			{
				doc.write('selected="selected" ');
			}
	doc.writeln('>' + titleOnlyText);
	doc.writeln('</select>');
	doc.writeln('</td>');
	doc.writeln('</tr>');
	doc.writeln('<tr>');
	doc.writeln('<td valign="top">');
	doc.writeln('<label for="maxhits">' + maxHitsLabel + '</label>');
	doc.writeln('</td>');
	doc.writeln('<td>');
	doc.writeln('<select name="maxhits">');
	var hits = new Array(200, 100, 50, 25);
	for(x in hits)
	{
		doc.write('<option value="' + hits[x] + '" ');
		if(_getMaxHits() == hits[x])
		{
			doc.write('selected="selected" ');
		}
		doc.writeln('>' + hits[x] + ' ' + resultsText);
	}
	doc.writeln('</select>');
	doc.writeln('</td>');
	doc.writeln('</tr>');

	doc.writeln('<tr><td>' + highlightKeywordsText + '</td><td>');
	if (highlightAvailable == true) 
	{
		doc.write('<input type="checkbox" name="showHighlighted"');
		if(_getShowHighlighted())
		{
			doc.write('checked="checked"');
		}
		doc.write(' />');
	}
	doc.writeln('</td>');
	doc.writeln('</tr>');
	
	doc.writeln('<tr>');
	doc.writeln('<td colspan="2" align="center">');
	doc.writeln('<input type="button" value="' + saveText + '" onClick="saveOptionsForm(document); window.close();" />');
	doc.writeln('<input type="button" value="' + cancelText + '" onClick="window.close();" />');
	doc.writeln('</td>');
	doc.writeln('</tr>');
	doc.writeln('</table>');
}

function saveOptionsForm(doc)
{
	//alert(doc.optionsForm.showHighlighted.checked);
	//alert(doc.optionsForm.resultLayout.options[doc.optionsForm.resultLayout.selectedIndex].value);
	//alert(doc.optionsForm.maxhits.options[doc.optionsForm.maxhits.selectedIndex].value);

	window.opener.setCookie("highlightOn", doc.optionsForm.showHighlighted.checked);
	window.opener.setCookie("resultLayout", doc.optionsForm.resultLayout.options[doc.optionsForm.resultLayout.selectedIndex].value);
	window.opener.setCookie("maxHits", doc.optionsForm.maxhits.options[doc.optionsForm.maxhits.selectedIndex].value);
}

function printResultsPage(doc, qagent) {
	_openResultsPage(doc);
	if(qagent.hasCachedResults()) {
		_printSearchResults(doc, qagent);
	}
	_closeResultsPage(doc);
}


// For the selected search result, determine the type of topicSet, store the file location in top.realFile (for autosync when highlighting is on), and open the document with or without highlighting.
function showDocument(loc, qform, qagent, hitId) {

// top.loadContent(content, fileName);
// top.loadFile(fileName);
	_collectQueryOptions(qform);
  	var canHL = canHighlight(loc);
  	
  	locTopicSet = loc.substr(0,loc.indexOf("/"));
    	// if the topic set is not in the path, set it to top._self.metadata.topicSetId, because we are already inside of this topic set
  	if(locTopicSet == "" && top._self.metadata.topicSetId)
  	{
  		locTopicSet = top._self.metadata.topicSetId;
  	}
	docBase = qagent.getDocumentBase(loc) + "";
	docBaseShort = loc.substr(loc.lastIndexOf("/")+1);
	top.realFile = docBaseShort;
	
	if(highlightOn && canHL) {
		qagent.setHighlightingTags(hlTagBefore, hlTagAfter);
		hlHitLocation = loc;
		//qagent.highlightDocDirectCB(loc, showNavTags, "OnHighlightingDone");
		qagent.highlightDocumentCB(hitId, showNavTags, "OnHighlightingDone");
	}
	else {
		showDocumentNoHL(loc);
	}
	
}


// Determines whether the specified file can be displayed with word highlighting
function canHighlight(loc) {
	
	var loc2 = "" + loc.toLowerCase();
	var canHL = false;

	if(loc2.indexOf("http:") == 0) {
		canHL = false;
	}
	else if((loc2.indexOf(".htm") + 4) == loc2.length) {
		canHL = true;
	}
	else if((loc2.indexOf(".html") + 5) == loc2.length) {
		canHL = true;
	}

	return canHL;
	
}


function handleHighlightedDocument(hlPage) {
	if(hlPage.indexOf("qagent_hl_msg:") == 0) { //unable to highlight
		alert(hlPage.substring(14));
		showDocumentNoHL(hlHitLocation);
		return;
	}
	lastHighlightedDoc = '<base href="' + docBase + '">' + hlPage;
	showDocumentHL();
}


// Open the start file appropriate to the type of topicSet; open in the left frame if part of the current topicSet, else open in a new window; set the openedByGlobal and realFile values for autosync
function showDocumentHL() {
	
	//if the file to open is part of the current topicSet, open in the right frame
	if (locTopicSet == top._self.metadata.topicSetId) {
		top.loadFile(docBaseShort);
		//top.loadContent(lastHighlightedDoc, docBaseShort);
	}
	
	//if the file to open is part of a different topicSet, open the start file for that topicSet in a new window (the name of the start file differs depending on the type of deliverable - robo, tdoc, selfPaced)
	else {		
		// get the launchFile for the topicSet
		var myLaunchFile = top._self.metadata.workingConfigurationMap.launchFile;
		for(var i=0; topicSetBookmarkStartFileArray.length ;i++)
		{
			if(topicSetBookmarkIDArray[i] == locTopicSet)
			{
				myLaunchFile = topicSetBookmarkStartFileArray[i];
				break;
			}
		}
		
		var win = window.open("../" + locTopicSet + "/" + myLaunchFile + "?goto=search/qagent_highlight.html&vars=-aux,-home", "topicset");
		
		win.focus();
		win.openedByGlobal = true;
		win.realFile = docBaseShort;
		
	}

}


// Open the start file appropriate to the type of topicSet; set the openedByGlobal and realFile values for autosync
function showDocumentNoHL(loc) {
	
	loc = locPrefix + loc;
	if (locTopicSet == top._self.metadata.topicSetId) {
		var win = window.open(loc, "main");
		win.focus();
	}
	else {
		// bug fix for tabbed browsers...  open the named window so we can close it and reopen to gain the focus
		//var temp = window.open("", locTopicSet);
		//temp.close();
		
		// get the launchFile for the topicSet
		var myLaunchFile = top._self.metadata.workingConfigurationMap.launchFile;
		for(var i=0; topicSetBookmarkStartFileArray.length ;i++)
		{
			if(topicSetBookmarkIDArray[i] == locTopicSet)
			{
				myLaunchFile = topicSetBookmarkStartFileArray[i];
				break;
			}
		}
		
		var win = window.open("../" + locTopicSet + "/" + myLaunchFile + "?goto=search/qagent_nohighlight.html&vars=-aux,-home", "topicset");
		
		win.focus();
		win.openedByGlobal = true;
		win.realFile = docBaseShort;
	}
	
}


function printLastHighlightedPage(doc) {
	doc.open();
	doc.write(lastHighlightedDoc);
	doc.close();
}
