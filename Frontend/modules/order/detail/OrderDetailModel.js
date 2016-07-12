/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 *
 * Package    : refer.cur.detail
 */
var OrderDetailModel = (function(){
	OrderDetailModel.prototype.constructor.call(this);
	
	this.DETAIL 				=  new ORDER();
	
	this.getEmptyModel = function(){
	    return new ORDER;
	};
});

OrderDetailModel.prototype 	= Object.create(DetailModel.prototype);
OrderDetailModel.prototype.constructor = DetailModel;