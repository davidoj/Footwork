// Entity mixins


Game.Mixins = {};

//Movement

//Entity can move to unblocked squares
//Takes argument in coordinates relative to current position
Game.Mixins.RelMoveable = {
	name : 'RelMoveable',
	groupName : 'Moveable',
	tryMove: function(dx,dy,map) {
		var x = this.getX() + dx;
		var y = this.getY() + dy;
		var tile = map.getTile(x,y);
		var target = this._map.getEntityAt(x,y);
		
		if (target && target !== this) {
			return false;
		} else if (tile.isWalkable()) {
	
			if (this._playercontrolled) {
				this._map.getEngine().unlock();
				this.clearMessages()
			}

			this._x = x;
			this._y = y;

			return true;
		} else { return false;}
	}
}

//Entity can move to unblocked squares
//Takes argument in absolute coordinates to current position
Game.Mixins.AbsMoveable = {
	name : 'AbsMoveable',
	groupName : 'Moveable',
	tryMove: function(x,y,map) {
		var tile = map.getTile(x,y);
		if (tile.isWalkable() && !this._map.getEntityAt(x,y)) {
			this._x = x;
			this._y = y;

			if (this._playercontrolled) {
				this._map.getEngine().unlock();
			}

			return true;
		}
		else { return false;}
	}
}


//Entity has direction given by angle in "eighthians" (8 eighthians = 2PI radians)
//Movement for directional entities is FPS based - i.e. w goes forwards, whichever way that is
Game.Mixins.DirectionMoveable = {
	name : 'DirectionMoveable',
	groupName : 'Moveable',
	init : function(properties) {
		var x = properties['x_dir'] || 1;
		var y = properties['y_dir'] || -1;

		this._mbal = properties['mbal'] || 5; //Max balance
		this._cbal = properties['cbal'] || 5; //Current balance
		this._bal_penalty = properties['bal_penalty'] || 0; //Balance penalty

		this._direction = v2d(x,-y);
		this._olddirection = this._direction;
		this._chararray = properties['chararray'] || Game.Chars.SingleArrows;
		this._char = this._chararray[this._direction];
	},	
	turn : function(x,y) {
		this._direction = v2d(x,-y);
		this._char = this._chararray[this._direction];
		var deg = degree(this._olddirection,this._direction);
		this._bal_penalty = Math.min(2,deg);
	},

	tryMove : function(dx,dy,map) {

		if (this._playercontrolled) {
			this._map.getEngine().unlock();
		}

		if (dx == 0 && dy == 0) {
			this._cbal = Math.min(this._mbal,this._cbal+2);
			this._olddirection = this._direction;
			this._bal_penalty = 0;
			return true;
		}

		var movedir = v2d(dx,dy);
		var absdir = mod(this._direction-movedir,8);
		var movevec = d2v(absdir);
		var x = movevec[0]+this.getX();
		var y = movevec[1]+this.getY();
		var tile = map.getTile(x,y);
		var target = this._map.getEntityAt(x,y);

		if (tile.isWalkable() && (!target || target == this)) {

			this._cbal = this._cbal-this._bal_penalty;
			this._olddirection = this._direction;
			this._bal_penalty = 0;

			if (this._cbal <= 0) {
				Game.sendMessage(this,'You stand on your trembling legs, readying yourself to move once more.');
				this._cbal = 2;
				return true;
			} else {
				var bal_loss = Math.min(1,movedir);
				this._cbal = Math.max(0,this._cbal-bal_loss);
				this._x = x;
				this._y = y;
			}
			
		} else {
			return false;
		}
	}
}




//Actor



//Player version of the Actor mixin
Game.Mixins.PlayerActor = {
	name : 'PlayerActor',
	groupName : 'Actor',
	act : function() {
		Game.refresh();
		this.getMap().getEngine().lock();
	}
}

//Takes random steps around the map
Game.Mixins.RandomWalkerActor = {
	name : 'MonsterActor',
	groupName : 'Actor',
	act : function() {
		var x = Math.round(2*Math.random())-1;
		var y = Math.round(2*Math.random())-1;
		this.tryMove(x,y,this._map);
	}
}





//Combat



//Use attacking abilities
Game.Mixins.AbilityUser = {
	name : 'AbilityUser',
	init : function(properties) {
		this._dmg = properties['dmg'] || 1; //Attack damage
		var abilities = properties['abilities'] || [Game.Abilities.AttackForward];

		this._abilities = {};
		this._currentability = properties['currentability'] || ['AttackForward'];
		for (var i=0; i<abilities.length; i++) {
			this.addAbility(abilities[i]);
		}
	},
	setDamage : function(damage) {
		this._dmg = damage;
	},
	getDamage : function() {
		return this._dmg;
	},
	addAbility : function(ability) {
		this._abilities[ability.name] = ability;
	},
	hasAbility : function(obj) {
		if (typeof obj === 'object' && this._abilities[obj.name]) {
			return true;
		}
		else if (this._abilities[obj]) {
			return true;
		}
		else {
			return false;
		}
	},
	useCurrentAbility : function() {
		this._abilities[this._currentability].use(this);
		
		if (this._playercontrolled) {
			this._map.getEngine().unlock();
			this.clearMessages();
		}
			
	}
		
}

//Take damage
Game.Mixins.Destructible = {
	name : 'Destructible',

	init : function(properties) {
		this._mhp = properties['mhp'] || 1; //Max hitpoints
		this._chp = properties['chp'] || this._mhp; //Current hitpoints
	},
	takeDamage : function(damage) {
		this._chp -= damage;
		if (this._chp <= 0) {
			this.die();
		}
	},
	die : function() {
		this.getMap().removeEntity(this);
	}
}




//Messaging


Game.Mixins.MessageRecipient = {
	name : "MessageRecipient",
	groupName : "MessageRecipient",

	init : function(properites) {
		this._messages = [];
	},
	receiveMessage : function(message) {
		this._messages.push(message);
	},
	getMessages : function() {
		return(this._messages);
	},
	clearMessages : function() {
		this._messages = [];
	}
}







