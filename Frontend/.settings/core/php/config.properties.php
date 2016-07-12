<?php 
/**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 *
 * Package    : /
 * Filename   : config.properties.js
*/
?>
<script type="text/javascript">
	window.CONFIG = {};
	
	// CRUD configuration
	CONFIG.CREATE  	= 'A';
	CONFIG.READ		= 'G';
	CONFIG.UPDATE	= 'U';
	CONFIG.DELETE	= 'D';

	CONFIG.NULL_VALUE_TRUE = "Y";
	CONFIG.NULL_VALUE_FALSE = "N";

	CONFIG.URL = document.location.protocol + "//" + document.location.host;
	

	// Webservice options
	
	CONFIG.GET_LIST_DATA		=	"getListData";
	CONFIG.CREATE_RECORD		=	"createRecord";
	CONFIG.READ_RECORD			=	"readRecord";
	CONFIG.UPDATE_RECORD		=	"updateRecord";
	CONFIG.UPDATE_EDITABLE_LIST	=	"updateListData";
	CONFIG.DELETE_RECORD		=	"deleteRecord";
	CONFIG.GET_PROGRESS		=	"getProgress";

	CONFIG.ACTIVE = "A";
	CONFIG.OBSOLETE = "O";

	CONFIG.YES = "Y";
	CONFIG.NO = "N";
	
	CONFIG.DEBUG = true;
</script>