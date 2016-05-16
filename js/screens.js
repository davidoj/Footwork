

Game.Screen = {};

Game.Screen.footworkScreen =  {
	_map:  null,
	_player: null,

	_screenWidth: Game._screenWidth,
	_screenHeight: Game._screenHeight,

	_messages: [],
	
	_hudHPoffset : [2,2], // hud HP offset - x value is from the right of map
	_hudBALoffset: [2,3], // hud balance offset
	_hudMESSoffset: [0,1], // message display offset - x value is from the left of map

	_generateMap: function() {
		var mapWidth = 50;
		var mapHeight = 24;
		var generator = new ROT.Map.Arena(mapWidth, mapHeight);
		var map = [];

		for (var x = 0; x < mapWidth; x++) {
            map.push([]);
            for (var y = 0; y < mapHeight; y++) {
                map[x].push(Game.Tile.nullTile);
            }
        }
	

		var mapCallback = function (x,y,value) {
			if (value === 1) {
				map[x][y] = Game.Tile.wallTile;
			}
			else {
				map[x][y] = Game.Tile.floorTile;
			}
		}

		generator.create(mapCallback);
		this._map = new Game.Map(map, this._player);

	},

	
	enter: function() { 
		console.log("entered game screen");
		if (this._player === null) {
			this._player = new Game.Entity(Game.PlayerTemplate);
		}

		if (this._map === null) {
			this._generateMap();
		}

		this._map.getEngine().start()
	},
	
	exit: function() { 
		console.log("exited game screen"); 
	},


	render: function(display) {
		for (var x = 0; x<this._map.getWidth(); x++) {
			for (var y = 0; y<this._map.getHeight(); y++) {
				var tile = this._map.getTile(x,y);
				display.draw(x, y,
							 tile.getChar(),
							 tile.getForeground(),
							 tile.getBackground());
			}
		}
		var entities = this._map.getEntities();

		for (var i = 0; i<entities.length; i++) {
			var entity = entities[i];
			display.draw(entity.getX(), entity.getY(),
						 entity.getChar(), 
						 entity.getForeground(),
						 entity.getBackground());
		}

		var hudHPx = this._map.getWidth() + this._hudHPoffset[0];
		var hudHPy = this._hudHPoffset[1];
		var hudBALx = this._map.getWidth() + this._hudBALoffset[0];
		var hudBALy = this._hudBALoffset[1];
		
		// Show current balance with penalty
		var disp_bal = Math.max(0,this._player._cbal-this._player._bal_penalty);

		display.drawText(hudHPx,hudHPy,vsprintf("Health:  %i/%i",[this._player._chp,this._player._mhp]));
		display.drawText(hudBALx,hudBALy,vsprintf("Balance: %i/%i",[disp_bal,this._player._mbal]));
		display.drawText(hudBALx+8,hudBALy+1,vsprintf("(%i/%i)",[this._player._cbal,this._player._mbal]));

		this.addMessages(this._player.getMessages());
		this._player.clearMessages();
		for (var i = 0; i<this._messages.length; i++) {
			var messx = this._hudMESSoffset[0];
			var messy = this._hudMESSoffset[1] + this._map.getHeight() + i;
			if (messy < this.getHeight()) {
				display.drawText(messx, messy, this._messages[i]);
			}
		}

	},

	handleInput: function(inputType, inputData) {
		if (inputType == 'keydown') {
			var ch = String.fromCharCode(inputData.keyCode);
			var ctrl = Game.ControlKeys[ch];
			console.log(ch);
			console.log(ctrl);
			if (ctrl) {
				Game.flushInput();
				this._player.tryMove(ctrl[0],ctrl[1],this._map);
			}
		}

		if (inputType == 'mousemove') {
			var pos = Game.getDisplay().eventToPosition(inputData);
			if (pos[0] >= 0 && pos[1] >= 0) {
				this._player.turn(pos[0]-this._player.getX(),pos[1]-this._player.getY());
			}			
		}

		if (inputType == 'mousedown' && inputData.shiftKey) {
			this._player.useCurrentAbility();
		}

	},
	
	addMessages: function(messages) {
		this._messages = this._messages.concat(messages);
	},

	clearMessages: function() {
		this._messages = [];
	},

	getHeight:  function() {
		return this._screenHeight;
	},

	getWidth: function() {
		return this._screenWidth;
	}
}
