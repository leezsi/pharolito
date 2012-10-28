PersonSprite = Class.extend(new (function() {
	this.init = function(model) {
		this.model = model;
	};
	this.draw = function(ctx, x, y) {
		var model = this.model;
		SpriteRepository.get('person1').draw(ctx, {
			x : model.x,
			y : model.y,
			width : 50,
			height : 50
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

RandomPerson = GameObject.extend(new (function() {
	this.init = function($super) {
		$super(new PersonSprite(this));
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
Ph.addObject(new Person());
