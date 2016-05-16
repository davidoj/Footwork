// Attacking abilities



Game.Abilities = {};

// Basic forward attack
Game.Abilities.AttackForward = {

	name : 'AttackForward',

	use : function(user) {
		var dir_v = d2v(user._direction);
		var target_x = user.getX()+dir_v[0];
		var target_y = user.getY()+dir_v[1];

		var target = user.getMap().getEntityAt(target_x,target_y);
		
		if (target && target.hasMixin('Destructible')) {
			Game.sendMessage(user, 'You whack the %s right in its face!', [target.getName()]);
			Game.sendMessage(target, 'The %s womps you right on your nose!', [user.getName()]);
			target.takeDamage(user.getDamage());
		}
		else {
			Game.sendMessage(user, 'You fiercely swing at the air, but sadly you miss it.');
		}
	}
}
