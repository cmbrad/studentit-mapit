/* exported ResourceMap */
var ResourceMap = function(loc) {
	'use strict';
	var RESOURCE_SIZE        = 10;
	var RESOURCE_STROKE_SIZE =  3;

	var _stateColour = {
		'':              '#4FC3F7',
		'AVAILABLE':     '#81C784',
		'IN_USE':        '#E57373',
		'NOT_AVAILABLE': '#000000',
		'RESERVED':      '#FFD54F',
	};

	//var RESOURCE_SELECTED_COLOUR = '#FFC107';
	//var RESOURCE_IN_USE_COLOUR   = '';
	//var RESOURCE_AVAIL_COLOUR    = '';
	//var RESOURCE_FAULTY_COLOUR   = '';

	//var _background = null;
	//var _c = null;
	//var _ctx = null;
	//var _map = null;
	//var _animFrame = null;
	//var _mapInfo = null;
	//var _prevX = null;
	//var _prevY = null;

	var scale = 1.1;

	var that = this;

	this._initialize = function() {
		this._animFrame = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			null;

		this.setLocation(loc);
		console.log('Creating map.');

		var map = document.getElementById('map');
		this._map = map;
		this._map.innerHTML = '';

		this._createMap();

		if (!this._animFrame) {
			console.log('Oh no :(');
		} else {
			this._animFrame.call(window, this._recursiveAnim);
		}
	};

	this.setLocation = function(loc) {
		if (!this._map) {
			console.log('Cannot set location while map is undefined.');
			return;
		}
		this.location = loc;

		this._loadPositions();
	};

	this._createMap = function() {
		var canvas = document.createElement('canvas');

		canvas.id = 'map_canvas';
		canvas.width = this._map.offsetWidth;
		canvas.height = this._map.offsetHeight;

		this._map.appendChild(canvas);

		this._c   = canvas;
		this._ctx = canvas.getContext('2d');

		/* global trackTransforms */
		trackTransforms(this._ctx);

		this.resizeCanvas();
	};

	this.centerOnResource = function(name) {
		name = name.trim();
		if (!this._mapInfo) {
			console.log('ERROR: No information available for this location. [' + this.location + '].');
			return;
		}
		if (!this._mapInfo.resources.hasOwnProperty(name)) {
			console.log('ERROR: Resource [' + name + '] is unknown.');
			return;
		}

		var resInfo = this._mapInfo.resources[name];
		if (!this._mapInfo.levels.hasOwnProperty(resInfo.level)) {
			console.log('ERROR: No information available for level [' + resInfo.level + '].');
			return;
		}

		var level = this._mapInfo.levels[resInfo.level];
		
		console.log('Centering on [' + name + '].');
		console.log(resInfo);

		this._loadLevel(level.filename);
	};

	this._loadLevel = function(filename) {
		this._clearCanvas();
		this._setBackground(filename);
	};


	this._loadPositions = function() {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', 'maps/' + this.location + '.json', true);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				var obj = JSON.parse(xmlhttp.responseText);
				that._mapInfo = obj;
				console.log(obj);
			}
		};
		xmlhttp.send(null);
	};

	this.resourceUpdate = function(resources) {
		for (var r in resources) {
			var resource = resources[r];
			this._mapInfo.resources[resource.name].state = resource.state;
		}
		console.log(this._mapInfo);
	};

	this._drawResource = function(resource) {
		var ctx = that._ctx;

		ctx.fillStyle = _stateColour[resource.state];
		ctx.beginPath();
		ctx.arc(resource.x, resource.y, RESOURCE_SIZE, 0, 2 * Math.PI, false);
		ctx.fill();

		ctx.lineWidth = RESOURCE_STROKE_SIZE;
		ctx.stroke();
	};

	this._scaleToScreen = function() {
		if (this._background && this._background.width !== 0 && this._background.height !== 0) {
			var wScale = this._w / this._background.width;
			var hScale = this._h / this._background.height;


			var iScale = wScale < hScale ? wScale : hScale;

			var transX = 0;
			var transY = 0;

			if (wScale > hScale) {
				transX = Math.abs((this._w - (hScale * this._background.width)) / 2);
			} else {
				transY = Math.abs((this._h - (wScale * this._background.height)) / 2);
			}

			this._ctx.clearTransform();
			this._ctx.setTransform(1,0,0,1,0,0);
			this._ctx.translate(transX, transY);
			this._ctx.scale(iScale, iScale);

			console.log('New scale: ' + iScale);
		}
	};

	this._setBackground = function(filename) {
		var base = 'http://files.cy.id.au/maps/';
		var path = base + filename;
		this._background = new Image();
		this._background.src = path;
		//this._background.src = 'maps/' + path + '.jpg';
		this._background.onload = function() {
			that._scaleToScreen();
		};
	};

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

	this.resizeCanvas = function() {
		console.log(this._c.width);
		console.log(this._map);

		this._w = this._c.width = this._map.offsetWidth;
		this._h = this._c.height = this._map.offsetHeight;

		this._scaleToScreen();
		this._drawMap();
	};

	this._clearCanvas = function() {
		this._ctx.save();
		this._ctx.setTransform(1,0,0,1,0,0);
		this._ctx.clearRect(0,0,this._c.width, this._c.height);
		this._ctx.restore();
	};

	this._drawMap = function() {
		that._clearCanvas();
		that._ctx.save();

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

		that._ctx.restore();
	};

	this._recursiveAnim = function() {
		that._drawMap();

		if (!that._animFrame) {
			console.log('AnimFrame is null. Falling back to setInterval');
		} else {
			that._animFrame.call(window, that._recursiveAnim);
		}
	};

	this._zoom = function(f) {
		var t = this._ctx.transformedPoint(this._mPos.x, this._mPos.y);
		var factor = Math.pow(scale, f);

		this._ctx.translate(t.x, t.y);
		this._ctx.scale(factor, factor);
		this._ctx.translate(-t.x, -t.y);
	};

	this.movePosition = function(x, y) {
		//console.log('Moving map by (' + x + ', ' + y + ') to (' + this._prevX + ', ' + this._prevY + ') pixels.');
		if (this._prevX) {
			this._ctx.translate(x, y);
			this._prevX = this._prevX + x;
			this._prevY = this._prevY + y;
		} else {
			this._ctx.translate(x, y);
			this._prevX = x;
			this._prevY = y;
		}
		//console.log('Location is now (' + this._prevX + ', ' + this._prevY + ') pixels.');
	};

	this._initialize();
};
