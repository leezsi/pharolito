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
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
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

Person = Class.extend({
	init : function(name) {
		this.name = name;
	},
	say : function() {
		i("I'm " + this.name);
	}
});

Pirate = Person.extend({
	init : function($super, name, type) {
		$super(name);
		this.type = type;
	},
	say : function($super) {
		i("I'm a " + this.type + ' pirate, yarr');
	}
});

GoodPirate = Pirate.extend({
	init : function($super, name) {
		$super(name);
		this.type = 'good';
	}
});

p=new Person('leandro');
pp=new Pirate('lucas','bad');
ppp=new GoodPirate('luciano');