/*
	Welcome to visit www.oscava.com  or www.cavacn.com
	Author:		cava.zhang
	Email:		admin@cavacn.com
	Date:		2015-03-12 23:43:47
*/

var Class = require("./class");
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var OsCava = function(){
	this._maps = {};
    this._models = {};
    this._controllers = {};
    global.OSC = this;
}

OsCava.Class = Class;
/*
    set SomeThing into OsCava
*/
OsCava.prototype.set = function(key,value){
	this._maps[key] = value;
}
/*
    get SomeThing form OsCava
*/
OsCava.prototype.get = function(key){
	return this._maps[key];
}
/*
    create new model or get model by name
*/
OsCava.prototype.model = function(name,struct,conn){
	if(1 == arguments.length){
        if(this.get("path")){
            require(this.get("path")+"/models/"+name+"Model");
        }
        return this._models[name];
    }else{
        if(!conn){
            if(!this.defaultconn){
                this.defaultconn = Mongoose.createConnection(this.get("mongodb")||"");
            }
            conn = this.defaultconn;
        }
        var db = conn.model(name,new Schema(struct));
        var oClass = Class.extends({
            db:db,
            schema:struct,
            $:function(obj){
                if(!obj)obj={};
                for(var key in this.schema){
                    this[key] = obj[key];
                }
                this._id = obj.id||obj._id;
            },
            save:function(cb){
                var db = new this.db();
                for(var key in this.schema){
                    db[key] = this[key];
                }
                db.save(cb);
            }
        });
        
        oClass.db = db;
        oClass.schema = struct;
        oClass.model = name;
        this._models[name] = oClass;
        return oClass;
    }
}
/*
    create new controller or get controller by name
*/
OsCava.prototype.controller = function(name,cls){
    if(1==arguments.length){
        return this._controllers[name];
    }else{
        this._controllers[name] = cls;
    }
}
/*
    oscava the dispenser,distribution the message
*/
OsCava.prototype.dispenser = function(controllername,method){
    var controller = this._controllers[controllername];
    if(controller){
        var fn = controller[method];
        return fn;
    }
    if(this.get("path")){
        try{
            require(this.get("path")+"/controllers/"+controllername+"Controller");
            return this.dispenser(controllername,method);
        }catch(e){
            console.error(e);
            return function(){
				console.error("%s : %s not found",controllername,method);
			};
        }
    }
    return function(){
		console.error("%s : %s not found",controllername,method);
	};
}

module.exports = exports = OsCava;