
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

		this.reduceBalance(ability.balance_cost);
		
		for (i=0; i<targets.length; i++) {
			target = this.getMap().getEntityAt(targets[i][0],targets[i][1]);
			if (target && target.hasMixin('Destructible')) {
				Game.sendMessage(this, doMessage, [target.getName()]);
				Game.sendMessage(target, takeMessage, [this.getName()]);
				target.takeDamage(damage);
				if (target.hasMixin('Balanced')) {
					target.reduceBalance(bal_damage);
				}
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




