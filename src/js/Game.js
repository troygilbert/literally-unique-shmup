BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

	preload: function() {
		this.load.image('sea', 'images/sea.png');
		this.load.image('bullet', 'images/bullet.png');
		this.load.spritesheet('greenEnemy', 'images/enemy.png', 32, 32);
		this.load.spritesheet('explosion', 'images/explosion.png', 32, 32);
		this.load.spritesheet('player', 'images/player.png', 64, 64);
	},

	create: function() {
		this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');

		this.player = this.add.sprite(this.game.width / 2, this.game.height * 0.9, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.animations.add('fly', [0, 1, 2], 20, true);
		this.player.play('fly');
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = 300;
		this.player.body.collideWorldBounds = true;

		this.enemy = this.add.sprite(this.game.width / 2, this.game.height / 3, 'greenEnemy');
		this.enemy.animations.add('fly', [0, 1, 2], 20, true);
		this.enemy.play('fly');
		this.enemy.anchor.setTo(0.5, 0.5);
		this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

		this.bullet = this.add.sprite(this.game.width / 2, this.game.height / 2, 'bullet');
		this.bullet.anchor.setTo(0.5, 0.5);
		this.physics.enable(this.bullet, Phaser.Physics.ARCADE);
		this.bullet.body.velocity.y = -500;

		this.cursors = this.input.keyboard.createCursorKeys();
	},

	update: function() {
		this.sea.tilePosition.y += 0.2;
		this.physics.arcade.overlap(this.bullet, this.enemy, this.enemyHit, null, this);

		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;

		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -this.player.speed;
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = this.player.speed;
		}

		if (this.cursors.up.isDown) {
			this.player.body.velocity.y = -this.player.speed;
		} else if (this.cursors.down.isDown) {
			this.player.body.velocity.y = this.player.speed;
		}

		if (this.input.activePointer.isDown &&
			this.physics.arcade.distanceToPointer(this.player) > 15) {
			this.physics.arcade.moveToPointer(this.player, this.player.speed);
		}
	},

	enemyHit: function(bullet, enemy) {
		bullet.kill();
		enemy.kill();
		var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
		explosion.anchor.setTo(0.5, 0.5);
		explosion.animations.add('boom');
		explosion.play('boom', 15, false, true);
	},

	render: function() {
		// this.game.debug.body(this.bullet);
		// this.game.debug.body(this.enemy);
	}

};
