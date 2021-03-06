
Game.Controls = {};

Game.Controls.fps = {
	dirMap : {
		"X" : [-1,0],
		"Z" : [-1,-1],
		"Q" : [1,-1],
		"C" : [-1,1],
		"D" : [0,1],
		"E" : [1,1],
		"S" : [0,0],
		"A" : [0,-1],
		"W" : [1,0]
	},
	handleControl : function(inputType, inputData, actor, map) {
		var shift = inputData.shiftKey;

		if (inputType == 'keydown') {
			var ch = String.fromCharCode(inputData.keyCode);
			var ctrl = this.dirMap[ch];
			if (ctrl) {
				actor.queueAction(partial(actor.fpsMove,ctrl[0],ctrl[1],map));
				Game.flushInput();
			} else if (ch == 'N') {
				actor.readyNextAbility();
			} else if (shift && inputData.keyCode == ROT.VK_COMMA) {
				actor.goToPreviousLevel();
			} else if (shift && inputData.keyCode == ROT.VK_PERIOD) {
				actor.goToNextLevel();
			}
		}

		if (inputType == 'mousemove') {
			var pos = Game.getDisplay().eventToPosition(inputData);
			if (pos[0] >= 0 && pos[1] >= 0 && !shift) {
				var final_dir = v2d(pos[0]-actor.getX(),-(pos[1]-actor.getY()))
				actor.turn(final_dir,1);
			}			
		}

		if (inputType == 'mousedown' && shift) {
			actor.queueAction(partial(actor.useCurrentAbility));
			Game.flushInput();
		} else if (inputType == 'mousedown') {
			var pos = Game.getDisplay().eventToPosition(inputData);
			actor.queueAction(partial(actor.tryWalkToPoint,pos[0],pos[1]));
			Game.flushInput();
		}
		actor.clearPreviews();
		if (shift) {
			actor._direction = actor._olddirection;
			actor.previewCurrentAbility();
		}

	}
}

Game.Controls.vim = {
	dirMap : {
		"J" : [0,1],
		"B" : [-1,1],
		"Y" : [-1,-1],
		"N" : [1,1],
		"L" : [1,0],
		"U" : [1,-1],
		"S" : [0,0],
		"H" : [-1,0],
		"K" : [0,-1]
	},
	handleControl : function(inputType, inputData, actor, map) {
		var shift = inputData.shiftKey;

		if (inputType == 'keydown') {
			var ch = String.fromCharCode(inputData.keyCode);
			var ctrl = this.dirMap[ch];
			var shift = inputData.shiftKey;
			if (ctrl) {
				if (ch == 'Z') {
					Game.sendMessage(actor,"Which direction do you want to face?");
					actor._turnMode = 1;
				}
				else {
					actor.kbMove(ctrl[0],ctrl[1],shift,map);
					Game.flushInput();
				}
			} else if (ch == "A" && shift) {
				actor.useCurrentAbility();
				Game.flushInput();
			}
		}
		actor.clearPreviews();
		if (shift) {
			actor.previewCurrentAbility();
		}

	}
}
