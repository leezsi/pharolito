var PHAROLITO_RELATIVE = '../trunk/';

// ----------------------------- UTILS -----------------------------------------

var getRequestAnimationFrame = function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame || function(callback) {
				window.setTimeout(enroute, 1 / 60 * 1000);
			};
};
Object.prototype.keys = function() {
	var keys = [];
	for ( var key in this) {
		keys.push(key);
	}
	return keys;
};

Object.prototype.getOfType = function(type, index) {
	var keys = this.keys();
	for ( var int = index || 0; int < keys.length; int++) {
		var ret = this[keys[int]];
		if (typeof ret == type)
			return ret;
	}
};
// -----------------------------------------------------------------------------
// ------------------------------ CORE -----------------------------------------
// -----------------------------------------------------------------------------

EventManager = {
	events : {},
	registerListener : function(event, listener) {
		if (!this.events[event])
			this.events[event] = [];
		this.events[event].push(listener);
	},
	removeListener : function(event, listener) {
		if (!this.events[event])
			this.events[event] = [];
		this.events[event] = this.events[event].without(listener);
	}
};

PhEvent = Class.create({
	type : 'event',
	raise : function() {
		var listeners = EventManager.events[this.type];
		for ( var index = 0; index < listeners.length; index++) {
			var listener = listeners[index];
			this.executeEventOn(listener);
		}
	},
	executeEventOn : function(listener) {

	}
});

PhException = Class.create(PhEvent, {
	type : 'exception',
	initialize : function() {
		this.message = arguments.getOfType('string');
		this.parent = arguments.getOfType('object');
	},
	raise : function() {
		throw this;
	}
});

PhPrimitives = {
	ajax : {
		create : function() {
			return new (this.ajaxFactory ? this.ajaxFactory
					: this.ajaxFactory = (XMLHttpRequest || ActiveXObject("Microsoft.XMLHTTP")))();
		},
		get : function(url, successCallback) {
			var request = this.create();
			request.onreadystatechange = function() {
				if (request.readyState == 4 && request.status == 200) {
					successCallback.call(this);
				}
			};
			request.open("GET", url, true);
			request.send();
		}
	},
	get : function(url) {
		return this.ajax.get(url);
	},
	loadModule : function get(name) {
		this.ajax.get(PHAROLITO_RELATIVE + name + '.js', function(text) {
			eval(this.responseText);
			PhPrimitives.configureModule(name);
			PhPrimitives.internalLoadModule(name);
		});
	},
	configureModule : function(name) {
		eval(name + '.configure(Ph)');
	},
	internalLoadModule : function(name) {
		eval(name + '.load(Ph)');
	},
	generatedID : -1,
	addObject : function(anObject) {
		anObject.id = this.generatedID++;
		anObject.index = this.gameObjects.push(anObject);
	},
	removeObject : function(anPhObject) {
		toRemoveGameObject.push(anPhObject.index);
	},
	eventRaised : function(event) {

	},
	gameObjects : [],
	toRemoveGameObject : [],
	preUpdateHooks : [],
	postUpdateHooks : []
};
Ph = (function() {

	var modules = {};
	// Game controller
	return new (function PhGameController() {
		this.registerModule = function(name) {
			modules[name] = PhPrimitives.retriveModule(name);
		};
		function createCanvasManager(placeholder, width, height) {
			canvasManager = new (function() {
				this.canvas = document.createElement('canvas');
				this.canvas.width = width;
				this.canvas.height = height;
				this.context = this.canvas.getContext('2d');
				var buffer = document.createElement('canvas');
				buffer.width = width;
				buffer.height = height;
				this.bufferContext = buffer.getContext('2d');
				placeholder.appendChild(this.canvas);
				this.canvas.addEvent('KeyDown', function(event) {
					console.info(event);
				});
			})();
		}
		function doGame() {
			for ( var i = 0; PhPrimitives.gameObjects.length; i++) {
				var object = PhPrimitives.gameObjects.length[i];
				object.update();
				object.draw();
			}
			getRequestAnimationFrame()(doGame);
		}
		this.start = function(options) {
			options = options ? options : {
				placeholder : document.body,
				width : 600
			};
			var placeholder = options['placeholder'] ? options['placeholder']
					: document.body;
			var width = options['width'] ? options['width'] : 600;
			var height = options['height'] ? options['height'] : width * 9 / 16;
			createCanvasManager(placeholder, width, height);
			// doGame();
		};

		this.addObject = function(anObject, colitionShape) {
			PhPrimitives.addObject(new PhObjectWrapper(anObject));
		};
		this.removeObject = function(anPhObject) {
			PhPrimitives.removeObject(anPhObject);
		};
	})();
})();

function PhObjectWrapper(target) {
	this.target = target;
}

PhKeyEvent = Class.create(PhEvent, {
	type : 'keyEvent',
	initialize : function(value) {
		this.value = value;
		console.info('tecla ' + this.value);
	},
	raise : function($super) {
		$super();
	},
	executeEventOn : function(listener) {
		listener['on' + this.type].call(listener, this.value);
	}
});
PhKeyDownEvent = Class.create(PhKeyEvent, {
	type : 'KeyDown',
	executeEventOn : function(listener) {
		listener.onKeyDown(this.value);
	}
});
// ---------------------------------------------------------------------------------------------------
