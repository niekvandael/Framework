/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 *
 * Package    : refer.cur.list
 */
 
var EmployeeListModel = (function(){
	EmployeeListModel.prototype.constructor.call(this);
	
    this.KEY_BEGIN              = new EMPLOYEE();
    this.KEY_NEXT               = new EMPLOYEE();
    this.LIST                   = new EMPLOYEE_LIST();
    
    this.getNewKeyBegin = function(){
        return new EMPLOYEE;
    };
    
    this.getNewList = function(){
        return null;
    };
});

EmployeeListModel.prototype 	= Object.create(ListModel.prototype);
EmployeeListModel.prototype.constructor = ListModel;