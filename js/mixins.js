// Entity mixins

Game.Mixins = {};

//Actor

//Player version of the Actor mixin
Game.Mixins.PlayerActor = {
	name : 'PlayerActor',
	groupName : 'Actor',
	init : function() {
		this._actions = [];
	},
	act : function() {
		Game.refresh();
		if (!this.takeNextAction()) {
			this.getMap().getEngine().lock();
		}
	},
	takeNextAction : function() {
		if (this._actions.length) {
			var action = this._actions.pop();
			action.call(this);
			return true;
		} else {
			return false;
		}
	},
	queueAction : function(action) {
		this._actions.push(action);
	},
	getControl : function(ch) {
		return this.controls[ch];
	},
	setControls : function(controls) {
		this.controls = controls;
	}
}



