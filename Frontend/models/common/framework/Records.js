function CH000S0W_COMM () {
	this.control_business_object = "";
	this.auth_level = "";
	this.auth_read = "";
	this.auth_update = "";
	this.auth_create = "";
	this.auth_delete = "";
};

function CH000S0W_COMMON () {
	this.control_locale_language = "";
	this.control_locale_region = "";
	this.control_commit_flag = "";
	this.control_debug_flag = "";
	this.control_timestamp = "";
	this.control_userid = "";
	this.control_application_name = "";
	this.control_function_name = "";
	this.control_sub_function = "";
	this.control_part_type = "";
	this.control_row_index = 0,
	this.control_error = "";
	this.control_information = "";
	this.errors_number = 0;
	this.errors = [];
	this.info_code = "";
	this.info_variable_1 = "";
	this.info_variable_2 = "";
	this.info_variable_3 = "";
};

function CH000SEW_SYS_ERROR () {
	this.program_name = "";
	this.function_name = "";
	this.err_sqlcode = 0;
	this.err_ezert8 = "";
};

function PROGRAM_RETURN_REC () {
	this.cindex_version_code = "";
	this.cindex_environment_code = "";
	this.errorCode = 0;
	this.username = "";
	this.password = ""; 

};
var ERRORS = (function(){
	this.location_field_name = "";
	this.location_business_object = "";
	this.location_part_type = "";
	this.location_row_index = 0;
	this.error = "";
	this.error_code = "";
	this.error_variable_1 = "";
	this.error_variable_2 = "";
	this.error_variable_3 = "";
	this.info_code = "";
	this.info_variable_1 = "";
	this.info_variable_2 = "";
	this.info_variable_3 = "";
});


var CH000S0W_COMM = (function(){
	this.control_business_object = "";
	this.auth_level = "";
	this.auth_read = "";
	this.auth_update = "";
	this.auth_create = "";
	this.auth_delete = "";
});

var CH000SEW_SYS_ERROR = (function(){
	this.program_name = "";
	this.function_name = "";
	this.err_sqlcode = 0;
	this.err_ezert8 = "";
});

var CH000S0W_COMM = (function(){
	this.control_business_object = "";
	this.auth_level = "";
	this.auth_read = "";
	this.auth_update = "";
	this.auth_create = "";
	this.auth_delete = "";
});

var CH000SEW_SYS_ERROR = (function(){
	this.program_name = "";
	this.function_name = "";
	this.err_sqlcode = 0;
	this.err_ezert8 = "";
});

var CH000S0W_ERRORS = (function(){
	this.location_field_name = "";
	this.location_business_object = "";
	this.location_part_type = "";
	this.location_row_index = 0;
	this.error_code = "";
	this.error_variable_1 = "";
	this.error_variable_2 = "";
	this.error_variable_3 = "";
	this.info_code = "";
	this.info_variable_1 = "";
	this.info_variable_2 = "";
	this.info_variable_3 = "";
});
