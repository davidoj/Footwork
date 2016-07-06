


//Takes random steps around the map
//Attack player if adjacent
Game.Mixins.RandomWalkerActor = {
	name : 'MonsterActor',
	groupName : 'NPActor',
	act : function() {
		var ents = this.getMap().getEntitiesWithinRadius(this.getX(),this.getY(),1,this.getZ());
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
		var ents = this.getMap().getEntitiesWithinRadius(this.getX(),this.getY(),6,this.getZ());
		for (var i=0;i<ents.length;i++) {
			if (ents[i].hasMixin('PlayerActor')) {
				//console.log(this.getZ() + ' ' + ents[i].getZ());
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


//Walk to designated point
Game.Mixins.WalkToPoint = {
	name: 'MoveToPoint',
	groupName: 'Pathfinder',
	init : function() {
		this._pathPreview = [];
	},
	clearPath : function() {
		this._pathPreview = [];
	},
	addToPath : function(x,y) {
		this._pathPreview.push([x,y]);
	},
	findPathToPoint : function(x,y) {
		this.clearPath();
		var path = new ROT.Path.AStar(x,y,this.canOccupy.bind(this));
		path.compute(this.getX(),this.getY(),this.addToPath.bind(this));
	},
	tryWalkToPoint : function(x,y) {
		var tile = this.getMap().getTile(x,y);
		var disturb = this.getMap().getEntitiesWithinRadius(this.getX(),this.getY(),5,this.getZ());
		
		if (!tile.isWalkable() || disturb.length > 1) {
			Game.sendMessage(this,"Your journey is disturbed");
			return false;
		}
		this.findPathToPoint(x,y);
		if (this._pathPreview.length >= 2) {
			this.tryAutoMoveTo(this._pathPreview[1][0],this._pathPreview[1][1]);
			if (this._pathPreview.length > 2) {
				this.queueAction(partial(this.tryWalkToPoint,x,y));
			}
		} else {
			return false;
		}
	}
}
		
		
