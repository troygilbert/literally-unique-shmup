module.exports = function(game) {

	var music = null;
	var playButton = null;

	return {

		create: function() {

			music = game.add.audio('titleMusic');
			music.play();

			game.add.sprite(0, 0, 'titlepage');

			playButton = game.add.button(512, 384, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
			
		},

		startGame: function() {

			music.stop();

			game.state.start('game');

		}

	};

};
