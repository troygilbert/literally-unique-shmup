window.onload = function() {

	console.log('----- literally unique shmup v0.1 -----');

	var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameContainer');

	game.state.add('Boot', BasicGame.Boot);
	game.state.add('Preloader', BasicGame.Preloader);
	game.state.add('MainMenu', BasicGame.MainMenu);
	game.state.add('Game', BasicGame.Game);

	game.state.start('Boot');

};
