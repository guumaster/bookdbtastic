var mongoose = require("mongoose");
var mongoosastic=require("mongoosastic");

var bookSchema = new mongoose.Schema({
    title:  { type: String, es_indexed: true},
    author: String,
    description: { type:String, es_indexed:true },
    content: { type:String, es_indexed:true },
    createdAt: {type: Date, es_indexed:true, es_type: 'date'}
});

bookSchema.plugin(mongoosastic,{
    host:"localhost",
    port: 9200,
    protocol: "http" /*,
    bulk: {
      size:1000,
      delay: 10000
    },
    curlDebug: true
    */
});

module.exports = mongoose.model("Book", bookSchema);