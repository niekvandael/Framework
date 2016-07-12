/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 *
 * Package    : refer.cur.detail
 */
var EmployeeDetailModel = (function(){
	EmployeeDetailModel.prototype.constructor.call(this);
	
	this.DETAIL 				=  new EMPLOYEE();
	
	this.getEmptyModel = function(){
	    return new EMPLOYEE;
	};
});

EmployeeDetailModel.prototype 	= Object.create(DetailModel.prototype);
EmployeeDetailModel.prototype.constructor = DetailModel;