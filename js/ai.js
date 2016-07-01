


//Takes random steps around the map
//Attack player if adjacent
Game.Mixins.RandomWalkerActor = {
	name : 'MonsterActor',
	groupName : 'NPActor',
	act : function() {
		console.log("Random walker moving");
		var ents = this.getMap().getEntitiesWithinRadius(this.getX(),this.getY(),1);
		for (var i=0;i<ents.length;i++) {
			if (ents[i].hasMixin('PlayerActor')) {
				var final_dir = v2d(ents[i].getX()-this.getX(),-(ents[i].getY()-this.getY()));
				if (this._direction == final_dir) {
					this.useCurrentAbility();
				}
				else {
					this.turn(final_dir,0);
				}
				return;
			}
		}
		var x = Math.round(2*Math.random())-1;
		var y = Math.round(2*Math.random())-1;
		this.fpsMove(x,y,this._map);
	}
}

//Charge towards the player if close enough
//Attak player if adjacent
Game.Mixins.ChargerActor = {
	name: 'ChargerActor',
	groupName: 'NPActor',
	act: function() {
		console.log("Reckless charger moving");
		var ents = this.getMap().getEntitiesWithinRadius(this.getX(),this.getY(),6);
		for (var i=0;i<ents.length;i++) {
			if (ents[i].hasMixin('PlayerActor')) {
				var final_dir = v2d(ents[i].getX()-this.getX(),-(ents[i].getY()-this.getY()));
				if (this.getDist(ents[i]) == 1) {
					if (this._direction == final_dir) {
						this.useCurrentAbility();
					} else {
						this.turn(final_dir,0);
					}
				}  else {
					this.turn(final_dir,0);
					this.fpsMove(1,0,this._map);
				}
			}
		}
	}
}


//Move to designated point

// Game.Mixins.MoveToPoint = {
// 	name: 'MoveToPoint',
// 	groupName: 'Pathfinder',
	
