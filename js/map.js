

Game.Map = function(tiles, player, upstairs, downstairs) {
	this._tiles = tiles;
	this._width = tiles[0].length;
	this._height = tiles[0][0].length;
	this._depth = tiles.length;
	this._level = 0;
	
	this._entities = [];
	this._animations = [];
	this._scheduler = new ROT.Scheduler.Simple();
	this._engine = new ROT.Engine(this._scheduler);

	this._upstairs = upstairs;
	this._downstairs = downstairs;

	this.addEntity(player);
	player.setX(upstairs[0][0]);
	player.setY(upstairs[0][1]);

	for (z=0; z<this._depth; z++) {
		for (i=0; i<3; i++) {
			this.addRandomEnemy(z);
		}
	}
}

Game.Map.prototype.getUpstairs = function() {
	return this._upstairs[this._level];
}

Game.Map.prototype.getDownstairs = function() {
	return this._downstairs[this._level];
}

Game.Map.prototype.getWidth = function() {
	return this._width;
}

Game.Map.prototype.getHeight = function() {
	return this._height;
}

Game.Map.prototype.getDepth = function() {
	return this._depth;
}

Game.Map.prototype.getLevel = function() {
	return this._level;
}

Game.Map.prototype.tryIncreaseLevel = function() {
	if (this._level < 5) {
		this._level = this._level+1;
		return true;
	} else {
		this._level = 5;
		return false;
	}
}

Game.Map.prototype.tryDecreaseLevel = function() {
	if (this._level > 0) {
		this._level = this._level-1;
		return true;
	} else {
		this._level = 0;
		return false;
	}
}


Game.Map.prototype.getTile = function(x,y,z) {
	if (typeof z == "undefined") {
		z = this._level;
	}
	if (x < 0 || x >= this._width || y<0 || y >= this._height) {
		return Game.Tile.nullTile;
	} 
	else {
		return this._tiles[z][x][y] || Game.Tile.nullTile;
	}
}

Game.Map.prototype.getEngine = function() {
	return this._engine;
}

Game.Map.prototype.getEntities = function() {
	return this._entities;
}

Game.Map.prototype.getEntityAt = function(x,y,z) {
	if (typeof z == "undefined") {
		z = this._level;
	}
	for (var i=0; i < this._entities.length; i++) {
		if (this._entities[i].getX() == x &&
			this._entities[i].getY() == y &&
			this._entities[i].getZ() == z) {
			return this._entities[i]
		}
	}
	return false;
}

Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, radius, centerZ) {
    results = [];
	if (typeof centerZ == "undefined") {
		var z = this._level
	} else {
		var z = centerZ;
	}
    var leftX = centerX - radius;
    var rightX = centerX + radius;
    var topY = centerY - radius;
    var bottomY = centerY + radius;
    for (var i = 0; i < this._entities.length; i++) {
        if (this._entities[i].getX() >= leftX &&
            this._entities[i].getX() <= rightX && 
            this._entities[i].getY() >= topY &&
            this._entities[i].getY() <= bottomY &&
			this._entities[i].getZ() === z) {
			console.log(z + ' ' + this._entities[i].getZ());
            results.push(this._entities[i]);
        }
    }
    return results;
}

Game.Map.prototype.addEntity = function (entity) {
	
	if ('_x' in entity) {
		if (entity.getX() < 0 || entity.getX() >= this._width ||
			entity.getY() < 0 || entity.getY() >= this._height) {
			throw new Error("Attempting to add entity out of bounds");
		}
	}

	this._entities.push(entity);

	entity.setMap(this);

	if (entity.hasMixin('Actor') || entity.hasMixin('NPActor')) {
		this._scheduler.add(entity, true);
	}
}

Game.Map.prototype.addEntityAtRandomPosition = function (entity,z) {

	if (typeof z == "undefined") {
		z = this._level;
	}
	
	var valid = false;
	while (!valid) {
		var x = Math.floor(this._width*Math.random());
		var y = Math.floor(this._height*Math.random());
		valid = (!this.getEntityAt(x,y) && this.getTile(x,y).isWalkable());
	}
	entity.setX(x);
	entity.setY(y);
	entity.setZ(z);
	this.addEntity(entity);
}

Game.Map.prototype.addRandomEnemy = function(z) {

	if (typeof z == "undefined") {
		z = this._level;
	}

	var idx = Math.min(z,2);
	
	var enemy_lists = [[Game.ConfusedWandererTemplate],
					   [Game.ConfusedWandererTemplate,Game.RecklessChargerTemplate],
					   [Game.ConfusedWandererTemplate,Game.RecklessChargerTemplate,
						Game.ShieldBearerTemplate]];
	var enemies = enemy_lists[idx];
	var choice = Math.floor(Math.random()*enemies.length);
	this.addEntityAtRandomPosition(new Game.Entity(enemies[choice]),z);
}

Game.Map.prototype.removeEntity = function (entity) {

	for (var i=0; i<this._entities.length; i++) {
		if (this._entities[i] == entity) {
			this._entities.splice(i,1);
		}
	}
	if (entity.hasMixin('NPActor')) {
		this._scheduler.remove(entity);
	}
	if (entity.hasMixin('PlayerActor')) {
			Game.sendMessage(entity,"Game Over. Press 'G' to restart.");
	}

}
			
