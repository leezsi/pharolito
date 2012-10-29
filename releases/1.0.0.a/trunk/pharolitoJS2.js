var PHAROLITO_RELATIVE = '../trunk/';
var DEFAULT_SPRITE_IMAGE_REPOSITORY = 'sprites/';
DEFAULT_GAME_REPOSITORY = 'gameInfo/';
var gameURL = null;

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

var requestAnimationFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1 / 60 * 1000);
			};
})();
// ---------------------------------------BASIC_TYPES----------------------------------
function a(obj) {
	if (obj instanceof Array)
		return obj;
	return [ obj ];
}

function i(obj) {
	console.info(obj);
}

Document.prototype.toJSON = function() {
	var json = {};

	if (this.attributes && this.attributes.length > 0) {
		json["@atts"] = {};
		for ( var j = 0; j < this.attributes.length; j++) {
			var attribute = this.attributes.item(j);
			json["@atts"][attribute.nodeName] = attribute.nodeValue;
		}
	}

	for ( var i = 0; i < this.childNodes.length; i++) {
		var item = this.childNodes.item(i);
		if (item.nodeType != Node.COMMENT_NODE) {
			var name = item.nodeName;
			if (item.nodeType == Node.TEXT_NODE) {
				json['value'] = item.nodeValue;
			} else {
				if (!json[name])
					json[name] = [];
				json[name].push(item.toJSON());
			}
		}
	}
	return json;
};

Element.prototype.toJSON = Document.prototype.toJSON;
Text.prototype.toJSON = function() {
	return this.nodeValue;
};

function c(type) {
	return document.createElement(type);
}

Function.prototype.parametrized = function(args) {
	var ctx = args['$self'];
	var params = this.params();
	var toInvoke = [];
	for ( var index = 0; index < params.length; index++) {
		toInvoke.pus(args[params[index]]);
	}
	return this.apply(ctx, toInvoke);
};
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
String.prototype.toURI = function() {
	return new URI(this);
};
Array.prototype.remove = function(o) {
	var i = this.indexOf(o);
	if (i > -1) {
		this.splice(i, 1);
	}
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

// ---------------------------------------HTML_TYPES----------------------------------

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

ResourceLoader = new (Class
		.extend(new (function() {
			var resources = {};
			var requestFactory = (function() {
				return (window.XMLHttpRequest || new ActiveXObject(
						"Microsoft.XMLHTTP"));
			})();

			function get(request, url) {
				request.open('GET', url, false);
				request.send();
			}

			this.load = function() {
				for ( var index = 0; index < arguments.length; index++) {
					var current = arguments[index];
					var request = new requestFactory();
					get(request, current['url']);
					resources[current['name']] = {
						text : request.responseText,
						xml : request.responseXML,
						code : request.status,
						status : request.statusText
					};
				}
			};

			this.temporal = function(url) {
				var request = new requestFactory();
				get(request, url);
				return {
					text : request.responseText,
					xml : request.responseXML,
					code : request.status,
					status : request.statusText
				};
			};

			this.get = function(name) {
				return resources[name];
			};
		})()));

ImageRepository = new (Class.extend(new (function() {

	var images = {};
	var toComplete = 0;

	this.complete = function() {
		return toComplete == 0;
	};

	this.loadImage = function(name, url) {
		var img = c('img');
		toComplete++;
		img.addEventListener('load', function() {
			loaded();
		});
		images[name] = img;
		img.src = url;
	};
	function loaded() {
		toComplete--;
	}

	this.loadImageOnce = function(imageName, url) {
		if (!this.has(imageName)) {
			this.loadImage(imageName, url);
		}
	};
	this.has = function(imageName) {
		return typeof this.get(name) != 'undefined';
	};

	this.get = function(name) {
		return images[name];
	};
})()))();

function Sprite(def, img) {
	var image = img;
	this.x = def.x;
	this.y = def.y;
	this.width = def.width / def.columns;
	this.height = def.height / def.rows;

	this.draw = function(ctx, args) {
		var offsetWidth = (args.width ? args.width : 1) * this.width;
		var offsetHeight = (args.height ? args.height : 1) * this.height;
		var offsetX = args.x - offsetWidth / 2;
		var offsetY = args.y - offsetHeight / 2;
		ctx.drawImage(image, this.x, this.y, this.width, this.height, offsetX,
				offsetY, offsetWidth, offsetHeight);
	};
}

function CompoundSprite() {
	var matrix = [];
	var rowIndex = -1;
	this.addRow = function(rowDefinition) {
		var temp = [];
		for ( var i = 0; i < rowDefinition.value.length; i++) {
			var current = rowDefinition.value[i];
			temp[i] = SpriteRepository.get(current);
		}
		matrix[rowIndex++] = temp;
	};
	this.draw = function(ctx, args) {
		var offsetWidth = args.width / matrix[0].length;
		var offsetHeight = args.height / matrix.length;
		for ( var i = 0; i < matrix.length; i++) {
			var row = matrix[i];
			for ( var j = 0; j < row.length; j++) {
				var sprite = row[j];
				var offsetX = j * offsetWidth;
				var offsetY = i * offsetHeight;
				sprite.draw(ctx, {
//					width : offsetWidth,
//					height : offsetHeight,
					x : offsetX,
					y : offsetY
				});
			}
		}
	};
	this.m = matrix;
};

SpriteRepository = new (function() {
	var sprites = {};
	this.s = sprites;
	this.get = function(name) {
		return sprites[name];
	};

	function createSprites(defs, img) {
		console.info(defs);
		for ( var i = 0; i < defs.length; i++) {
			var current = defs[i]['@atts'];
			sprites[current.name] = new Sprite(current, img);
		}
	}
	function createCompunds(defs) {
		for ( var index = 0; index < defs.length; index++) {
			var compound = new CompoundSprite();
			var atts = defs[index]['@atts'];
			sprites[atts.name] = compound;
			var current = defs[index];
			for ( var r = 0; r < current.row.length; r++) {
				var row = current.row[r];
				compound.addRow(row);
			}

		}
	}
	this.load = function(config) {
		spriteDefs = config.sprites;
		for ( var i = 0; i < spriteDefs.length; i++) {
			var current = spriteDefs[i];
			ImageRepository.loadImage(current['@atts'].name,
					current['@atts'].image);
			createSprites(current.sprite, ImageRepository
					.get(current['@atts'].name));
		}
		compoundDefs = config.sprites;
		for ( var i = 0; i < compoundDefs.length; i++) {
			var current = compoundDefs[i];
			createCompunds(current.compundsprite);
		}
	};
});

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
		this.layer = 0;
	};
	this.draw = function(cxt) {
		this.view.draw(cxt, this.x, this.y);
	};
	this.update = function() {
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
		this.layer = Ph.topLayer;
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
	this.addObject = function(obj) {
		var lay = obj.layer;
		if ((lay > -1) && (lay < this.layers)) {
			if (typeof objects[lay] == 'undefined')
				objects[lay] = [];
			objects[lay].push(obj);
		}
	};

	this.removeObject = function(obj) {
		var lay = obj.layer;
		if ((lay > 0) && (lay < this.layers)) {
			if (typeof toDelete[lay] == 'undefined')
				toDelete[lay] = [];
			toDelete[lay].push(obj);
		}
	};
	var updateParameters = {
		$keyword : keyword,
		$mouse : mouse
	};

	function updateObject(obj) {
		var paramNames = obj.update.params();
		var params = [];
		for ( var idx = 0; idx < paramNames.length; idx++) {
			params.push(updateParameters[paramNames[idx]]);
		}
		obj.update.apply(obj, params);
	}

	function drawObject(obj) {
		ViewPort.draw(obj);
	}

	var running = false;
	function doLoop() {
		ViewPort.clean();
		for ( var oIndex = 0; oIndex < objects.length; oIndex++) {
			var currentLayer = objects[oIndex];
			if (typeof currentLayer != 'undefined')
				for ( var lIndex = 0; lIndex < currentLayer.length; lIndex++) {
					var obj = currentLayer[lIndex];
					updateObject(obj);
					drawObject(obj);
				}
		}
		ViewPort.show();
		keyword.reset();
		if (running)
			requestAnimationFrame(doLoop);
	}
	var first = true;
	this.start = function() {
		running = true;
		if (first) {
			eval(ResourceLoader.temporal(this.applicationScript).text);
			first = false;
		}
		requestAnimationFrame(doLoop);
	};

	this.stop = function() {
		running = false;
	};
	this.topLayer = function() {
		return this.layers - 1;
	};

	this.loadModule = function(module) {
		module.installOn(this);
	};
	this.o = objects;

})();
function createViewPort(holder, bounds) {
	ViewPort = new (function() {
		var width = bounds.width.toInt();
		var height = bounds.height.toInt();
		function createCanvas() {
			var tmp = document.createElement('canvas');
			tmp.width = width;
			tmp.height = height;
			return tmp;
		}

		main = createCanvas();

		main.addEventListener('mousedown', function(event) {
			mouse.isPressed = true;
			mouse.button = event.button;
		});
		document.body.addEventListener('keydown', function(event) {
			keyword.addKey(event.which);
		});
		main.addEventListener('mousemove', function(event) {
			mouse.x = event.x;
			mouse.y = event.y;
		});
		main.addEventListener('mouseup', function(event) {
			mouse.isPressed = false;
			mouse.button = false;
		});

		holder.appendChild(main);
		var canvas = main.getContext('2d');
		var buffer = createCanvas().getContext('2d');

		this.clean = function() {
			canvas.clearRect(0, 0, 500, 500);
			buffer.clearRect(0, 0, 500, 500);
		};
		var rotation = 0;
		this.rotate = function(args) {
			rotation = args['radian'] ? args['radian'] : args['deg'] * Math.PI
					/ 180;
			buffer.rotate(rotation);
		};

		this.restart = function() {
			buffer.rotate(-rotation);
		};
		this.draw = function(obj) {
			obj.draw(buffer);
		};

		this.show = function() {
			canvas.drawImage(buffer.canvas, 0, 0);
		};
	})();
}
// --------------------------------------LOADING----------------------------------------

function pharolitoConfigs(url) {
	var xml = ResourceLoader.temporal(url).xml;
	root = xml.firstChild.toJSON();

	Ph.applicationScript = root.appscript[0]['@atts'].url;
	var viewport = root.viewport[0];
	Ph.layers = viewport.layers[0].value.toInt();
	createViewPort(document.getElementById(viewport.holder[0].value),
			viewport.bounds[0]['@atts']);
	loadSprites(root.sprites);
	loadModules(root.modules[0].module);
}

function loadSprites(urls) {
	for ( var index = 0; index < urls.length; index++) {
		var url = urls[index].value;
		i(ResourceLoader.temporal(url).xml.toJSON());
		SpriteRepository.load(ResourceLoader.temporal(url).xml.toJSON());
	}
};

function loadModules(modules) {
	for ( var index = 0; index < modules.length; index++) {
		var module = modules[index];
		eval(ResourceLoader.temporal(module['@atts'].url).text);
	}
}
