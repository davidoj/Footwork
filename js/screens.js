

Game.Screen = {};

// Starting screen
Game.Screen.startScreen = {
    enter: function() {    console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
	_messages: [],
	_ready: false,
    render: function(display) {
        display.drawText(1,1, "%c{yellow}Footwork Roguelike");
		display.drawText(1,3, "Choose a control method");
		display.drawText(1,4, "m - mouse + keyboard controls (FPS-like)");
		display.drawText(1,5, "v - vim controls (classic roguelike-like)");
		for (var i=0; i<this._messages.length; i++) {
			display.drawText(1,7+i, this._messages[i]);
		}
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_M) {
				this._ready = true; 
				Game.setDefaultControls(Game.Controls.fps);
				this._messages = ['%c{cyan}mouse - point your character',
								  '%c{cyan}w - forward',
								  '%c{cyan}a - left',
								  '%c{cyan}s - backwards',
								  '%c{cyan}d - right',
								  '%c{cyan}qezc - diagonals',
								  '%c{cyan}shift - preview attack',
								  '%c{cyan}shift+click - attack',
								  '%c{cyan}x - stay in place, change direction or stand up',
								  '%c{cyan}n - next attack',
								  '%c{cyan}G - back to this screen',
								  '',
								  '%c{yellow} Press Enter to start']
            }
			if (inputData.keyCode === ROT.VK_V) {
				this._ready = true;
				Game.setDefaultControls(Game.Controls.vim);
				this._messages = ['%c{cyan}k - up',
								  '%c{cyan}h - left',
								  '%c{cyan}j - down',
								  '%c{cyan}l - right',
								  '%c{cyan}yubn - diagonals',
								  '%c{cyan}shift - preview attack',
								  '%c{cyan}shift+A - attack',
								  '%c{cyan}x - stay in place, change direction or stand up',
								  '%c{cyan}n - next attack',
								  '%c{cyan}G - back to this screen',
								  '',
								  '%c{yellow} Press Enter to start']
			}
			if (this._ready && inputData.keyCode === ROT.VK_RETURN) {
				Game.switchScreen(Game.Screen.footworkScreen,1);
			}
        }
    }
}

Game.Screen.footworkScreen =  {
	_map:  null,
	_player: null,

	_screenWidth: Game._screenWidth,
	_screenHeight: Game._screenHeight,

	_messages: [],
	
	_hudHPoffset: [2,2], // hud HP offset - x value is from the right of map
	_hudBALoffset: [2,3], // hud balance offset
	_hudABLoffset: [2,4], // hud ability offset
	_hudMESSoffset: [0,1], // message display offset - x value is from the left of map


	_controls: Game.Controls.fps,

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

	
	enter: function(reload) { 
		console.log("entered game screen");
		if (this._player === null || reload) {
			this._player = new Game.Entity(Game.PlayerTemplate);
		}

		if (this._map === null || reload) {
			this._generateMap();
		}

		this._map.getEngine().start()
	},
	
	exit: function() { 
		console.log("exited game screen"); 
	},


	render: function(display) {
		var entities = this._map.getEntities();

		//Draw map
		for (var x = 0; x<this._map.getWidth(); x++) {
			for (var y = 0; y<this._map.getHeight(); y++) {
				var tile = this._map.getTile(x,y);
				display.draw(x, y,
							 tile.getChar(),
							 tile.getForeground(),
							 tile.getBackground());
			}
		}

		//Draw entities
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
		var hudABLx = this._map.getWidth() + this._hudABLoffset[0];
		var hudABLy = this._hudABLoffset[1];
		
		var disp_bal = this._player._cbal;

		display.drawText(hudHPx,hudHPy, vsprintf("Health:  %i/%i",[this._player._chp,this._player._mhp]));
		display.drawText(hudBALx, hudBALy, vsprintf("Balance: %i/%i",[disp_bal,this._player._mbal]));
		display.drawText(hudABLx, hudABLy, vsprintf("Attack: %s",[this._player._currentability]));

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
			var shift = inputData.shiftKey;
			if (shift && inputData.keyCode == ROT.VK_R) {
				this._map.addEntityAtRandomPosition(new Game.Entity(Game.RecklessChargerTemplate));
			} else if (shift && inputData.keyCode == ROT.VK_C) {
				this._map.addEntityAtRandomPosition(new Game.Entity(Game.ConfusedWandererTemplate));
			} else if (shift && inputData.keyCode == ROT.VK_G) {
				Game.switchScreen(Game.Screen.startScreen);
			} 
		} 
		
		this._controls.handleControl(inputType, inputData, this._player, this._map);

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
