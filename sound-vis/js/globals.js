// these variables are shared by timelapse.js and visualizer.js

var NUM_BINS = 25; // Array of frequencies has 128 bins. Most of them are not used
var MAX_VOLUME_PER_BIN = 150; // used to calculate volume ration. Assumes no volume in a bin is over this number

// scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// camera attributes
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 0.1;
var FAR = 10000;

var timeLapse = []; // holds objects of type {color, height}. Used to construct the timelapse view
