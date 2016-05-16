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
			console.log('hit!');
			target.takeDamage(user.getDamage());
		}
		else {
			console.log('miss!');
		}
	}
}
