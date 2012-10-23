var Fps = ModelObject.extend(new (function() {
	var currentFps = 0, frameCount = 0, lastFps = new Date().getTime();
	this.update = function($mouse) {
		this.x = $mouse.x;// this.pos.random();
		this.y = $mouse.y;// this.pos.random();
		var thisFrame = new Date().getTime();
		var diffTime = Math.ceil((thisFrame - lastFps));
		if (diffTime >= 1000) {
			currentFps = frameCount;
			frameCount = 0.0;
			lastFps = thisFrame;
		}

	};
	this.init = function($super) {
		$super({
			pass : 0,
			draw : function(ctx, x, y) {
				ctx.save();
				ctx.fillStyle = '#000';
				ctx.font = 'bold 12px sans-serif';
				ctx
						.fillText('FPS: ' + currentFps + ' - ' + (this.pass++),
								x, y);
				ctx.restore();
				frameCount += 1;
			}
		});
		this.pos = [ 10, 50, 35, 80, 300, 298, 403, 493 ];
	};
}));

FPSModule = Module.extend(new (function() {
	this.installOn = function(moduleManager) {
		this.fpsManager = new Fps();
		Ph.addObject(this.fpsManager);
	};

}));

// -----------------------------------------DEBUGGER--------------------------------------------------
