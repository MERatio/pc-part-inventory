#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database. Specified database as argument - e.g.: populatedb your_connection_string'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
// var async = require('async');
// var Book = require('./models/book');
// var Author = require('./models/author');
// var Genre = require('./models/genre');
// var BookInstance = require('./models/bookinstance');

var async = require('async');
var Category = require('./models/category');
var Item = require('./models/item');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
  var categoryDetail = { name, description };
  var category = new Category(categoryDetail);
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, category, price, stock, cb) {
  var itemDetail = { name, description, category, price, stock };
  var item = new Item(itemDetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'CPU',
          `The CPU (Central Processing Unit) is the part of a 
        computer system that is commonly referred to as the "brains" 
        of a computer. The CPU is also known as the processor or 
        microprocessor. The CPU is responsible for executing a sequence 
        of stored instructions called a program.`,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'CPU cooler',
          `A CPU cooler is device designed to draw heat away from the 
        system CPU and other components in the enclosure. Using a 
        CPU cooler to lower CPU temperatures improves efficiency and 
        stability of the system. Adding a cooling device, however, 
        can increase the overall noise level of the system.`,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Motherboard',
          `The motherboard is the main circuit board of your computer 
        and is also known as the mainboard or logic board. Basically, 
        the motherboard is what makes everything in your computer work together.`,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Memory',
          `Computer memory is any physical device capable of storing 
        information temporarily, like RAM (random access memory), or permanently, 
        like ROM (read-only memory). Memory devices utilize integrated circuits 
        and are used by operating systems, software, and hardware.`,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Storage',
          `Whereas memory refers to the location of short-term data, 
        storage is the component of your computer that allows you to store 
        and access data on a long-term basis. Usually, storage comes in the 
        form of a solid-state drive or a hard drive.`,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Video Card',
          `A video card connects to the motherboard of a computer system 
        and generates output images to display. Video cards are also 
        referred to as graphics cards. Video cards include a processing unit, memory, 
        a cooling mechanism and connections to a display device.`,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Power Supply',
          `Abbreviated as PS or P/S, a power supply or PSU (power supply unit) 
        is a hardware component of a computer that supplies all other components,
        with power.`,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Case',
          `A computer case, also known as a computer chassis, tower, system unit, 
        or cabinet, is the enclosure that contains most of the components of a 
        personal computer (usually excluding the display, keyboard, and mouse).`,
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

function createItems(cb) {
  async.series(
    [
      function (callback) {
        itemCreate(
          'AMD Ryzen 5 3600',
          '# of CPU Cores: 6, # of Threads: 12, Base Clock: 3.6GHz, Max Boost Clock: 4.2GHz',
          categories[0],
          199.99,
          1902,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Intel Core i7-9700K',
          '# of CPU Cores: 8, # of Threads: 8, Base Clock: 4.60Hz, Max Boost Clock: 4.90 GHz',
          categories[0],
          269.0,
          2389,
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('All done');
    }
    // All done, disconnect from database
    db.close();
  }
);
