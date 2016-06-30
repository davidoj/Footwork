
//Player template
Game.PlayerTemplate = {
	name : 'Mighty Hero',
	character : '↑',
	foreground : 'white',
	background : 'black',
	playercontrolled : true,
	mhp : 2,
	abilities: [Game.Attacks.ChargeAttack, Game.Attacks.SweepAttack],
	chararray: Game.Chars.SingleArrows,
	mixins : [Game.Mixins.Balanced,
			  Game.Mixins.DirectionMoveable,
			  Game.Mixins.PlayerActor, 
			  Game.Mixins.Attacker,
			  Game.Mixins.Destructible,
			  Game.Mixins.MessageRecipient,
			  Game.Mixins.PreviewSpawner]
}

//Walk randomly, hit player if adjacent
Game.ConfusedWandererTemplate = {
	name: 'Confused Wanderer',
	character: '⇑',
	foreground : 'white',
	background : 'black',
	chararray: Game.Chars.DoubleArrows,
	mixins : [Game.Mixins.Balanced,
			  Game.Mixins.DirectionMoveable,
			  Game.Mixins.RandomWalkerActor, 
			  Game.Mixins.Destructible,
			  Game.Mixins.Attacker]
}


//Charge towards player & try to hit it
Game.RecklessChargerTemplate = {
	name: 'Reckless Charger',
	character: '⇑',
	foreground: 'red',
	background: 'black',
	chararray: Game.Chars.DoubleArrows,
	mixins: [Game.Mixins.Balanced,
			 Game.Mixins.DirectionMoveable,
			 Game.Mixins.ChargerActor,
			 Game.Mixins.Destructible,
			 Game.Mixins.Attacker]
}

Game.ShieldBearerTemplate = {
	name: 'Shield Bearer',
	character: String.fromCharCode(0x2912)
}

//Preview entity
Game.PreviewTemplate = {
	name: "Preview",
	character: ".",
	foreground: 'white',
	background: 'red',
	mixins: []
}
