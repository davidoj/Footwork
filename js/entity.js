
Game.Entity = function(properties) {
	properties = properties || {};
	Game.DynamicGlyph.call(this,properties);
	this._x = properties['x'] || 1;
	this._y = properties['y'] || 1;
	this._name = properties['name'] || 'Boringtorator';
	this._playercontrolled = properties['playercontrolled'] || false;

	this._map = null;

};

Game.Entity.extend(Game.DynamicGlyph);


Game.Entity.prototype.setX = function(x) {
	this._x = x;
}

Game.Entity.prototype.setY = function(y) {
	this._y = y;
}

Game.Entity.prototype.getX = function() {
	return this._x;
}

Game.Entity.prototype.getY = function() {
	return this._y;
}

Game.Entity.prototype.setMap = function(map) {
	this._map = map;
}

Game.Entity.prototype.getMap = function() {
	return this._map;
}

//Get the number of steps to another entity, ignoring obstacles
Game.Entity.prototype.getDist = function(entity) {
	return Math.max(this.getX()-entity.getX()), Math.abs(this.getY()-entity.getY());
}
