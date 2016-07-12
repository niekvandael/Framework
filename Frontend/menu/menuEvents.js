/**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 *
 * Package    : custom
 * Filename   : menuEvents.js
 */

"use strict";

var mainLayout  	= 'mainLayout';
var center			= 'center';
var bottom 			= 'bottom';
var right  			= 'trailing';
var mainCenterPanel = 'mainCenterPanel';
var centerPanel 	= 'centerPanel';
var rightPanel 		= 'rightPanel';
var bottomPanel 	= 'bottomPanel'; 
var mainTabContainer = 'mainTabContainer';

function loadMenuEvents(detail){

	/*
	 * _package: refer/rel
	 * entity: rel
	 * title: LANGUAGE.CURCD
	 */
	var load = function(_package, entity, isDetail){
				var file = "Detail";
				if(isDetail === undefined){
					file = "List";
				}
		
				require(["dojo/on",
				         "dijit/registry",
				         "dojo/dom",
				         "dojox/layout/ContentPane",
				         "dojo/domReady!",
				         "dijit/Menu",
				         "dijit/MenuItem",
				         "dijit/CheckedMenuItem",
				         "dijit/MenuSeparator",
				         "dijit/PopupMenuItem",
				         "dojo/domReady!"]
				, function(on, registry, dom){
			if (dom.byId( entity.toLowerCase() + 'MenuItem') != undefined) {
				addFavoritesMenuItem(entity.toLowerCase() + 'MenuItem');
				
				var text = registry.byId(entity.toLowerCase() + "MenuItem").titleNode.innerHTML;
				
				on(
						dom.byId(entity.toLowerCase() + "MenuItem"),
						"click",
						function(e) {
							var id = "CH" + entity.toUpperCase();
							if (detectWidgetAlreadyOpen(id)) {
								window.startupData = e.data;
								return;
							};
							
							buildBorderContainer(id, "modules/" + _package.toLowerCase() + "/" + file.toLowerCase() + "/" + entity + file + "Controller", text);
						});
			}
		
		});
	};
	
require(["dojo/on",
         "dijit/registry",
         "dojo/dom",
         "dojox/layout/ContentPane",
         "dojo/domReady!",
         "dijit/Menu",
         "dijit/MenuItem",
         "dijit/CheckedMenuItem",
         "dijit/MenuSeparator",
         "dijit/PopupMenuItem",
         "dojo/domReady!"
        ], function(on, registry, dom, ContentPane, Moveable){
	
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		// REFERENCE MENU
		////////////////////////////////////////////////////////////////////////////////////////////////////
		
		// 1 Employee List
		load("employee", "Employee");
		
		// 2 Order List
		load("order", "Order");
		
		// 2 Contract List
		load("contract", "Contract");

		// 2 Product List
		load("product", "Product");
});
}