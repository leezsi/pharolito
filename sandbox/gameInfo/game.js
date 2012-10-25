PersonSprite = Class.extend(new (function() {
	this.init = function(model) {
		this.model = model;
		this.sprite = SpriteRepository.get('person1');
	};
	this.draw = function(ctx, x, y) {
		i(this);
		this.sprite.nextStep(this.model.state);
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
		this.id='original';
	};
})());
var pos = [ 'goLeft', 'goRight', 'goUp', 'goDown' ];

RandomPerson = Person.extend(new (function() {
	this.init = function($super,id) {
		$super(new PersonSprite(this));
		this.state = 'goLeft';
		this.id=id;
	};

	this.update = function() {
		var rand = pos.random();
		switch (rand) {
		case 'goLeft':
			if (this.x > 0)
				this.x = Math.max(this.x - 10, 0);
			break;
		case 'goRight':
			if (this.x < 500)
				this.x = Math.min(this.x + 10, 500);
			break;
		case 'goUp':
			if (this.y > 0)
				this.y = Math.max(this.y - 10, 0);
			break;
		case 'goDown':
			if (this.y < 500)
				this.y = Math.min(this.y + 10, 500);
		}

		this.state = rand;
	};
})());
per = new Person();
Ph.addObject(per);

for ( var index = 0; index < 100; index++) {
	Ph.addObject(new RandomPerson(index));
}
