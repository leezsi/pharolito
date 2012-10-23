PersonSprite = Class.extend(new (function() {
	this.intervalFPS = 20;
	this.currentFrame = 0;
	this.init = function(model) {
		this.model = model;
		this.sprite = SpriteRepository.findByName('person1');
		this.lastState = model.state;
	};
	this.draw = function(ctx, x, y) {
		if (this.currentFrame == this.intervalFPS) {
			this.sprite.nextStep(this.model.state);
			this.currentFrame = -1;
		}
		this.currentFrame++;
		this.sprite.draw(ctx, x, y);
	};
})());

Person = GameObject.extend(new (function() {
	this.update = function($keyword, $mouse) {

		if ($mouse.isPressed) {
			this.x = $mouse.x;
			this.y = $mouse.y;
		} else if ($keyword.isPressed(KW_left)) {
			this.state = 'goLeft';
			i('goLeft');
			if (this.x > 0)
				this.x = Math.max(this.x - 10, 0);
		} else if ($keyword.isPressed(KW_right)) {
			this.state = 'goRight';
			i('goRigth');
			if (this.x < 500)
				this.x = Math.min(this.x + 10, 500);
		} else if ($keyword.isPressed(KW_up)) {
			this.state = 'goUp';
			if (this.y > 0)
				this.y = Math.max(this.y - 10, 0);
		} else if ($keyword.isPressed(KW_down)) {
			this.state = 'goDown';
			if (this.y < 500)
				this.y = Math.min(this.y + 10, 500);
		}
	};
	this.init = function($super) {
		$super(new PersonSprite(this));
		this.state = 'goLeft';
	};
})());
per = new Person();
Ph.addObject(per);
// Ph.addObject(new Person());
