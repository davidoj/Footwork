// Entity mixins

Game.Mixins = {};

//Actor

//Player version of the Actor mixin
Game.Mixins.PlayerActor = {
	name : 'PlayerActor',
	groupName : 'Actor',
	act : function() {
		Game.refresh();
		this.getMap().getEngine().lock();
		console.log("Player moving");
	},
	getControl : function(ch) {
		return this.controls[ch];
	},
	setControls : function(controls) {
		this.controls = controls;
	}
}
