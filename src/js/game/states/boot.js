module.exports = function(game) {

	return {
		
		init: function() {
			game.input.maxPointers = 1;
		},

		preload: function() {
			game.load.image('preloaderBackground', 'images/preloader-background.png');
			game.load.image('preloaderBar', 'images/preloader-bar.png');
		},

		create: function() {
			game.state.start('preloader');
		}
	};

};
