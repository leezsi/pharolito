var PHAROLITO_RELATIVE = '../trunk/';
var DEFAULT_SPRITE_IMAGE_REPOSITORY = 'sprites/';
DEFAULT_GAME_REPOSITORY = 'gameInfo/';
var gameURL = null;
var TRANSPARENT_PIXEL_COLOR = {
	r : 32,
	g : 156,
	b : 0
};
// --------------------------------KEYWORD_CONSTANTS-------------------------------------------
KW_backspace = 8, KW_tab = 9, KW_enter = 13, KW_shift = 16, KW_ctrl = 17,
		KW_alt = 18, KW_pause = 19, KW_capslock = 20, KW_escape = 27;

KW_pageup = 33, KW_ = pagedown = 34, KW_end = 35, KW_home = 36;

KW_left = 37, KW_up = 38, KW_right = 39, KW_down = 40, KW_insert = 45,
		KW_delete = 46, KW_left_window = 91, KW_right_window = 92,
		KW_select = 93;

KW_0 = 48, KW_1 = 49, KW_2 = 50, KW_3 = 51, KW_4 = 52, KW_5 = 53, KW_6 = 54,
		KW_7 = 55, KW_8 = 56, KW_9 = 57;
KW_a = 65, KW_b = 66, KW_c = 67, KW_d = 68, KW_e = 69, KW_f = 70, KW_g = 71,
		KW_h = 72, KW_i = 73, KW_j = 74, KW_k = 75, KW_l = 76, KW_m = 77,
		KW_n = 78, KW_o = 79, KW_p = 80, KW_q = 81, KW_r = 82, KW_s = 83,
		KW_t = 84, KW_u = 85, KW_v = 86, KW_w = 87, KW_x = 88, KW_y = 89,
		KW_z = 90;

KW_numpad_0 = 96, KW_numpad_1 = 97, KW_numpad_2 = 98, KW_numpad_3 = 99,
		KW_numpad_4 = 100, KW_numpad_5 = 101, KW_numpad_6 = 102,
		KW_numpad_7 = 103, KW_numpad_8 = 104, KW_numpad_9 = 105;

KW_multiply = 106, KW_add = 107, KW_subtract = 109, KW_decimal_point = 110;
KW_divide = 111, KW_f1 = 112, KW_f2 = 113, KW_f3 = 114, KW_f4 = 115;
KW_f5 =
116;
KW_f6 = 117, KW_f7 = 118, KW_f8 = 119, KW_f9 = 120, KW_f10 = 121, KW_f11 = 122,
		KW_f12 = 123;

// --------------------------------------------------------------------------------------------

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
Array.prototype.random = function() {
	var index = Math.floor((Math.random() * this.length - 1) + 1);
	return this[index];
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
Array.prototype.remove = function(o) {
	var i = this.indexOf(o);
	if (i > -1) {
		this.splice(i, 1);
	}
};
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
	var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
			.replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '').replace(
					/\s+/g, '').split(',');
	return names.length == 1 && !names[0] ? [] : names;
};
function s(arg) {
	return Array.prototype.slice.call(arg);
}
Function.prototype.wrap = function(ctx, anotherFn) {
	var self = this;
	if (anotherFn.params().shift() == '$super') {
		return function() {
			anotherFn.apply(this, [ function() {
				self.apply(ctx, s(arguments));
			} ].concat(s(arguments)));
		};
	}
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

(function() {
	if (HTMLElement.prototype.addEventListener) {
		HTMLElement.prototype.$addEventListener = HTMLElement.prototype.addEventListener;
		HTMLElement.prototype.$mozillaBrowser = true;
	} else {
		HTMLElement.prototype.$addEventListener = HTMLElement.prototype.attachEvent;
		HTMLElement.prototype.$mozillaBrowser = false;
	}
	HTMLElement.prototype.$removeEventListener = HTMLElement.prototype.removeEventListener
			|| HTMLElement.prototype.detachEven;
})();

HTMLElement.prototype.addEventListener = function(type, listener) {
	if (this.$mozillaBrowser) {
		return this.$addEventListener(type, listener, true);
	} else {
		return this.$addEventListener('on' + type, listener);
	}
};
HTMLElement.prototype.removeEventListener = function(type, listener) {
	return this.$removeEventListener(type, listener);
};
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

(function() {
	this.Class = function() {
		if (!initializing && this.init) {
			this.init.apply(this, s(arguments));
		}
	};

	Class.extend = function(behaviour) {

		initializing = true;
		var proto = new this();
		initializing = false;
		function subclass() {
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		for ( var prop in behaviour) {
			if (proto[prop] && typeof proto[prop] == 'function'
					&& behaviour[prop].params().shift() == '$super') {
				proto[prop] = proto[prop].wrap(proto, behaviour[prop]);
			} else {
				proto[prop] = behaviour[prop];
			}
		}

		subclass.prototype = proto;
		subclass.prototype.constructor = subclass;
		subclass.extend = arguments.callee;
		return subclass;
	};
})();

// ------------------------------------VIEW---------------------------------------------
mouse = new (Class.extend(new function() {
	this.x = 0;
	this.y = 0;
	this.button;
	this.isPressed = false;
}))();

keyword = new (Class.extend(new function() {
	this.keys = [];
	this.addKey = function(key) {
		this.keys[key] = true;
	};
	this.reset = function() {
		this.keys = [];
	};
	this.isPressed = function() {
		var res = true;
		for ( var index = 0; res && (index < arguments.length); index++) {
			res = res & this.keys[arguments[index]];

		}
		return res;
	};
}));
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
			canvas.addEventListener('mousedown', function(event) {
				mouse.isPressed = true;
				mouse.button = event.button;
			});
			document.body.addEventListener('keydown', function(event) {
				keyword.addKey(event.which);
			});
			canvas.addEventListener('mousemove', function(event) {
				mouse.x = event.x;
				mouse.y = event.y;
			});
			canvas.addEventListener('mouseup', function(event) {
				mouse.isPressed = false;
				mouse.button = false;
			});

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
	this.i = images;
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
		var xmlSprites = root.getElementsByTagName('sprite');
		for ( var index = 0; index < xmlSprites.length; index++) {
			var currentSpriteData = xmlSprites[index];
			var bounds = currentSpriteData.getElementsByTagName('bounds')[0];
			var animations = currentSpriteData
					.getElementsByTagName('animations')[0];
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

// -------------------------------------CORE-------------------------------------------

// ------------------------------------MODELING----------------------------------------

GameObject = Class.extend(new (function() {
	this.init = function(view) {
		this.view = view;
		this.internalInitialize();
	};
	this.internalInitialize = function() {
		this.x = 0;
		this.y = 0;
		this.layout = 0;
	};
	// this.update = function() {
	//
	// };
	this.draw = function(viewport) {
		this.view.draw(ViewPort.layer(this.layout), this.x, this.y);
	};
}));

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
	this.init = function() {
		Ph.loadModule(this);
	};
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

Module.extend = function(behaviour) {
	var subclass = Class.extend.call(this, behaviour);
	new subclass();
	return subclass;
};
Ph = new (function() {
	var objects = [];
	var toDelete = [];
	var moduleManager = new ModuleManager();
	var first = true;
	this.loadModule = function(module) {
		module.installOn(moduleManager);
	};
	this.addObject = function(obj) {
		objects.push(obj);
	};

	this.addObjectToDelete = function(obj) {
		toDelete.push(obj);
	};
	var updateParameters = {
		$mouse : mouse,
		$keyword : keyword
	};
	function update() {
		for ( var index = 0; index < objects.length; index++) {
			var obj = objects[index];
			var paramNames = objects[index].update.params();
			var params = [];
			for ( var idx = 0; idx < paramNames.length; idx++) {
				params.push(updateParameters[paramNames[idx]]);
			}
			obj.update.apply(obj, params);
		}
		keyword.reset();
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
			objects.remove(current);
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
		if (first) {
			eval('new Ajax().execute().get(' + gameURL + ')');
			first = false;
		}
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
	// to delete
	this.m = moduleManager;
	this.o = objects;
	this.c = clean;
	//
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

				gameURL = t(root, 'gamescript').getAttribute('url')
						.selfTemplate(/\{.*\}/g);

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

