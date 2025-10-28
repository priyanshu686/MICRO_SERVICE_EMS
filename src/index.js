// src/index.js
const fs = require('fs');
const path = require('path');

const controllers = {};

fs.readdirSync(path.join(__dirname, 'controller')).forEach(file => {
  if (file.endsWith('.js')) {
    Object.assign(controllers, require(`./controller/${file}`));
  }
});

module.exports = controllers;