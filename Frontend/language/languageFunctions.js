/**
 * CREATED BY Niek Vandael ON 7 apr. 2014 14:02:21
 * 
 * Package : language Filename : languageFunctions.js
 */
window.LANGUAGEFUNCTIONS = {};
window.LANGUAGEFUNCTIONS.messages = {
		'EGL0504E': 'Action failed due to database restrictions',
		'SQL+00100': 'Row not found - Check Key fields', 
		'SQL-00180': 'Invalid datetime format', 
		'SQL-00181': 'Datetime value out of range', 
		'SQL-00407': 'Assignment of a NULL value to a NOT NULL column is not allowed', 
		'SQL-00530': '{0} {1} failed: invalid foreign-key', 
		'SQL-00531': 'Cannot Update Row - Dependent Row(s) exist', 
		'SQL-00532': 'Cannot Delete Row - Dependent Row(s) exist', 
		'SQL-00551': 'You are not authorized for the selected action', 
		'SQL-00552': 'You are not authorized for the selected action', 
		'SQL-00629': '{0} {1} failed: invalid foreign-key', 
		'SQL-00803': '{0} {1} would produce duplicate rows', 
		'SQL-00811': '{0} {1} failed: multiple rows found but only one was expected', 
		'SQL-01006': 'Application and database code pages do not match', 
		'SQL-01032': 'No start database manager command was issued', 
		'ROW NOT ACC': 'Cannot {0} row: Read it again', 
		'INV PF KEY': 'Invalid PF Key', 
		'INV ACTION': 'Invalid Action', 
		'NO CHANGES': 'No changes made', 
		'BLANK KEY': 'Key cannot be blank', 
		'READ FIRST': 'Key Changed - Record must be refreshed', 
		'< MIN VALUE': '{0} must be >= {1}', 
		'> MAX VALUE': '{0} must be <= {1}', 
		'CALL FAILED': 'Call to {0} failed {1} {2}', 
		'I/O OK': '{0} Successful', 
		'INV OPTION': 'Invalid Option', 
		'UPDATE OTHER': '{0} {1} by another person - {2} again', 
		'NOT IN TABLE': '{0}: not in value table', 
		'NOT IN INTVL': '{0}: value must be between {1} and {2}', 
		'BAD FORMAT': '{0}: value format is not valid', 
		'REQ FIELD': '{0} value is required', 
		'NO DATA': 'No data found for specified search criteria', 
		'NO FK': 'Invalid {0}: {1} not found in table {2}', 
		'UNKNOWN ERR': 'Unexpected error occurred', 
		'SQL WNG': 'Unexpected SQL warning: {0}', 
		'END OF DATA': 'End of data', 
		'DATA ERROR': 'Data error: contact your System Administrator', 
		'TOP OF DATA': 'Top of data', 
		'INV FASTPATH': 'Invalid Fastpath entered', 
		'OVERFLOW': 'Stack Overflow: the stack is reinitialized', 
		'NAVG+UPDT': 'Navigation and Action on data at the same time', 
		'UPDT+NAVG': 'Action on data and Navigation at the same time', 
		'ROW NOT EXT': 'Delete failed: Row \'{0}\' does not exist', 
		'DETAIL ERR': 'The Format of one or several field(s) is invalid', 
		'CREA SUCC': 'Create Succeeded', 
		'READ SUCC': 'Read Succeeded', 
		'UPDT SUCC': 'Update Succeeded', 
		'DEL SUCC': 'Delete Succeeded', 
		'CHK SUCC': 'Check Succeeded', 
		'EXT SUCC': 'Extraction Succeeded', 
		'REFR SUCC': 'Refresh Succeeded', 
		'SUBM SUCC': 'Submit Succeeded', 
		'DEL QUES': 'Do you want to delete ?', 
		'ALREADY EXIST': 'Instance already exists', 
		'NOT FOUND': 'Instance not found', 
		'LOGICAL DELETED': 'Row has been marked for deletion', 
};

// Functions
LANGUAGEFUNCTIONS.getErrorMessage = function(constraints) {
	var message = LANGUAGE.DECIMAL_ERROR_MESSAGE;
	var numbers = "123456789012345678901234567890";
	var maxDecimalPlaces = constraints.places.split(',')[1];
	if(maxDecimalPlaces == undefined){
	    maxDecimalPlaces = 0;
	}
	var maxLength = String(constraints.max).length;

	var example_absolutes = numbers.substring(0, maxLength);
	var example_decimals = numbers.substring(0, maxDecimalPlaces);
	var example = example_absolutes + "." + example_decimals;

	require([ "dojo/number" ], function(number) {
		example = number.format(example, {
			places : constraints.places
		});

	});

	message = message.replace("{0}", maxDecimalPlaces);
	message = message.replace("{1}", example);
	return message;
};

LANGUAGEFUNCTIONS.getRangeMessage = function(constraints) {
	var message = LANGUAGE.ERROR_FIELD_RANGE;
	var minimum = '';
	var maximum = '';
	
	require([ "dojo/number" ], function(number) {
		minimum = constraints.min;
		maximum = constraints.max;
		
		minimum = number.format(minimum, {});
		maximum = number.format(maximum, {});
	});

	message = message.replace("{0}", minimum);
	message = message.replace("{1}", maximum);
	
	return message;
};

LANGUAGEFUNCTIONS.getSpecialErrorMessage = function(error, errorObject){
	if(error == ""){
		console.log(errorObject.error);
		var error = errorObject.error.split(" ")[0];
	}
	
	if(window.LANGUAGEFUNCTIONS.messages[error.trim()] === undefined){
		return error;
	}
	
	var message = window.LANGUAGEFUNCTIONS.messages[error.trim()];
	message = message.replace("{0}", errorObject.error_variable_1);
	message = message.replace("{1}", errorObject.error_variable_2);
	message = message.replace("{2}", errorObject.error_variable_3);
	
	return message;
};

LANGUAGEFUNCTIONS.genericMessage = function(error, errorObject){
	var message = error;
	for (var i = 0; i < errorObject.length; i++){
		message = message.replace("{"+i+"}", errorObject[i]);
	}
	return message;
};