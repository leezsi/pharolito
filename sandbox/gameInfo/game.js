PersonSprite = Class.extend(new (function() {
	this.init = function(model) {
		this.model = model;
	};
	this.draw = function(ctx, x, y) {
		var model = this.model;
		var sprite = SpriteRepository.get('person1');
		sprite.draw(ctx, {
			x : model.x,
			y : model.y
		});
	};
}));

WorldSprite = Class.extend(new (function() {
	this.draw = function(ctx, x, y) {
		var sprite = SpriteRepository.get('world');
		sprite.draw(ctx, {
			x : 0,
			y : 0,
			width : 500,
			height : 500
		});
	};
}));

Person = GameObject.extend(new (function() {

	this.init = function($super) {
		$super(new PersonSprite(this));
	};
	this.update = function($keyword) {
		if ($keyword.isPressed(KW_left)) {
			this.x = Math.max(0, this.x - 10);
		}
		if ($keyword.isPressed(KW_right)) {
			this.x = Math.min(500, this.x + 10);
		}
		if ($keyword.isPressed(KW_down)) {
			this.y = Math.min(500, this.y + 10);
		}
		if ($keyword.isPressed(KW_up)) {
			this.y = Math.max(0, this.y - 10);
		}
	};
}));

MousePerson = GameObject.extend(new (function() {

	this.init = function($super) {
		$super(new PersonSprite(this));
		this.layer = 1;
	};
	this.update = function($mouse) {
		if ($mouse.isPressed) {
			this.x = $mouse.x;
			this.y = $mouse.y;
		}
	};
}));

RandomPerson = GameObject.extend(new (function() {
	this.init = function($super) {
		$super(new PersonSprite(this));
		this.layer = 1;
	};
	this.update = function() {
		switch (Math.floor((Math.random() * 50 - 1) / 10 + 1)) {
		case 1:
			this.x = Math.max(0, this.x - 30);
			break;
		case 2:
			this.x = Math.min(500, this.x + 30);
			break;
		case 3:
			this.y = Math.min(500, this.y + 30);
			break;
		case 4:
			this.y = Math.max(0, this.y - 30);
			break;
		}
	};
}));

World = GameObject.extend(new (function() {
	this.init = function($super) {
		$super(new WorldSprite());
	};
}));

Ph.addObject(new World());
Ph.addObject(new Person());
Ph.addObject(new MousePerson());
