
//Combat

//Use attacking abilities
Game.Mixins.Attacker = {
	name : 'Attacker',
	init : function(properties) {
		this._dmg = properties['dmg'] || 1; //Attack damage
		var abilities = properties['abilities'] || [Game.Attacks.AttackForward];

		this._abilities = {};
		this._currentability = properties['currentability'] || abilities[0].name;
		for (var i=0; i<abilities.length; i++) {
			this.addAbility(abilities[i]);
		}
	},
	setDamage : function(damage) {
		this._dmg = damage;
	},
	getDamage : function() {
		if (this.getBalance() + 0.5 > Math.random()) {
			return this._dmg;
		} else {
			return 0;
		}
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
		var ability = this._abilities[this._currentability];
		var targets = ability.getTargets(this);
		var hit = false;

		var damage = this.getDamage();
		var bal_damage = damage;
		if (damage) {
			var doMessage = ability.doHitMessage;
			var takeMessage = ability.takeHitMessage;
			var missMessage = ability.missMessage;
		} else {
			var doMessage = ability.doWeakHitMessage;
			var takeMessage = ability.takeWeakHitMessage;
			var missMessage = ability.weakMissMessage;
		}

		this.raiseEvent('onAction',ability.balance_cost);
		
		for (i=0; i<targets.length; i++) {
			target = this.getMap().getEntityAt(targets[i][0],targets[i][1],this.getZ());
			if (target && target.hasMixin('Destructible')) {

				if (target.hasMixin('Shielded')) {
					var prot = target.getProtectedTiles();
					for (var j=0; j<prot.length; j++) {
						console.log('prot: ' + prot[j][0] + ', ' + prot[j][1]);
						console.log('this: ' + this.getX() + ', ' + this.getY());
						if (target.getMap().getEntityAt(prot[j][0],prot[j][1],target.getZ())==this) {
							doMessage = "Your hopeful strike glances of the %s's shield";
							takeMessage = "The %s fiercely strikes your shield with furious determination";
							damage = 0;
						}
					}
				}

				Game.sendMessage(this, doMessage, [target.getName()]);
				Game.sendMessage(target, takeMessage, [this.getName()]);
				target.takeDamage(damage,bal_damage);
				hit = true;
			}
		}
		
		if (!hit) {
			Game.sendMessage(this, missMessage);
		}

		ability.sideEffects(this);
		
	},
	readyNextAbility : function() {
		var abilities = Object.keys(this._abilities);
		var idx = abilities.indexOf(this._currentability);
		this._currentability = abilities[mod(idx+1,abilities.length)];
	},
};

//Take damage
Game.Mixins.Destructible = {
	name : 'Destructible',

	init : function(properties) {
		this._mhp = properties['mhp'] || 1; //Max hitpoints
		this._chp = properties['chp'] || this._mhp; //Current hitpoints
	},
	takeDamage : function(damage, bal_damage) {
		this._chp -= damage;
		if (this._chp <= 0) {
			this.die();
		}
		this.raiseEvent('onTakeDamage',damage,bal_damage);
		
	},
	die : function() {
		this.getMap().removeEntity(this);
	}
};


//Protected by a shield in some directions
Game.Mixins.Shielded = {
	name : 'Shielded',
	groupName : 'Shielded',

	getProtectedTiles : function() {
		var vec = d2v(this._direction);
		var prot = [this.getX()+vec[0],this.getY()+vec[1]];
		return [prot];
	}
}
