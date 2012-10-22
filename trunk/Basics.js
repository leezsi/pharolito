var Fps = ModelObject.extend(new (function() {

	this.start = function() {
		this.currentFps = 0, frameCount = 0, lastFps = new Date().getTime();
	};
	this.update = function() {
		var thisFrame = new Date().getTime();
		var diffTime = Math.ceil((thisFrame - lastFps));
		if (diffTime >= 1000) {
			this.currentFps = frameCount;
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
				ctx.fillText('FPS: ' + this.currentFps + ' - ' + (this.pass++),
						10, 15);
				ctx.restore();
				frameCount += 1;
			}
		});
	};
}));

FPSModule = Module.extend(new (function() {
	this.installOn = function(moduleManager) {
		this.fpsManager = new Fps();
		Ph.addObject(this.fpsManager);
		moduleManager.addHook('started', this);
	};
	this.started = function() {
		this.fpsManager.start();
	};
}));
// Ph.loadModule(new FPSModule());
new FPSModule();

// -----------------------------------------DEBUGGER--------------------------------------------------
