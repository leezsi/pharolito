var Fps = ModelObject.extend(new (function() {
	this.currentFps = 0, frameCount = 0, lastFps = new Date().getTime();
	this.update = function() {
		var thisFrame = new Date().getTime();
		var diffTime = Math.ceil((thisFrame - lastFps));
		if (diffTime >= 1000) {
			this.currentFps = frameCount;
			frameCount = 0.0;
			lastFps = thisFrame;
		}
	};
	this.view = {
		pass : 0,
		draw : function(ctx, x, y) {
			ctx.save();
			ctx.fillStyle = '#000';
			ctx.font = 'bold 12px sans-serif';
			ctx.fillText('FPS: ' + this.currentFps + ' - ' + (this.pass++), 10,
					15);
			ctx.restore();
			frameCount += 1;
		}
	};
}));

FPSModule = Module.extend(Module, {
	init:function(){
		i(this);
	},
	installOn : function(moduleManager) {
		Ph.addObject(new Fps());
		moduleManager.addHook('started', this);
		moduleManager.addHook('stoped', this);
	},
	started : function() {
		this.fpsManager = new Fps();
		Ph.addObject(this.fpsManager);
	},
	stopped : function() {
		Ph.removeObject(this.fpsManager);
	}
});
//Ph.loadModule(new FPSModule());
new FPSModule();


//-----------------------------------------DEBUGGER--------------------------------------------------
