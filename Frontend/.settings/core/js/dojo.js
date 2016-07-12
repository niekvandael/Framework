/**
 * CREATED BY NVD ON 23 sep. 2014 09:26:30

 * Package    : js
 * Filename   : dojo.js
*/

"use strict";

function setLabel(tag, attrs, placeAt) {
	require([ "dojo/dom-construct", "dojo/_base/window" ], function(domConstruct, win) {
		if (attrs.length > 0) {
			var tempAttrs = '{';
			for (var i = 0; i < attrs.length; i++) {
				if (attrs[i][0] != "style") {
					tempAttrs = tempAttrs + '"' + attrs[i][0] + '" : "' + attrs[i][1] + '", ';
				} else {
					var style = '{';
					for (var j = 1; j < attrs[i].length; j++) {
						style = style + '"' + attrs[i][j][0] + '" : "' + attrs[i][j][1] + '", ';
					}
					style = style.substr(0, style.length - 2) + '}  ';
					tempAttrs = tempAttrs + '"style" : ' + style;
				}
			}
			tempAttrs = tempAttrs.substr(0, tempAttrs.length - 2) + '}';
			attrs = JSON.parse(tempAttrs);
		}
		domConstruct.create(tag, attrs, placeAt);
	});
}

function changeStyle(widget, style) {
	require([ "dojo/dom-style" ], function(domStyle) {
		for (var i = 0; i < style.length; i++) {
			var styleString = '{ "' + style[i][0] + '" : ' + '"' + style[i][1] + '" }';
			domStyle.set(widget, JSON.parse(styleString));
		}
	});
}

function setText(widget, html) {
	widget.innerHTML = html;
}

function getValue(widget) {
	return widget.get('value');
}

function setValue(widget, value) {
	value = (typeof value !== 'undefined') ? value : '';
	
	if(widget != undefined){
		widget.set('value', value);
	}
}

function setFocus(widget) {
	widget.focus();
}

function setDisabled(widget, action) {
	action = (typeof action !== 'undefined') ? action : true;
	widget.set("disabled", action);
}

function disableButtons(buttons){
	if (typeof buttons != undefined){
		for (var property in buttons){
			getDijitWidgetById(property + "Button", function(widget){
				widget.set("disabled", true);
			});
		}
	}
}

function getDijitWidgetById(id, callback) {
	require([ "dijit/registry" ], function(registry) {
		var widget = registry.byId(id);
		callback(widget);
	});
}

function getDojoWidgetById(id, callback) {
	require([ "dojo/dom" ], function(dom) {
		var widget = dom.byId(id);
		callback(widget);
	});
}

function setPageInformation(id, message, color) {
	//TODO: disable save button and enabled it in the callback
//	 getDijitWidgetById('saveButton', function(saveButon){
//		 saveButton.set('disabled', false);
//	 });
	  
	require([ "dojo/dom", "dojo/_base/fx", "dojo/dom-style" ], function(dom, fx, style) {
		var info = dom.byId(id + "pageInformation");
		if (info === null){
			return;
		}
		info.innerHTML = message;
		style.set(id + "pageInformation", "opacity", "1");
		style.set(id + "pageInformation", "color", color);
		fx.fadeOut({
			node : info,
			duration : 10000
		}).play();
	});
}

function setStyle(nodeId, property, value){
	require([ 'dojo/dom-style', 'dijit/registry' ], function (domStyle, registry) {
		if(registry.byId(nodeId) == undefined){
			document.getElementById(nodeId).style[property] = value;
			return;
		}
		
		if(registry.byId(nodeId).domNode != undefined){
		    domStyle.set(registry.byId(nodeId).domNode, property, value);
		    return;
		}
	});
}

function executeFunctionWhenDomReady(scope, afunction, params){
	if(params == undefined){
		params = [];
	}
	params.concat([undefined, undefined, undefined, undefined, undefined]);

	require( [ "dojo/domReady!" ], function() {
		setTimeout(function(){
			window.scope = scope;
			scope[afunction](params[0], params[1], params[2], params[3], params[4], params[5]);
			delete window.scope;
		}, 1000);
	});
}

function checkWidgetExists(id){
	return typeof document.getElementById(id) == "null" ? false : true;
}

function getSelectedRows(widgetId, onlyOneRow){
	var onlyOneRow = onlyOneRow ? true : false;
  var grid = null;
	getDijitWidgetById(widgetId, function(widget){
		grid = widget;
	});
	
	var selection = grid.selection.getSelected();
	if (onlyOneRow && selection.length > 1){
		// error message
		return;
	} else {
		return selection;
	} 
}

function destroyWidget(id){
	require(['dijit/registry'], function(registry){
		var widget = registry.byId(id);
		if (typeof widget != "undefined"){
			widget.show();
			widget.destroyRecursive();
		};
	});
};

function updateValues(id){
	require(['dijit/registry'], function(registry){
		var widget = registry.byId(id);
		if (typeof widget != "undefined"){
			widget.show();
			widget.destroyRecursive();
		};
	});
};

function setDefaultListSettings(widget){
	// TODO
}