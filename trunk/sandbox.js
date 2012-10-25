var PHAROLITO_RELATIVE = '../trunk/';
DEFAULT_SPRITE_IMAGE_REPOSITORY = 'sprites/';
DEFAULT_GAME_REPOSITORY = 'gameInfo/';

String.prototype.selfTemplate = function(regExp) {
	if (this.test(regExp)) {
		return this.substring(1, this.length - 1).replace(/\$/g, "self.");
	} else {
		return this;
	}
};

String.prototype.test = function(regexp) {
	return regexp.test(this);
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
(function() {
	if (HTMLElement.prototype.addEventListener) {
		HTMLElement.prototype.$addEventListener = HTMLElement.prototype.addEventListener;
	} else {
		HTMLElement.prototype.$addEventListener = HTMLElement.prototype.attachEvent;
	}
	HTMLElement.prototype.$removeEventListener = HTMLElement.prototype.removeEventListener
			|| HTMLElement.prototype.detachEven;
})();

HTMLElement.prototype.addEventListener = function(type, listener) {
	if (this.$addEventListener.name = 'addEventListener') {
		return this.$addEventListener(type, listener, true);
	} else {
		return this.$addEventListener('on' + type, listener);
	}
};
HTMLElement.prototype.removeEventListener = function(type, listener) {
	return this.$removeEventListener(type, listener);
};
function i(a, $super, su$per) {
	console.info(a);
}

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

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------

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

SpriteRepository = new (Class.extend(new (function() {

	var sprites = {};

	this.load = function(root) {
		var img = root.getAttribute('image');
		ImageRepository.loadImageOnce(img.toURI().name, img);
		var spritesDefinition = root.getElementsByTagName('sprite');
		for ( var index = 0; index < spritesDefinition.length; index++) {
			var current = spritesDefinition[index];
			sprites[current.getAttribute('name')] = new Sprite(current,
					ImageRepository.get(img.toURI().name), index);
		}
	};

	this.get = function(name) {
		return sprites[name];
	};

})()))();

Step = Class.extend(new (function() {
	this.init = function(step, sprite) {
		this.image = sprite.image;
		this.offsetX = sprite.x;
		this.offsetY = sprite.y;
		this.width = sprite.width / sprite.columns;
		this.height = sprite.height / sprite.rows;
		this.y = step.getAttribute('row').toInt();
		this.x = step.getAttribute('column').toInt();
	};
	this.draw = function(ctx, posX, posY) {
		ctx.drawImage(this.image, this.offsetX + ((this.x - 1) * this.width),
				this.offsetY + ((this.y - 1) * this.height), this.width,
				this.height, posX, posY, this.width, this.height);
	};
})());

Sprite = Class
		.extend(new (function() {
			function setProperty(node, image, property, index, width, height) {
				var val = null;
				eval('val= ' + node.getAttribute(property));
				return val;
			}

			this.animations = {};
			var indexes = {};

			this.init = function(definition, img, index) {
				this.cDefinition = definition;
				this.cIndex = index;
				this.rows = definition.getAttribute('rows').toInt();
				this.columns = definition.getAttribute('columns').toInt();
				this.image = img;
				var bounds = definition.getElementsByTagName('bounds')[0];
				this.width = setProperty(bounds, this.image, 'width', index);
				this.height = setProperty(bounds, this.image, 'height', index);
				this.x = setProperty(bounds, this.image, 'x', index,
						this.width, this.height);
				this.y = setProperty(bounds, this.image, 'y', index,
						this.width, this.height);
				this.makeAnimations(definition
						.getElementsByTagName('animations')[0]
						.getElementsByTagName('animation'));
			};
			var toDraw = null;
			this.makeAnimations = function(definitions) {
				for ( var index = 0; index < definitions.length; index++) {
					var animation = definitions[index];
					var currentAnimation = this.animations[animation
							.getAttribute('name')] = [];
					var steps = animation.getElementsByTagName('step');
					for ( var i = 0; i < steps.length; i++) {
						var step = steps[i];
						var inst = new Step(step, this);
						currentAnimation.push(inst);
						if (step.getAttribute('default')) {
							toDraw = inst;
						}
					}
				}
			};
			this.nextStep = function(selector) {
				var tmpIdx = (indexes[selector]++);
				if (tmpIdx == this.animations[selector].length)
					indexes[selector] = tmpIdx = 0;
				toDraw = this.animations[selector][tmpIdx];
			};

			this.draw = function(ctx, posX, posY) {
				toDraw.draw(ctx, posX, posY);
			};

			this.clone = function() {
				return new Sprite(this.cDefinition, this.image, this.cIndex);
			};

		}));
