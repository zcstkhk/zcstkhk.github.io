// $Id: $
/*
bcprt
Copyright (c) 2005 UGS Corp.

All Rights Reserved. 

This software and related documentation are proprietary to UGS Corp.
ecprt
*/

/*
	qagent_ui_text.js - text that displays in the search UI.  For multibyte languages, use the unicode code point (\uXXXX) not native encoding because native encoding gets lost when including text from external file.
*/

// These two strings are in the context of "Searching collection1...Please wait".
var searchingText = "Searching";
var pleaseWaitText = "Please wait";

// These two strings are in the context of "collection1: 50 documents".
var documentText = "result";
var documentsText = "results";

//  Displays when the search returns no results.
var nothingFoundText = "No results were found.  Please modify your query and try again.";

// Displays on the button you click to start the search.
var findText = "Find";

// These two strings are in a drop-down and specify in which format the search results will display.
var fullDescriptionText = "Full Description";
var titleOnlyText = "Title Only";

// The label for the description options
var descriptionLabel = "Description Level";

// This string displays in the drop-down in the context of "25 results".
var resultsText = "Results";

// The label for the maxhits option
var maxHitsLabel = "Maximum Results";

// This string displays next to the checkbox that turns keyword highlighting on or off.
var highlightKeywordsText = "Highlight Keywords?";

// This string is the link that opens a window displaying the search tips.
var searchTipsText = "Search Tips";

// This string displays in the drop-down list as the "search all" pick.
var entireHelpText = "Entire Help Collection";

// This string displays next to the search box when cookies are enabled.  Clicking the link will display an "Advanced Options" page.
var advancedText = "Options";

var saveText = "Save";
var cancelText = "Cancel";

// These strings are messages output from the applet.  When translating, please leave the {0} and {1} as is...they specify a value supplied by the applet and are provided to show the context of the phrase.
var msg_no_query_specified = "The search text was not specified."
var msg_collection_list_empty = "There are no searchable collections.";
var msg_collection_not_available = "{0} is not available.";
var msg_no_valid_terms_in_query = "The search text does not contain any valid terms.";
var msg_no_variable_in_query = "There is no variable in the search text.";
var msg_index_param_not_specified = "The index parameter is not defined for collection: {0}.";
var msg_query_is_constant_true = "The search text matches all collection documents. Please make the search text more specific.";
var msg_query_is_constant_false = "This search text does not match any documents. Please make the search text less specific.";
var msg_search_canceled = "The search has been canceled.";
var msg_hits_found = "Pages found: {0}";
var msg_query_parser_not_expected = "This search text is not expected: {0}.";
var msg_query_parser_not_expected_after_token = "Search";
var msg_query_parser_not_expected_end_after_token = "{0} is not expected after {1}.";
var msg_query_parser_not_expected_in_phrase = "This search text is not expected in a phrase: {0}.";
var msg_query_parser_empty_request = "The search text does not contain terms.";
var msg_query_parser_not_expected_end = "The end of the search text was unexpected.";
var msg_query_parser_binary_operator_usage = "This operator is not expected: {0}.";
var msg_can_not_add_to_phrase = "This search text cannot be added to a phrase: {0}.";
