

module.exports = {
  elastic: {
    host: process.env.ELASTICSEARCH_HOST || 'localhost',
    port: '9200'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/books'
  }

};
