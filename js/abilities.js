// Attacking abilities

Game.Attacks = {};

// Basic forward attack
Game.Attacks.AttackForward = {

	name : 'Basic Attack',
	balance_cost : 2,
	getTargets : function(user) {
		targets = [];
		var dir_v = d2v(user._direction);
		var target_x = user.getX()+dir_v[0];
		var target_y = user.getY()+dir_v[1];
		targets.push([target_x,target_y]);
		return targets;
	},
	missMessage : "You powerfully swing at the air but, sadly, you miss",
	weakMissMessage : "From the ground, you ineffectually swing at the air and miss",
	doHitMessage : "You whack the %s right in its face!",
	takeHitMessage : "The %s whomps you right on your beautiful nose!",
	doWeakHitMessage : "From the ground, you ineffectually flail in the %s's direction",
	takeWeakHitMessage : "The sprawled %s swipes at you menacingly"
}

Game.Attacks.SweepAttack = {
	name : 'Sweep Attack',
	balance_cost : 3,
	getTargets : function(user) {
		targets = [];
		var dir1_v = d2v(user._direction);
		var dir2_v = d2v(user._direction-1);
		var target1_x = user.getX()+dir1_v[0];
		var target1_y = user.getY()+dir1_v[1];
		var target2_x = user.getX()+dir2_v[0];
		var target2_y = user.getY()+dir2_v[1];
		targets.push([target1_x,target1_y]);
		targets.push([target2_x,target2_y]);
		return targets;
	},
	missMessage : "You powerfully swing at the air but, sadly, you miss",
	weakMissMessage : "From the ground, you ineffectually swing at the air and miss",
	doHitMessage : "You whack the %s right in its face!",
	takeHitMessage : "The %s whomps you right on your beautiful nose!",
	doWeakHitMessage : "From the ground, you ineffectually flail in the %s's direction",
	takeWeakHitMessage : "The sprawled %s swipes at you menacingly"
}
