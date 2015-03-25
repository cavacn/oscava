var Class = function(){
	
}

Class.extends = function(sub){
	var fn = function(){
		if(this.$){
			this.$.apply(this,arguments);
		}
	}
	fn.prototype = new this;
	for(var key in sub){
		fn.prototype[key] = sub[key];
	}
	fn.extends = this.extends;
	return fn;
}

module.exports = exports = Class;
