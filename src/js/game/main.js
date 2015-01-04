console.log('----- literally unique shmup v0.1 -----');

var Phaser = require('Phaser');
var _ = require('lodash');

var properties = require('./properties');

var states = {
	boot: require('./states/boot'),
	preloader: require('./states/preloader'),
	mainMenu: require('./states/main-menu'),
	game: require('./states/game')
};

var game = new Phaser.Game(properties.size.width, properties.size.height, Phaser.AUTO, 'game');

_.each(states, function(state, key) {
	game.state.add(key, state(game));
});

game.state.start('boot');
