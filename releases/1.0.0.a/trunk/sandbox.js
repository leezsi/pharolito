function pharolitoConfigs() {
	ViewPort = new (function() {

		var width = 500;// t(configs, 'bounds').getAttribute('width').toInt();
		var height = 500;// t(configs,
		// 'bounds').getAttribute('height').toInt();

		function createCanvas(width, height) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			return canvas;
		}
		var main = createCanvas(width, height);

		function getContext(width, height) {
			return createCanvas(width, height).getContext('2d');
		}

		this.canvas = main.getContext('2d');
		this.buffer = getContext(width, height);

		document.getElementById('gameHolder').appendChild(main);

		this.clean = function() {
			 this.canvas.clearRect(0, 0, width, height);
			 this.buffer.clearRect(0, 0, width, height);
		};

		this.draw = function(obj) {
			 obj.draw(this.buffer);
		};

		this.show = function() {
            this.canvas.drawImage(this.buffer.canvas,0,0);
		};

	});
}