module.exports = function(game) {

	var background = null;
	var bar = null;
	var ready = false;

	return {

		preload: function() {

			background = game.add.sprite(0, 0, 'preloaderBackground');
			bar = game.add.sprite(256, 320, 'preloaderBar');

			game.load.setPreloadSprite(bar);

			// load assets during preload

		},

		create: function() {

			bar.cropEnabled = false;

		},

		update: function() {

			// sub in titleMusic for any sounds needing to be pre-decoded
			if (!ready && game.cache.isSoundDecoded('titleMusic')) {
				ready = true;
				game.state.start('mainMenu');
			}

		}

	};

};
