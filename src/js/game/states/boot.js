module.exports = function(game) {

	return {
		create: function() {
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.refresh();

			game.state.start('preloader');
		}
	};

};
