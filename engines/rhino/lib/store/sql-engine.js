/**
 * This is an SQL store for Rhino
 */
var extendForEach = require("util/lazy").extendForEach;
var drivers = {
	mysql: "com.mysql.jdbc.Driver",
	sqlite: "org.sqlite.JDBC",
	derby: "org.apache.derby.jdbc.EmbeddedDriver",
	hsqldb: "org.hsqldb.jdbcDriver",
	oracle: "oracle.jdbc.driver.OracleDriver",
	postgres: "org.postgresql.Driver"
}
exports.SQLStore = function(parameters){
	var adapter = new org.persvr.store.SQLStore();
	if(drivers[parameters.type]){
		parameters.driver = drivers[parameters.type]; 
	}
	adapter.initParameters(parameters);
	return {
		startTransaction: function(){
			adapter.startTransaction();
		},
		get: function(id){
			return adapter.mapObject(id);
		},
		put: function(object, id){
			try{
				id = id || object[parameters.idColumn];
				if(id === undefined){
					throw "Not Found";
				}
				adapter.mapObject(id);
			}
			catch(e){
				return adapter.recordNewObject(object);
			}
			adapter.recordUpdate(id, object);
			
			return object;
		},
		executeSql: function(query, options){
			return extendForEach(adapter.query(query, options));			
		},
		"delete": function(id){
			adapter.recordDelete(id);
		},
		commitTransaction: function(){
			adapter.commitTransaction();
		},
		abortTransaction: function(){
			adapter.abortTransaction();
		}
	}
}

