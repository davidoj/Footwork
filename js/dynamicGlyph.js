// Subclass for entities and items


Game.DynamicGlyph = function(properties) {

	properties = properties || {};
	Game.Glyph.call(this,properties);
	this._name = properties['name'] || 'Boringtorator';

	this._attachedMixins = {};
	this._attachedMixinGroups = {};
	this._listeners = {};
	var mixins =  properties['mixins'];
	for (var i = 0; i < mixins.length; i++) {
		for (var key in mixins[i]) {
			if (key !== 'init' && key !== 'name' && !this.hasOwnProperty(key)) {
				this[key] = mixins[i][key];
			}
		}
		this._attachedMixins[mixins[i].name] = true;

        if (mixins[i].groupName) {
            this._attachedMixinGroups[mixins[i].groupName] = true;
        }

		if (mixins[i].listeners) {
			for (var key in mixins[i].listeners) {
				if (!this._listeners[key]) {
					this._listeners[key] = [];
				}
				this._listeners[key].push(mixins[i].listeners[key]);
			}
		}

        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
	}
};


Game.DynamicGlyph.extend(Game.Glyph);

Game.DynamicGlyph.prototype.setName = function(name) {
	this._name = name;
};

Game.DynamicGlyph.prototype.getName = function() {
	return this._name;
};

Game.DynamicGlyph.prototype.hasMixin = function(obj) {
	if (typeof obj === 'object') {
		return this._attachedMixins[obj.name];
	}
	else {
		return this._attachedMixins[obj] || this._attachedMixinGroups[obj];
	}
};

Game.DynamicGlyph.prototype.raiseEvent = function(event) {
	if (!this._listeners[event]) {
		return;
	}
	
	var args = Array.prototype.slice.call(arguments,1);
	
	for (var i=0; i<this._listeners[event].length; i++) {
		this._listeners[event][i].apply(this, args);
	}
};
