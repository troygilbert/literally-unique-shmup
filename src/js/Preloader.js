BasicGame.Preloader = function(game) {
	this.background = null;
	this.preloadBar = null;
};

BasicGame.Preloader.prototype = {

	preload: function () {
		this.stage.backgroundColor = '#2d2d2d';

		this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
		this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('titlepage', 'images/titlepage.png');
		this.load.image('sea', 'images/desert.png');
		this.load.image('bullet', 'images/bullet.png');
		this.load.image('enemyBullet', 'images/enemy-bullet.png');
		this.load.image('powerup1', 'images/powerup1.png');
		this.load.spritesheet('greenEnemy', 'images/enemy.png', 16, 16);
		this.load.spritesheet('whiteEnemy', 'images/shooting-enemy.png', 32, 32);
		this.load.spritesheet('boss', 'images/boss.png', 32, 32);
		this.load.spritesheet('explosion', 'images/explosion.png', 32, 32);
		this.load.spritesheet('player', 'images/player.png', 32, 32);
		this.load.audio('explosion', ['sounds/explosion.ogg', 'sounds/explosion.wav']);
		this.load.audio('playerExplosion', ['sounds/player-explosion.ogg', 'sounds/player-explosion.wav']);
		this.load.audio('enemyFire', ['sounds/enemy-fire.ogg', 'sounds/enemy-fire.wav']);
		this.load.audio('playerFire', ['sounds/player-fire.ogg', 'sounds/player-fire.wav']);
		this.load.audio('powerUp', ['sounds/powerup.ogg', 'sounds/powerup.wav']);
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		this.state.start('MainMenu');
	}

};
