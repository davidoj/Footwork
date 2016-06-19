// Messaging mixin


Game.Mixins.MessageRecipient = {
	name : "MessageRecipient",
	groupName : "MessageRecipient",

	init : function(properites) {
		this._messages = [];
	},
	receiveMessage : function(message) {
		this._messages.push(message);
	},
	getMessages : function() {
		return(this._messages);
	},
	clearMessages : function() {
		this._messages = [];
	}
}

