/**
 * CREATED BY NVD ON 22 sep. 2014 13:33:08

 * Package    : js
 * Filename   : shortcuts.js
*/

"use strict";

function setShortcuts() {
	require([ "dojo/on", "dojo/domReady!" ], function(on) {
		on(window, "keydown", function(event) {
			if ((event.ctrlKey) && event.keyCode == 83) {
				// CTRL + S
				getDijitWidgetById("saveButton", function(btn) {
					btn.onClick();
					event.preventDefault();
				});
			}

			if (event.altKey && event.keyCode == 78) {
				// ALT + N
				getDijitWidgetById("newButton", function(btn) {
					btn.onClick();
					event.preventDefault();
				});
			}

			if (event.altKey && event.keyCode == 68) {
				// ALT + D
				getDijitWidgetById("deleteButton", function(btn) {
					btn.onClick();
					event.preventDefault();
				});
			}
			
			if (event.altKey && event.keyCode == 83) {
				// ALT + S
				getDijitWidgetById("searchButton", function(btn) {
					btn.onClick();
					event.preventDefault();
				});
			}
			if ((event.altKey) && event.keyCode == 82) {
				// ALT + R
				getDijitWidgetById("resetButton", function(btn) {
					btn.onClick();
					event.preventDefault();
				});
			}
			
			if ((event.altKey) && event.keyCode == 84) {
				// ALT + T
				getDijitWidgetById("saveSettingsButton", function(btn) {
					btn.onClick();
					event.preventDefault();
				});
			}
			
			if ((event.altKey) && (event.keyCode == 48 || event.keyCode == 96)) {
				// ALT + 0
				getDijitWidgetById(mainTabContainer, function(widget){
					widget.focus();
				});
				event.preventDefault();
			}
			
		});
	});
};