//Movement mixins

//Entity can move to unblocked squares
//Takes argument in absolute coordinates to current position
// Game.Mixins.AbsMoveable = {
// 	name : 'AbsMoveable',
// 	groupName : 'Moveable',
// 	tryMove: function(x,y) {
// 		var tile = map.getTile(x,y);
// 		if (tile.isWalkable() && !this._map.getEntityAt(x,y)) {
// 			this._x = x;
// 			this._y = y;

// 			if (this._playercontrolled) {
// 				this.getMap().getEngine().unlock();
// 			}

// 			return true;
// 		}
// 		else { return false;}
// 	}
// };

//Balance statistic that governs whether various actions can be used
Game.Mixins.Balanced = {
	name : 'Balanced',
	groupName : 'Balanced',
	init : function(properties) {
		this._mbal = properties['mbal'] || 5; //Max balance
		this._cbal = properties['cbal'] || 5; //Current balance
	},
	getBalance : function() {
		return this._cbal;
	},
	setBalance : function(balance) {
		this._cbal = balance;
	},
	changeBalance : function(reduction) {
		var bal = Math.max(0,this._cbal-reduction);
		this._cbal = Math.min(this._mbal, bal);
			if (this._cbal == 0) {
				this.raiseEvent('onTrip');
				Game.sendMessage(this, "You fall over");
			}
			if (this._cbal == 1) {
				Game.sendMessage(this, "Your intricate dance is getting your legs into quite a tangle");
			}

	},
	listeners : {
		onAction : function(bal_cost) {
			this.changeBalance(bal_cost);
		},
		onGetUp : function() {
			Game.sendMessage(this,'You stand on shaking legs, steadying yourself to step once more.');
			this.setBalance(2);
		},
		onTakeDamage : function(damage, bal_damage) {
			this.changeBalance(bal_damage);
		}
	}
};

//Coordinates are relative to current position and direction
//'Fpsmove' direction is relative to current directin
//'RogueMove' direction is absolute
Game.Mixins.DirectionMoveable = {
	name : 'DirectionMoveable',
	groupName : 'Moveable',
	init : function(properties) {
		var dx = properties['x_dir'] || 1;
		var dy = properties['y_dir'] || -1;

		this._standing = true; //Can't move if lying on the ground
		
		this._turnMode = 0;
		this._direction = v2d(dx,-dy);
		this._olddirection = this._direction;
		this._chararray = properties['chararray'] || Game.Chars.SingleArrows;
		this._char = this._chararray[this._direction];
	},
	getChar : function() {
		return this._chararray[this._direction];
	},

	canMoveTo : function(x,y) {
	if (Math.max(Math.abs(this.getX()-x),Math.abs(this.getY()-y))>1) {
		return false;
	}
		return this.canOccupy(x,y);
	},
	
	turn : function(direction,temp) {
		if (this._standing) {
			this._direction = direction;
			if (!temp) {
				this._olddirection = this._direction;
			}
			return true;
		} else {
			return false;
		}
	},

	// Move to position x, y, dir
	tryMoveTo : function(x, y, rel_dir, final_dir) {

		if (this.canMoveTo(x,y)) {
			// this.getMap().getEngine().lock();
			// var unlock;
			// unlock = this.getMap().getEngine().unlock;
			// setTimeout(unlock, 3000);
			this.turn(final_dir,0);

			if (!this._standing) {
				this.raiseEvent('onGetUp')
				return false;
			} else {
				var bal_loss = Math.min(1,mod(rel_dir,7)-1);
				this.raiseEvent('onAction',bal_loss);
				this._x = x;
				this._y = y;
				return true;
			}
			
		} else {
			return false;
		}
		
	},

	tryAutoMoveTo : function(x,y) {
		var dx = x-this.getX();
		var dy = y-this.getY();
		console.log("automove" + dx + ", " + dy);
		var final_dir = v2d(dx,-dy);
		console.log(final_dir);
		return this.tryMoveTo(x,y,0,final_dir);
	},
	
	tryWait : function(final_dir) {
		if (!this._standing) {
			this.raiseEvent('onGetUp');
		} else {
			this.raiseEvent('onAction',-2);
			this._direction = final_dir;
			this._olddirection = final_dir;
		}
		return true;
	},

	fpsMove : function(dx,dy) {

		if (dx == 0 && dy == 0) {
			return this.tryWait(this._direction, this.getMap());
		}


		var rel_dir = v2d(dx,dy);
		var move_dir = mod(this._direction-rel_dir,8);
		var move_vec = d2v(move_dir);
		var x = move_vec[0]+this.getX();
		var y = move_vec[1]+this.getY();

		return this.tryMoveTo(x, y, rel_dir, this._direction, this.getMap());

	},


	kbMove: function(dx,dy,noturn) {


		if (this._turnMode) {
			this._turnMode = 0;
			final_dir = v2d(dx,-dy);
			return this.tryWait(final_dir, this.getMap());
		}

		if (dx == 0 && dy == 0) {
			return this.tryWait(this._direction, this.getMap());
		}

		var x = this.getX() + dx;
		var y = this.getY() + dy;
		
		if (!noturn) {
			var final_dir = v2d(dx,-dy);
			var rel_dir = 0;
		} else {
			var final_dir = this._direction;
			var rel_dir = mod(this._direction - v2d(dx,-dy),8);
		}

		return this.tryMoveTo(x, y, rel_dir, final_dir, this.getMap());

	},

	listeners : {
		onTrip : function() {
			this._standing = false;
		},
		onGetUp : function() {
			this._standing = true;
		},

	}
};
