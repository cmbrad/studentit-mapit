/* exported ResourceMap */
var ResourceMap = function(loc) {
	'use strict';

	// Radius of the circle to draw resources as
	var RESOURCE_SIZE        = 10;
	// Width of the border around resources
	var RESOURCE_STROKE_SIZE =  3;

	// Colour to draw resource when it's in a particular state
	var _stateColour = {
		'':              '#4FC3F7',	// Blue
		'AVAILABLE':     '#81C784',	// Green
		'IN_USE':        '#E57373',	// Red
		'RESERVED':      '#E57373',	// Red
		'NOT_AVAILABLE': '#000000',	// Black
	};

	// Resource border colours
	var RESOURCE_STROKE_COLOUR = '#000000';
	var SELECTED_RESOURCE_STROKE_COLOUR = '#ff0000';

	// Map image storage location
	var MAP_BACKGROUND_BASE_URL = 'http://files.cy.id.au/maps/';

	// Use animFrames in browers that support them to draw the map.
	// It saves power and it smoother than using a setInterval
	this._animFrame = null;

	// Although our resource display is dynamic, the level background
	// is a static image.
	this._background = null;

	// Canvas we draw the map on to
	this._c = null;

	// Context belonging to that canvas
	this._ctx = null;

	// Container div which we draw the canvas in to
	this._map = null;

	// Width and height of the container
	this._w = null;
	this._h = null;

	// Data about which resources belong on which levels
	// and their site. ie Available/In Use/etc
	this._mapInfo = null;

	// The last resource to be selected (aka the currently selected resource)
	// (naming things is hard)
	this._lastSelected = null;

	// Rate at which the canvas zooms in and out
	this.scale = 1.1;

	// Keep a reference to this so it can be used inside functions
	// where this is not a reference to ResourceMap.
	var that = this;

	/**
	 * Initializes the map by creating the canvas in a div with an
	 * id of 'map' and setting the level to be the first level contained
	 * in the given map data. The draw loop is also set up, using animation
	 * frames if they're available.
	 * @param {String} loc
	 */
	this._initialize = function(loc) {
		// Get a reference to an animation frame. Try and cover
		// all the browser specific edge cases.
		this._animFrame = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			null;

		// Although it may be changed later, we want to set up
		// the map with an initial location. No point displaying
		// an empty map..
		this.setLocation(loc);

		// The page where this script is used needs to have a div
		// with the id of 'map' - this is where the map will be placed
		var map = document.getElementById('map');
		this._map = map;
		// The div might contain placeholder items, clear them so the map
		// can display the full size of the div
		this._map.innerHTML = '';

		// Create the canvas that the map will draw on
		this._createMap();

		// TODO: Implement falling back to setInterval on browsers
		// which do not support animation frame.
		if (!this._animFrame) {
			console.log('Oh no :(');
		} else {
			this._animFrame.call(window, this._recursiveAnim);
		}
	};

	/**
	 * The map can only display a single location at a time ie Baillieu or
	 * ERC. Once that location is set the user can then change between levels
	 * at that location. This restriction exists as we only download data
	 * for one location at a time.
	 * @param {String} loc
	 */
	this.setLocation = function(loc) {
		if (!this._map) {
			console.log('Cannot set location while map is undefined.');
			return;
		}
		this.location = loc;
		this._lastSelected = null;
		this._clearBackground();
	};

	/**
	 * Create the canvas element which is used to display the map.
	 * Also add this element to the page so it can be displayed.
	 */
	this._createMap = function() {
		// Displaying the map using fancy html5 canvas'
		var canvas = document.createElement('canvas');
		canvas.id = 'map_canvas';

		// Add the canvas to the page so it can be displayed
		this._map.appendChild(canvas);

		// Setup references to the canvas and its' context
		// so it can be drawn to later
		this._c   = canvas;
		this._ctx = canvas.getContext('2d');

		// The canvas strangely doesn't include a way to 
		// properly manage transforms..so set that up here
		// using a custom method.
		/* global trackTransforms */
		trackTransforms(this._ctx);

		// Resize the canvas to consume the whole parent div
		this.resizeCanvas();
	};

	/**
	 * Helper function used to create resource layouts for maps.
	 * Changes the location of an object in our local data
	 * and then print out the full configuration to the console.
	 * TODO: Refactor out into a separate script and find a way
	 * to save the data besides copying from the console.
	 * @param {String} name
	 * @param {Number} x
	 * @param {Number} y
	 */
	this.moveResource = function(name, x, y) {
		// Given resource names can have pesky new line characters. Remove them
		// as they're not actually part of the saved names.
		name = name.trim();

		// Convert the screen coordinates to map coordinates so changing
		// positions still works when the map is zoomed and translated.
		var t = this._ctx.transformedPoint(x, y);

		// Change the info in our data store.
		this._mapInfo.resources[name].x = t.x;
		this._mapInfo.resources[name].y = t.y;

		// Print new map resource file to the console so it can be saved manually
		this.saveResourceFile();
	};

	/**
	 * Print map resource file to the console so it can be saved and then
	 * uploaded to the server manually. It contains all level information
	 * and resource location information which is used to display the map.
	 */
	this.saveResourceFile = function() {
		// Output hash which will reflect the structure of the output
		// map file.
		var out = {};

		// The information and levels format is the same in memory
		// and in the data file, just copy it over
		out.info      = this._mapInfo.info;
		out.levels    = this._mapInfo.levels;
		out.resources = {};
		
		// In memory resources contain extra state data.
		// We don't want to save that as it's transient
		// so strip that out here.
		var resources = this._mapInfo.resources;
		for (var name in resources) {
			var resource       = resources[name];
			out.resources[name] = {
				'level': resource.level,
				'x':     resource.x,
				'y':     resource.y

			};
		}

		// Pretty print the JSON with 4 spaces so it's easier
		// to edit by hand.
		var json = JSON.stringify(out, null, 4);
		// TODO: Find a better method of saving...
		// Probably a custom API call.
		console.log(json);
	};

	/**
	 * Centers the map on a selected resource to make it easier to spot,
	 * and highlights the border.
	 * @param {String} name
	 */
	this.centerOnResource = function(name) {
		// Names retrieved from the dom seem to have strange
		// characters attached sometimes..trim them
		name = name.trim();
		// Check whether we've loaded any level information. If the API goes down then
		// we might not have any.
		if (!this._mapInfo) {
			console.log('ERROR: No information available for this location. [' + this.location + '].');
			return;
		}
		// Check if the resource has any data. The level and map location data is updated separately
		// to the bookit server data so sometimes there may be descrepencies in the data
		// between both systems.
		if (!this._mapInfo.resources.hasOwnProperty(name)) {
			console.log('ERROR: Resource [' + name + '] is unknown.');
			return;
		}

		// The resource might not have any level data for similar reasons to it not having any data.
		var resInfo = this._mapInfo.resources[name];
		if (!this._mapInfo.levels.hasOwnProperty(resInfo.level)) {
			console.log('ERROR: No information available for level [' + resInfo.level + '].');
			return;
		}

		// Only want to have one resource selected at a time. We're trying to select a new
		// one now so deselect the old one if there was one selected.
		if (this._lastSelected) {
			this._mapInfo.resources[this._lastSelected].selected = false;
		}
		// Store the newly selected resource so it can also be deselected later
		this._lastSelected = name;

		// Store the fact that this new resource is selected.
		this._mapInfo.resources[name].selected = true;

		// The map may be displaying a different level to the one on which the resource is located.
		// Display the level on which the resource is located.
		this.setLevel(resInfo.level);
	};

	/**
	 * Map data contains level information (what levels exist
	 * for a given location), resource name data, and resource
	 * location data. We need all of this to actually display
	 * the map. Save a reference to it so it can be accessed later
	 * @param {Object} mapData
	 */
	this.setMapData = function(mapData) {
		this._mapInfo = mapData;
	};

	/**
	 * All locations have different levels/floors with resources on them.
	 * Can only display one level at a time in order to keep map legibility.
	 * Set that level here.
	 * @param {String} name
	 */
	this.setLevel = function(index) {
		// Retrieve the level data associated with the given name.
		var level = this._mapInfo.levels[index];

		// Store a reference to the index of the level we're on
		this._level = String(index);

		// All resources must go and the background has
		// changed. Remove it all!
		this._clearCanvas();

		// Get the new background! Coloured dots alone
		// aren't all that helpful...
		// Note that set background is asynchronous
		this._setBackground(level.filename);
	};

	/**
	 * Resource state can change over time as they go in and out of use.
	 * Use this function to update the state of all resources so it can
	 * change without reloading the map.
	 * @param {Object} resources
	 */
	this.resourceUpdate = function(resources) {
		// If the map doesn't contain any resources (probably due to an error)
		// then don't update anything.
		if (!this._mapInfo || !this._mapInfo.resources || this._mapInfo.resources.length === 0) {
			return;
		}

		// Update the resource state of all supplied resources.
		for (var r in resources) {
			var resource = resources[r];

			if (resource.name in this._mapInfo.resources) {
				this._mapInfo.resources[resource.name].state = resource.state;
			} else {
				console.log('Could not update resource [' + resource.name + '] as it does not exist.');
			}
		}
	};

	/**
	 * Having data is nice, but seeing the data is even nicer! Draw a resource
	 * to the screen as a coloured circle, with the colour representing its'
	 * availability. Green=Available. Red=Unavailable. Black=Faulty.
	 * @param {Object} resource
	 */
	this._drawResource = function(resource) {
		// Don't allow resource drawing outside of the map.
		// The edge is fine though since it can be zoomed out.
		if (resource.x <= 0 || resource.y <= 0 || resource.level !== that._level) {
			return;
		}

		// Inside the animation frame we can't use this to access the context
		// anymore. Use that instead! (We stored a reference to this earlier)
		var ctx = that._ctx;

		// Resource colour depends on state
		ctx.fillStyle = _stateColour[resource.state];
		ctx.beginPath();
		// Our resource indicator is a circle
		ctx.arc(resource.x, resource.y, RESOURCE_SIZE, 0, 2 * Math.PI, false);
		ctx.fill();

		// Display selected resources with a different coloured border.
		if (resource.selected) {
			ctx.strokeStyle = SELECTED_RESOURCE_STROKE_COLOUR;
		} else {
			ctx.strokeStyle = RESOURCE_STROKE_COLOUR;
		}

		// Draw the resource border
		ctx.lineWidth = RESOURCE_STROKE_SIZE;
		ctx.stroke();
	};

	/**
	 * We want the map to initially be zoomed in to match the parent div
	 * in at width or height, whatever is smaller. Also center the map
	 * in the div.
	 */
	this._scaleToScreen = function() {
		// The background is what determines the size of the map, can't scale
		// if we don't have a background
		if (this._background && this._background.width !== 0 && this._background.height !== 0) {
			// Ratios between the size of the parent div and the size of the background
			var wScale = this._w / this._background.width;
			var hScale = this._h / this._background.height;

			// We don't want to overfit the map so use the smaller
			// ratio to scale
			var iScale = wScale < hScale ? wScale : hScale;

			// Amounts to translate the map so it's centered in the parent div.
			var transX = 0;
			var transY = 0;

			// Only need to translate along either the X or Y axis.
			// We translate along where there's gaps.
			if (wScale > hScale) {
				transX = Math.abs((this._w - (hScale * this._background.width)) / 2);
			} else {
				transY = Math.abs((this._h - (wScale * this._background.height)) / 2);
			}

			// Remove all previous zooms and translations, we're settings new ones.
			this._ctx.clearTransform();
			// Set the initial transform to be...well...not transformed
			this._ctx.setTransform(1,0,0,1,0,0);
			// translate to center the map
			this._ctx.translate(transX, transY);
			// zoom to fill the parent.
			this._ctx.scale(iScale, iScale);
		}
	};

	/**
	 * Although resources are dynamic, the background of the map is always
	 * a static image. The background will depend on the level and thus
	 * the filename is downloaded with the map data.
	 * @param {String} filename
	 */
	this._setBackground = function(filename) {
		// Notify our parent that we're trying to load a new map
		var event = new CustomEvent('map-loading', {});
		that._map.dispatchEvent(event);

		// Url from which to load the background
		var path = MAP_BACKGROUND_BASE_URL + filename;
		// Our background is just an image! Attempt to load it.
		this._background = new Image();
		this._background.src = path;

		// Loading is asynchronous. After it's loaded then
		// scale the map to match the background size.
		this._background.onload = function() {
			that._scaleToScreen();
			
			// Inside callbacks we need to use that not this
			// since this means something else.
			var event = new CustomEvent('map-loaded', {});
			that._map.dispatchEvent(event);
		};
	};

	/**
	 * Sets the loaded background to null which stops it
	 * being drawn.
	 */
	this._clearBackground = function() {
		this._background = null;
	};

	/**
	 * Draw the background set earlier to _background
	 * to the canvas. If there is no background then just do
	 * nothing.
	 */
	this._drawBackground = function() {
		if (!this._background) {
			return;
		}
		this._ctx.drawImage(this._background,
		                                   0,
		                                   0,
		              this._background.width,
		            this._background.height);
	};

	/**
	 * Called when the parent div the canvas is house in is
	 * resized. This will then resize the canvas so it's not
	 * too big or too small. Not that this will reset all
	 * zoom and translation transformations.
	 */ 
	this.resizeCanvas = function() {
		// Update the stored width and height of the parent
		this._w = this._c.width = this._map.offsetWidth;
		this._h = this._c.height = this._map.offsetHeight;

		// Resize the canvas to match the parent
		this._scaleToScreen();
	};

	/**
	 * Clear the canvas so we don't get ghosting when dragging
	 * the map around. Well that or we just like the colour grey?
	 */
	this._clearCanvas = function() {
		// Don't want to lose our zooms/translations. Save them.
		this._ctx.save();
		// Need to do this as well otherwise we get ghosting
		this._ctx.setTransform(1,0,0,1,0,0);
		this._ctx.clearRect(0,0,this._c.width, this._c.height);
		// Restore our transformations
		this._ctx.restore();
	};

	/**
	 * Draw the map to the screen. Kinda the whole point of this
	 * whole file really. Uses animation frame to keep smooth
	 * frames.
	 */
	this._drawMap = function() {
		// Clear the canvas to prevent ghosting when transforming
		that._clearCanvas();
		// Important to save and then later restore our transformation
		// state, otherwise transforms end up stacking upon each other
		// which is bad.
		that._ctx.save();

		// Draw the background before drawing resources. Z
		// order is important!
		that._drawBackground();

		// Only draw resources if we have information
		// about where on the map they should go, and if
		// we are currently displaying a background.
		// Dots on an empty page look stupid.
		if (that._mapInfo && that._background) {
			var resources = that._mapInfo.resources;
			for (var name in resources) {
				var resource = resources[name];
				that._drawResource(resource);
			}
		}

		// stop transform stacking
		that._ctx.restore();
	};

	/**
	 * Recursive function used by animation frame to draw the map
	 */
	this._recursiveAnim = function() {
		that._drawMap();

		if (!that._animFrame) {
			console.log('AnimFrame is null. Falling back to setInterval');
		} else {
			that._animFrame.call(window, that._recursiveAnim);
		}
	};

	/**
	 * Zoom in on specific coordinates with a given factor.
	 * Best to use small f values otherwise the map will be way to
	 * small or large to be of use.
	 */
	this.setZoom = function(x,y,f) {
		// Zoom position needs to account for scaling
		// and translations.
		var t = this._ctx.transformedPoint(x, y);
		// Zoom in exponentially otherwise
		// it just feels bad.
		var factor = Math.pow(this.scale, f);

		// Trick to zoom in on a point is to
		// translate the map, zoom the map,
		// then translate it back. Magic.
		this._ctx.translate(t.x, t.y);
		this._ctx.scale(factor, factor);
		this._ctx.translate(-t.x, -t.y);
	};

	/**
	 * Translation works using delta positions. Save the start
	 * point as a frame of reference. Used in dragging the map.
	 * Note x and y are screen not canvas coordinates.
	 */
	this.startMove = function(x, y) {
		this._lastPos = this._screenToCanvasPos(x, y);
	};

	/**
	 * Continue translating the map along from its' start point.
	 * Note x and y are screen not canvas coordinates.
	 */
	this.doMove = function(x, y) {
		// The canvas might not be in the top left. Take that into
		// account.
		var pos = this._screenToCanvasPos(x, y);

		if (this._lastPos) {
			this._ctx.translate(pos.x - this._lastPos.x, pos.y - this._lastPos.y);
		}
	};

	/**
	 * Moving is over!
	 */
	this.endMove = function() {
		// reset last pos so we don't get strange jumps if doMove is somehow called.
		this._lastPos= null;
	};

	/**
	 * Convert screen coordinates to canvas coordinates. Note this also takes
	 * transformations into account like scaling and translation, as well as 
	 * the canvas being offset from the top left.
	 */
	this._screenToCanvasPos = function(x, y) {
		var rect = this._c.getBoundingClientRect();

		return this._ctx.transformedPoint(
			((x-rect.left)/(rect.right-rect.left)*this._c.width),
			((y-rect.top)/(rect.bottom-rect.top)*this._c.height)
		);
	};

	// loc is part of the ResourceMap...constructor?
	this._initialize(loc);
};
