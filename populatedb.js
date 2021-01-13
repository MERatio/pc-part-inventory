#! /usr/bin/env node

console.log(
  'This script populates some test categories and items to your database. Specified database as argument - e.g.: populatedb your_connection_string'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const async = require('async');
const Category = require('./models/category');
const Item = require('./models/item');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];
const items = [];

const categoryCreate = (name, description, cb) => {
  const categoryDetail = { name, description };
  const category = new Category(categoryDetail);
  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
};

const itemCreate = (name, description, category, price, stock, image, cb) => {
  const itemDetail = { name, description, category, price, stock, image };
  const item = new Item(itemDetail);
  item.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    cb(null, item);
  });
};

const createCategories = (cb) => {
  async.series(
    [
      (callback) => {
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
      (callback) => {
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
      (callback) => {
        categoryCreate(
          'Motherboard',
          `The motherboard is the main circuit board of your computer 
        and is also known as the mainboard or logic board. Basically, 
        the motherboard is what makes everything in your computer work together.`,
          callback
        );
      },
      (callback) => {
        categoryCreate(
          'Memory',
          `Computer memory is any physical device capable of storing 
        information temporarily, like RAM (random access memory), or permanently, 
        like ROM (read-only memory). Memory devices utilize integrated circuits 
        and are used by operating systems, software, and hardware.`,
          callback
        );
      },
      (callback) => {
        categoryCreate(
          'Storage',
          `Whereas memory refers to the location of short-term data, 
        storage is the component of your computer that allows you to store 
        and access data on a long-term basis. Usually, storage comes in the 
        form of a solid-state drive or a hard drive.`,
          callback
        );
      },
      (callback) => {
        categoryCreate(
          'Video Card',
          `A video card connects to the motherboard of a computer system 
        and generates output images to display. Video cards are also 
        referred to as graphics cards. Video cards include a processing unit, memory, 
        a cooling mechanism and connections to a display device.`,
          callback
        );
      },
      (callback) => {
        categoryCreate(
          'Power Supply',
          `Abbreviated as PS or P/S, a power supply or PSU (power supply unit) 
        is a hardware component of a computer that supplies all other components,
        with power.`,
          callback
        );
      },
      (callback) => {
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
};

const createItems = (cb) => {
  async.series(
    [
      (callback) => {
        itemCreate(
          'AMD Ryzen 5 3600',
          '# of CPU Cores: 6, # of Threads: 12, Base Clock: 3.6GHz, Max Boost Clock: 4.2GHz',
          categories[0],
          199.99,
          1902,
          'AMD Ryzen 5 3600.webp',
          callback
        );
      },
      (callback) => {
        itemCreate(
          'Intel Core i7-9700K',
          '# of CPU Cores: 8, # of Threads: 8, Base Clock: 4.60Hz, Max Boost Clock: 4.90 GHz',
          categories[0],
          269.0,
          2389,
          'Intel Core i7-9700K.jpeg',
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
};

async.series(
  [createCategories, createItems],
  // Optional callback
  (err, results) => {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('All done');
    }
    // All done, disconnect from database
    db.close();
  }
);
