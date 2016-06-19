// Animations


Game.Mixins.PreviewSpawner = {
	name : "PreviewSpawner",
	groupName : "PreviewSpawner",

	init : function() {
		this._previews = [];
	},
	spawnPreview : function(x,y,ch) {
		var prev = new Game.Entity(Game.PreviewTemplate);
		prev.setChar(ch);
		prev.setX(x);
		prev.setY(y);
		this.getMap().addEntity(prev);
		this._previews.push(prev);
	},
	clearPreviews : function() {
		for (var i=0; i<this._previews.length; i++) {
			this.getMap().removeEntity(this._previews[i]);
		}
		this._previews=[];
	},
	previewCurrentAbility : function() {
		var ability = this._abilities[this._currentability];
		var targets = ability.getTargets(this);
		for (var i=0; i<targets.length; i++) {
			var ent = this.getMap().getEntityAt(targets[i][0],targets[i][1]);
			if (ent) {
				var ch = ent.getChar();
				this.spawnPreview(targets[i][0],targets[i][1],ch);
			} else {
				this.spawnPreview(targets[i][0],targets[i][1],'.');
			}
		}
	}
};



Game.AnimationPauseActor = function() {};


Game.AnimationPauseActor.prototype.act = function() {
	console.log('pausing');
	engine.lock();
	setTimeout(engine.unlock,500);
};







