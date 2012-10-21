var PHAROLITO_RELATIVE = '../trunk/';
var DEFAULT_SPRITE_IMAGE_REPOSITORY = 'sprites/';
DEFAULT_GAME_REPOSITORY = 'gameInfo/';
var TRANSPARENT_PIXEL_COLOR = {
	r : 32,
	g : 156,
	b : 0
};
var getRequestAnimationFrame = function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(enroute, 1 / 60 * 1000);
			};
};
// ---------------------------------------BASIC_TYPES----------------------------------

Array.prototype.each = function(fn) {
	for ( var i = 0; i < this.length; i++) {
		var c = this[i];
		fn.call(c, i, this);
	}
};
String.prototype.selfTemplate = function(regExp) {
	if (this.test(regExp)) {
		return this.substring(1, this.length - 1).replace(/\$/g, "self.");
	} else {
		return this;
	}
};
String.prototype.isInteger = function() {
	return !isNaN(parseInt(this));
};

String.prototype.toInt = function() {
	return parseInt(this);
};

String.prototype.isFloat = function() {
	return !isNaN(parseFloat(this));
};
String.prototype.toFloat = function() {
	return parseFloat(this);
};
String.prototype.isNumber = function() {
	return this.isInteger() || this.isFloat();
};
String.prototype.lTrim = function() {
	return this.replace(new RegExp('^[\\s]*', 'g'), '');
};

String.prototype.rTrim = function() {
	return this.replace(new RegExp('[\\s]*$', 'g'), '');
};

String.prototype.bTrim = function() {
	return this.replace(/\s/g, '');
};
function URI(uri) {
	this.uri = uri;
	this.parts = uri.split('/');
	var tmp = this.parts[this.parts.length - 1].split('.');
	this.name = tmp[0];
	this.domain = tmp[1];
}

String.prototype.toURI = function() {
	return new URI(this);
};
String.prototype.test = function(regexp) {
	return regexp.test(this);
};
Function.prototype.match = function(regexp) {
	return this.toString().match(regexp);
};

Function.prototype.firstMatch = function(regexp) {
	return this.match(regexp).shift();
};

Function.prototype.test = function(regexp) {
	return regexp.test(this.toString());
};

function i(obj) {
	console.info(obj);
}

function t(element, name) {
	return element.getElementsByTagName(name)[0];
}
function td(element, name) {
	return t(element, name).firstChild.data;
};
Function.prototype.empty = function() {
	return function() {
	};
};
Function.prototype.params = function() {
	var toParse = this.toString().match(
			new RegExp("\\([\\w\\,\\$\\s]*\\)", "g")).shift();
	// (?:\\()
	// (?:\))
	return (toParse.substring(1, toParse.length - 1)).bTrim().split(',');
};

Function.prototype.invokeSellecting = function(params) {
	var p = this.params();
	var args = [];
	for ( var index = 0; index < p.length; index++) {
		var current = p[index];
		args.push(params[current]);
	}
	return this.apply(this, args);
};

Function.prototype.promise = function() {
	if (this.value) {
		return this.value;
	}
	return this.value = this.apply(this, $S(arguments));
};

function $S(args) {
	return Array.prototype.slice.call(args);
}

function wrapperSuperFunction(thisObj, superObj, callback) {
	return function() {
		var args = $S(arguments);
		if (new RegExp('\\$super', 'g').test(callback.toString())) {
			args = [ superObj ].concat(args);
		}
		return callback.apply(thisObj, args);
	};

};

// ---------------------------------------AJAX----------------------------------

function Ajax() {
	var factory = function() {
		return (window.XMLHttpRequest || new ActiveXObject("Microsoft.XMLHTTP"));
	};
	var request = new (factory())();
	var $success = $execute = $error = undefined;
	var self = this;
	function config() {
		request.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					if ($success)
						$success.invokeSellecting({
							$text : request.responseText,
							$xml : request.responseXML,
							$self : self
						});
					else if ($execute)
						$execute(request.responseText);
					else
						$error.invokeSellecting({
							$text : 'Not execute or success',
							$code : -1,
							$self : self
						});
				} else {
					($error || Function.empty()).invokeSellecting({
						$text : request.statusText,
						$code : request.status,
						$self : self
					});
				}
			}
		};
	}
	this.success = function(callback) {
		$success = callback;
		return this;
	};
	this.error = function(callback) {
		$error = callback;
		return this;
	};
	this.execute = function() {
		$execute = function($text) {
			eval($text);
		};
		return this;
	};
	this.get = function(url) {
		config();
		request.open('GET', url, true);
		request.send();
	};
	this.post = function(url, params) {
		config();
		request.open('POST', url, true);
		request.send(params.serialize());
	};
	this.method = function(method, url, params) {
		config();
		if (method.toUpperCase() == 'GET') {
			this.get(url + (params ? '?' + params : ''));
		} else {
			request.open(method.toUpperCase(), url, true);
			request.send(params.serialize());
		}
	};

};

// ---------------------------------------HTML_TYPES----------------------------------

Serializable = new function() {
	this.isImplemented = function(obj) {
		return obj.isSerializable == true;
	};
	this.implement = function(obj) {
		obj.isSerializable = true;
	};
};

Serializable.implement(HTMLInputElement.prototype);
HTMLFormElement.prototype.serialize = function() {
	var values = [];
	for ( var index = 0; index < this.childNodes.length; index++) {
		var child = this.childNodes[index];
		if (Serializable.isImplemented(child))
			values.push(child.serialize());
	}
	;
	return values.join('&');
};

HTMLFormElement.prototype.ajax = function() {
	var ajax = new Ajax();
	if (this.getAttribute('execute'))
		ajax.execute();
	if (this.getAttribute('success')) {
		eval('ajax.success(' + this.getAttribute('success') + ');');
	}
	ajax.method(this.method, this.action, this.serialize());
};

HTMLInputElement.prototype.serialize = function() {
	return this.name + '=' + this.value;
};
// -------------------------------------------------------------------------

/*
 * Inspired by Simple JavaScript Inheritance By John Resig http://ejohn.org/ MIT
 * Licensed.
 */
(function() {
	// The base Class implementation (does nothing)
	this.Class = function() {
	};

	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for ( var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function"
					&& typeof _super[name] == "function"
					&& prop[name].params().shift() == '$super' ? (function(
					name, fn) {
				return function() {
					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var self = this;
					var args = arguments;
					function s() {
						return _super[name].apply(self, args);
					}
					var ret = fn.apply(this, [ s ].concat(arguments));
					return ret;
				};
			})(name, prop[name]) : prop[name];
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();
// ------------------------------------VIEW---------------------------------------------

function createViewPort(configs) {
	if (!configs) {
		throw 'viewport configs needed';
	}
	ViewPort = new (function() {
		var howMuchLayers = td(configs, 'layers').toInt();
		this.layers = [];
		var width = t(configs, 'bounds').getAttribute('width').toInt();
		var height = t(configs, 'bounds').getAttribute('height').toInt();
		function createCanvas(width, height) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			return canvas;
		}
		function getContext(width, height) {
			return createCanvas(width, height).getContext('2d');
		}
		var main = createCanvas(width, height);
		this.canvas = main.getContext('2d');

		for ( var index = 1; index <= howMuchLayers; index++) {
			this.layers.push(getContext(width, height));
		}
		document.getElementById(td(configs, 'holder')).appendChild(main);

		this.clean = function() {
			this.canvas.clearRect(0, 0, width, height);
			for ( var index = 0; index < howMuchLayers; index++) {
				this.layers[index].clearRect(0, 0, width, height);
			}
		};

		this.marge = function() {
			for ( var index = 0; index < howMuchLayers; index++) {
				this.canvas.drawImage(this.layers[index].canvas, 0, 0);
			}
		};
		this.drawOnTop = function(obj) {
			obj.draw(this.layers[howMuchLayers - 1]);
		};
		this.drawOnBack = function(obj) {
			obj.draw(this.layers[0]);
		};
		this.draw = function(obj, level) {
			obj.draw(this.layers[level]);
		};
		this.layer = function(level) {
			return this.layers[level];
		};
	});
}

ImageStore = new (function() {
	var images = {};
	var waiting = {};
	this.load = function(name, url) {
		var img = document.createElement('img');
		var self = this;
		img.onload = function() {
			self.imageLoaded(name);
		};
		img.src = url;
		images[name] = img;
	};
	this.isComplete = function(imageName) {
		return images[imageName] && images[imageName].complete;
	};
	this.imageLoaded = function(imageName) {
		if (waiting[imageName] == true) {
			delete waiting[imageName];
			SpriteRepository.proccessQueue(imageName);
		}
	};
	this.get = function(name) {
		return images[name];
	};
	this.waitingFor = function(imageName) {
		waiting[imageName] = true;
	};
});
SpriteRepository = new (function() {
	var waiting = {};
	var sprites = {};
	this.loadSprites = function(url) {
		var self = this;
		new Ajax().success(function($xml) {
			var root = $xml.firstChild;
			var imageName = root.getAttribute('image');
			if (ImageStore.isComplete(imageName))
				self.proccess($xml);
			else
				self.queueProccess(imageName, $xml);
		}).get(url);
	};
	this.proccessQueue = function(imageName) {
		this.proccess(waiting[imageName]);
		delete waiting[imageName];
	};
	this.queueProccess = function(imageName, xml) {
		var uri = imageName.toURI();
		waiting[uri.name] = xml;
		ImageStore.waitingFor(uri.name);
		ImageStore.load(uri.name, imageName);
	};
	this.proccess = function(xml) {
		var root = xml.firstChild;
		var imageName = root.getAttribute('image').toURI();
		var image = ImageStore.get(imageName.name);
		var xmlSprites = t(root, 'sprite');
		for ( var index = 0; index < xmlSprites.length; index++) {
			var currentSpriteData = xmlSprites[index];
			var bounds = t(currentSpriteData, 'bounds');
			var animations = t(currentSpriteData, 'animations');
			var name = currentSpriteData.getAttribute('name');
			var rows = currentSpriteData.getAttribute('rows');
			var columns = currentSpriteData.getAttribute('columns');
			sprites[name] = new Sprite(image, rows, columns, bounds,
					animations, index);
		}
	};
	this.findAll = function() {
		return sprites;
	};
	this.findByName = function(name) {
		return sprites[name];
	};
	this.register = function(name, sprite) {
		sprites[name] = sprite;
	};
});

function Step(step, sprite) {
	this.image = sprite.image;
	this.offsetX = sprite.x;
	this.offsetY = sprite.y;
	this.width = sprite.width / sprite.columns;
	this.height = sprite.height / sprite.rows;
	this.y = step.getAttribute('row').toInt();
	this.x = step.getAttribute('column').toInt();
	this.draw = function(ctx, posX, posY) {
		ctx.drawImage(this.image, this.offsetX + ((this.x - 1) * this.width),
				this.offsetY + ((this.y - 1) * this.height), this.width,
				this.height, posX, posY, this.width, this.height);
		var pixels = ctx.getImageData(posX, posY, this.width, this.height);

		// iterate through pixel data (1 pixels consists of 4 ints in the array)
		for ( var i = 0, len = pixels.data.length; i < len; i += 4) {
			var r = pixels.data[i];
			var g = pixels.data[i + 1];
			var b = pixels.data[i + 2];

			// if the pixel matches our transparent color, set alpha to 0
			if (r == TRANSPARENT_PIXEL_COLOR.r
					&& g == TRANSPARENT_PIXEL_COLOR.g
					&& b == TRANSPARENT_PIXEL_COLOR.b) {
				pixels.data[i + 3] = 0;
			}
		}
		ctx.putImageData(pixels, posX, posY);
	};
}

function Sprite(image, rows, columns, bounds, animations, index) {
	this.image = image;
	this.rows = rows.toInt();
	this.columns = columns.toInt();
	this.animations = animations;
	this.index = index;
	var self = this;
	var toDraw = null;
	var indexes = {};
	function evalRelative(text, prop) {
		if (text.isInteger()) {
			self[prop] = text.toInt();
		} else if (text.isFloat()) {
			self[prop] = text.toFloat();
		} else
			eval('self.' + prop + '=(' + text.selfTemplate(/\{.*\}/g) + ')');
	}
	this.animations = {};
	evalRelative(bounds.getAttribute('width'), 'width');
	evalRelative(bounds.getAttribute('height'), 'height');
	evalRelative(bounds.getAttribute('x'), 'x');
	evalRelative(bounds.getAttribute('y'), 'y');
	var animats = animations.getElementsByTagName('animation');
	for ( var index = 0; index < animats.length; index++) {
		var animation = animats[index];
		var animationName = animation.getAttribute('name');
		this.animations[animationName] = [];
		var steps = animation.getElementsByTagName('step');
		indexes[animationName] = 0;
		for ( var stepIndex = 0; stepIndex < steps.length; stepIndex++) {
			var currentStep = steps[stepIndex];
			var inst = new Step(currentStep, this);
			this.animations[animationName].push(inst);
			if (currentStep.getAttribute('default')) {
				toDraw = inst;
			}
		}
	}

	this.nextStep = function(selector) {
		var tmpIdx = (indexes[selector]++);
		i(tmpIdx);
		if (tmpIdx == this.animations[selector].length)
			indexes[selector] = tmpIdx = 0;
		toDraw = this.animations[selector][tmpIdx];
	};

	this.draw = function(ctx, posX, posY) {
		toDraw.draw(ctx, posX, posY);
	};
	this.d = function() {
		return toDraw;
	};
	this.clone = function(spriteId) {
		var clone = new Sprite(image, rows, columns, bounds, animations,
				this.index);
		SpriteRepository.register(spriteId, clone);
		return clone;
	};
}

function Tile() {
	var objects = [];
	this.contains = function(obj) {
		return objects.indexOf(obj) > -1;
	};
}

// ------------------------------------MODELING----------------------------------------

ModelObject = Class.extend({
	init : function(view) {
		this.view = view;
		this.internalInitialize();
	},
	internalInitialize : function() {
		this.x = 0;
		this.y = 0;
		this.layout = 0;
	},
	update : function() {

	},
	draw : function(viewport) {
		this.view.draw(ViewPort.layer(this.layout), this.x, this.y);
	}
});

// -------------------------------------CORE-------------------------------------------

// ------------------------------------MODULES-----------------------------------------
ModuleManager = Class.extend(new (function() {
	var hooks = {
		startRequest : [],
		started : [],
		stopRequest : [],
		stopped : [],
		updateRequest : [],
		updated : [],
		drawRequest : [],
		drawn : []
	};

	this.addHook = function(type, module) {
		hooks[type].push(module);
	};

	this.execute = function(type) {
		hooks[type].each(function() {
			this.execute(type);
		});
	};

}));
Module = Class.extend(new (function() {
	this.execute = function(type) {
		this[type]();
	};
	this.startRequest = function() {

	};
	this.started = function() {

	};
	this.stopRequest = function() {

	};
	this.stopped = function() {

	};
	this.updateRequest = function() {

	};
	this.updated = function() {

	};
	this.drawRequest = function() {

	};
	this.drawn = function() {

	};
}));
Ph = new (function() {
	var objects = [];
	var toDelete = [];
	var moduleManager = new ModuleManager();

	// to delete
	this.m = moduleManager;
	this.o = objects;
	//
	this.loadModule = function(module) {
		i(module);
		module.installOn(moduleManager);
	};
	this.addObject = function(obj) {
		objects.push(obj);
	};

	this.addObjectToDelete = function(obj) {
		toDelete.push(obj);
	};

	function update() {
		for ( var index = 0; index < objects.length; index++) {
			objects[index].update();
		}
	}
	function draw() {
		ViewPort.clean();
		for ( var index = 0; index < objects.length; index++) {
			objects[index].draw(ViewPort);
		}
		ViewPort.marge();
	}
	function clean() {
		for ( var index = 0; index < toDelete.length; index++) {
			var current = toDelete[index];
			objects.slice(objects.indexOf(current));
		}
		toDelete = [];
	}
	var requestAnimation = getRequestAnimationFrame();
	var running = false;
	doLoop = function() {
		moduleManager.execute('updateRequest');
		update();
		moduleManager.execute('updated');
		moduleManager.execute('drawRequest');
		draw();
		moduleManager.execute('drawn');
		clean();
		if (running)
			requestAnimation(doLoop);
	};
	this.start = function() {
		moduleManager.execute('startRequest');
		running = true;
		moduleManager.execute('started');
		requestAnimation(doLoop);
	};
	this.stop = function() {
		moduleManager.execute('stopRequest');
		running = false;
		moduleManager.execute('stopped');
	};
});
// --------------------------------------LOADING----------------------------------------
function pharolitoConfigs(url) {
	new Ajax().success(
			function($xml) {
				var root = $xml.firstChild;
				loadSprits(root);
				var configs = t(root, 'config');
				if (configs) {
					loadTransparentColor(configs);
					createViewPort(t(configs, 'viewport'));
				}
				loadModules(root);

				var url = t(root, 'gamescript').getAttribute('url')
						.selfTemplate(/\{.*\}/g);
				eval('new Ajax().execute().get(' + url + ')');
			}).get(url);
}

function loadModules(root) {
	var tModules = t(root, 'modules');
	if (tModules) {
		var modules = tModules.getElementsByTagName('module');
		for ( var index = 0; index < modules.length; index++) {
			var current = modules[index];
			var url = current.getAttribute('url').selfTemplate(/\{.*\}/g);
			eval('new Ajax().execute().get(' + url + ')');
		}
	}
}

function loadTransparentColor(configs) {
	var transparentColor = t(configs, 'transparentColor');
	if (transparentColor) {
		TRANSPARENT_PIXEL_COLOR['r'] = transparentColor.getAttribute('r')
				.toInt()
				|| TRANSPARENT_PIXEL_COLOR['r'];
		TRANSPARENT_PIXEL_COLOR['g'] = transparentColor.getAttribute('g')
				.toInt()
				|| TRANSPARENT_PIXEL_COLOR['g'];
		TRANSPARENT_PIXEL_COLOR['b'] = transparentColor.getAttribute('b')
				.toInt()
				|| TRANSPARENT_PIXEL_COLOR['b'];
	}
}
function loadSprits(root) {
	var sprites = t(root, 'sprites');
	if (sprites) {
		var toEval = sprites.firstChild.data;
		toEval = toEval.selfTemplate(/\{.*\}/g);
		eval('SpriteRepository.loadSprites(' + toEval + ')');
	}
}

// -------------------------------BASIC_ANIMATION-------------------------------------
// SpriteRepository.loadSprites(DEFAULT_SPRITE_IMAGE_REPOSITORY +
// 'anime.xml');
// function c() {
// c = document.getElementById('can').getContext('2d');
// }
// function begin() {
// p = SpriteRepository.findByName('person1');
// p2 = SpriteRepository.findByName('person2');
// c();
// y = 0;
// setInterval(ani, 100);
// }
// function ani() {
// c.clearRect(0, 0, 500, 500);
// p.draw(c, 40, y);
// p2.draw(c, 40, 500 - y);
// y = y + 10;
// p.nextStep('goDown');
// p2.nextStep('goUp');
// }

