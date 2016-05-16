

Game.Screen = {};

Game.Screen.footworkScreen =  {
	_map:  null,
	_player: null,
	
	_hudHPoffset : [2,2], // hud HP offset - x value is to the right of map
	_hudBALoffset: [2,3], // hud balance offset

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
		
		// Show current balance with current penalty
		var disp_bal = Math.max(0,this._player._cbal-this._player._bal_penalty);

		display.drawText(hudHPx,hudHPy,"Health:  " + this._player._chp + "/" + this._player._mhp);
		display.drawText(hudBALx,hudBALy,"Balance: " + disp_bal + "/" + this._player._mbal);
		display.drawText(hudBALx+9,hudBALy+1,this._player._cbal + " ");

	},

	handleInput: function(inputType, inputData) {
		if (inputType == 'keydown') {
			if (inputData.keyCode == ROT.VK_X) {
				this._player.tryMove(-1,0,this._map);
			} else if (inputData.keyCode == ROT.VK_Z) {
				this._player.tryMove(-1,-1,this._map);
			} else if (inputData.keyCode == ROT.VK_Q) {
				this._player.tryMove(1,-1,this._map);
			} else if (inputData.keyCode == ROT.VK_C) {
				this._player.tryMove(-1,1,this._map);
			} else if (inputData.keyCode == ROT.VK_D) {
				this._player.tryMove(0,1,this._map);
			} else if (inputData.keyCode == ROT.VK_E) {
				this._player.tryMove(1,1,this._map);
			} else if (inputData.keyCode == ROT.VK_S) {
				this._player.tryMove(0,0,this._map);
			} else if (inputData.keyCode == ROT.VK_A) {
				this._player.tryMove(0,-1,this._map);
			} else if (inputData.keyCode == ROT.VK_W) {
				this._player.tryMove(1,0,this._map);
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

}
