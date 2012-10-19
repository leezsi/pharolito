var PHAROLITO_RELATIVE = '../trunk/';
var PHAROLITO_SPRITE_IMAGE_REPOSITORY = 'sprites/';
var TRANSPARENT_PIXEL_COLOR = {
	r : 32,
	g : 156,
	b : 0
};
// ---------------------------------------BASIC_TYPES----------------------------------
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
Function.prototype.empty = function() {
	return function() {
	};
};
Function.prototype.params = function() {
	var toParse = this.toString().match(
			new RegExp("\\([\\w\\,\\$\\s]*\\)", "g")).shift();
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
	}.promise();
	var request = new factory();
	var $success = $execute = $errors = undefined;
	var self = this;
	function config() {
		request.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					($execute || $success || Function.empty())
							.invokeSellecting({
								$text : request.responseText,
								$xml : request.responseXML,
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

function URI(uri) {
	this.uri = uri;
	this.parts = uri.split('/');
	var tmp = this.parts[this.parts.length - 1].split('.');
	this.name = tmp[0];
	this.domain = tmp[1];
}

function contextulizedFunction(callback) {
	return function() {
		var args = $S(arguments);
		return callback.apply(args.shift(), args);
	};
}

function SuperObject(thisObject, proto) {
	this.thisObj = thisObject;
	this.proto = proto;
	for ( var prop in proto) {
		if (prop !== 'toString')
			this[prop] = contextulizedFunction(proto[prop]);
	}
}
function ProtoObjectClass() {
	this.initialize = function() {
	};

};

var Class = new (function() {
	this.addMethods = function(thisObject, superObject, bundle) {
		for ( var prop in bundle) {
			var tmp = bundle[prop];
			if (!thisObject[prop]) {
				thisObject[prop] = tmp;
			} else {
				thisObject[prop] = wrapperSuperFunction(thisObject,
						superObject, tmp);
			}
		}
	};
	this.create = function(superclass, subclassBehaviour) {
		var proto = new superclass;
		var subclass = function() {
			this.superclass = superclass;
			var superObj = new SuperObject(this, proto);
			Class.addMethods(this, superObj, subclassBehaviour);
			this.initialize.apply(this, $S(arguments));
		};
		subclass.prototype = proto;
		subclass.$class = subclass;
		subclass.prototype.constructor = subclass;
		return subclass;
	};
})();
// ------------------------------------VIEW---------------------------------------------
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

		// write pixel data to destination context
		ctx.putImageData(pixels, posX, posY);
		// ctx.drawImage(this.image, sx, sy, swidth, sheight, posX, posY,
		// this.width, this.height);
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
		} else if (text.test(/\{.*\}/g)) {
			var toEval = text.substring(1, text.length - 1).replace(/\$/g,
					"self.");
			eval('self.' + prop + '=(' + toEval + ')');
		}
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
}

// ------------------------------------MODELING----------------------------------------

ModelObject = Class.create(ProtoObjectClass, {
	initialize : function(spriteID) {
		this.sprite = SpriteRepository.findByName(spriteID);
		this.internalInitialize();
	},
	internalInitialize : function() {
		this.x = 0;
		this.y = 0;
	},
	update : function() {

	},
	draw : function(ctx) {
		this.sprite.draw(ctx, this.x, this.y);
	}
});

// -------------------------------BASIC_ANIMATION-------------------------------------
SpriteRepository.loadSprites(PHAROLITO_SPRITE_IMAGE_REPOSITORY + 'anime.xml');
function c() {
	c = document.getElementById('can').getContext('2d');
}
function begin() {
	p = SpriteRepository.findByName('person1');
	p2 = SpriteRepository.findByName('person2');
	c();
	y = 0;
	setInterval(ani, 100);
}
function ani() {
	c.clearRect(0, 0, 500, 500);
	p.draw(c, 40, y);
	p2.draw(c, 40, 500 - y);
	y = y + 10;
	p.nextStep('goDown');
	p2.nextStep('goUp');
}
