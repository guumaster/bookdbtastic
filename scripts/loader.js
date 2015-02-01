var faker = require('faker');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var coder = require('country-data').lookup;
var args = require('yargs').argv;

var TOTAL_BOOKS = args.books || 10;
var EMPTY_COLLECTION = args.empty !== undefined;

mongoose.connect('mongodb://localhost:27017/books');

var Book = require('../books');

Book.createMapping(function (err, mapping) {
    console.log('mapping created');
});

var book_count = 0;
var total = 0;

async.series({
    empty: function(next) {

        if( !EMPTY_COLLECTION ) {
            return next();
        }
        console.log('Droping documents');
        Book.remove({}, next);
    },
    count: function (next) {
        Book.count({}, function (err, initial) {
            console.log('Starting from ', initial);
            total = initial;
            next();
        });
    },
    insert: function (next) {

        async.whilst(
            function () {
                return book_count < TOTAL_BOOKS;
            },
            function (callback) {
                book_count++;
                if (book_count % 1000 === 0) {
                    console.log('Inserted: ', book_count);
                }
                var country = faker.address.country();
                var countryCode = (coder.countries({name: country})[0] || {}).alpha2;
                var book = {
                    //idx: (total+book_count),
                    title: faker.company.catchPhrase(),
                    author: faker.name.findName(),
                    description: faker.lorem.sentence(),
                    content: faker.lorem.sentences(),
                    country: country,
                    countryCode: countryCode,
                    rank: (_.random(10,50)/10).toFixed(2),
                    price: (_.random(5,500)/10).toFixed(2),
                    tags: _.map(_.range(_.random(0, 10)), faker.hacker.verb),
                    createdAt: faker.date.past()
                };
                var book = Book.create(book, function (err, doc) {
                    doc.on('es-indexed', function (err, res) {
                        if (err) return callback(err);
                        callback();
                    });
                });
            },
            function (err) {
                console.log('Total inserted: ', TOTAL_BOOKS);
                next();
            }
        );

    }
}, function (err, res) {
    mongoose.connection.close();
    process.exit();
});



