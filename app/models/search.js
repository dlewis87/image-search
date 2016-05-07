'use strict';

var mongoose = require('mongoose');

var searchSchema = mongoose.Schema({
    term: String,
    when: Date
});


module.exports = mongoose.model('Search', searchSchema);