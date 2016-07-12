/**
 * CREATED BY GENERATOR ON 2015/05/04 12:39:53 @ v 4.0
 *
 * Package    : refer.cur.detail
 */
var ProductDetailModel = (function(){
	ProductDetailModel.prototype.constructor.call(this);
	
	this.DETAIL 				=  new PRODUCT();
	
	this.getEmptyModel = function(){
	    return new PRODUCT;
	};
});

ProductDetailModel.prototype 	= Object.create(DetailModel.prototype);
ProductDetailModel.prototype.constructor = DetailModel;