/**
 * CREATED BY NVD ON 1-apr.-2014 13:57:41
 *
 * Package    : core/widgets
 * Filename   : CustomMenuItem.js
 */

/**
 * Custom TitlePane (only difference is that the toggle function is disabled).
 */
require([
         "dojo/_base/declare", 
         "dojo/parser", 
         "dojo/ready",
         "dijit/_WidgetBase",
         "dijit/TitlePane"
     ], function(declare, parser, ready, _WidgetBase, titlePane){
         declare("custom.CustomMenuItem", [_WidgetBase, titlePane], {
             templatePath: "dojo/dijit/TitlePane.html",
        	 toggle: function(){},
        	 toggleable: this.toggleable
        });
});