/**
 * Add polyfill for a Promise object
 */
const Promise = require('promise-polyfill');

window.Promise = window.Promise || Promise;
