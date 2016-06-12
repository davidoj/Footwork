// Attacking abilities

Game.Attacks = {};

// Basic forward attack
Game.Attacks.AttackForward = {

	name : 'AttackForward',
	balance_cost : 2,
	getTargets : function(user) {
		targets = [];
		var dir_v = d2v(user._direction);
		var target_x = user.getX()+dir_v[0];
		var target_y = user.getY()+dir_v[1];
		targets.push([target_x,target_y]);
		return targets;
	},
	missmessage : "You powerfully swing at the air but, sadly, you miss.",
	dohitmessage : "You whack the %s right in its face!",
	takehitmessage : "The %s whomps you right on your beautiful nose!",
}
