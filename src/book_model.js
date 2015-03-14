var mongoose = require("mongoose");
var mongoosastic = require("mongoosastic");

var config = require('./config');

var bookSchema = new mongoose.Schema({
  title: {type: String, es_indexed: true},
  author: {
    type: String,
    es_indexed: true,
    es_type: 'multi_field',
    es_fields: {
      "author": {type: 'string'},
      "raw": {type: 'string', index: 'not_analyzed'}
    }
  },
  description: {type: String, es_indexed: true},
  content: {type: String, es_indexed: true},
  country: {
    type: String,
    es_indexed: true,
    es_index: 'not_analyzed'
  },
  tags: {
    type: Array,
    es_type: 'string',
    es_indexed: true,
    es_index: 'not_analyzed',
    es_index_name: 'tag'
  },
  rank: {
    type: Number,
    es_indexed: true,
    es_type: 'float'
  },
  price: {
    type: Number,
    es_indexed: true,
    es_type: 'float'
  },
  countryCode: {
    type: String,
    es_indexed: true,
    es_index: 'not_analyzed',
    es_null_value: ''
  },
  year: {type: Number, es_indexed: true},
  createdAt: {type: Date, es_indexed: true, es_type: 'date'}
});

bookSchema.plugin(mongoosastic, {
  host: config.elastic.host,
  port: config.elastic.port,
  protocol: "http" /*,
   bulk: {
   size:1000,
   delay: 10000
   },
   curlDebug: true
   */
});

module.exports = mongoose.model("Book", bookSchema);
