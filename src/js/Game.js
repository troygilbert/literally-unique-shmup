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
		this.player.body.setSize(20, 20, 0, -5);

		this.enemyPool = this.add.group();
		this.enemyPool.enableBody = true;
		this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyPool.createMultiple(50, 'greenEnemy');
		this.enemyPool.setAll('anchor.x', 0.5);
		this.enemyPool.setAll('anchor.y', 0.5);
		this.enemyPool.setAll('outOfBoundsKill', true);
		this.enemyPool.setAll('checkWorldBounds', true);

		this.enemyPool.forEach(function(enemy) {
			enemy.animations.add('fly', [0, 1, 2], 20, true);
		})

		this.nextEnemyAt = 0;
		this.enemyDelay = 1000;

		this.bulletPool = this.add.group();
		this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.bulletPool.createMultiple(100, 'bullet');
		this.bulletPool.setAll('anchor.x', 0.5);
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('outOfBoundsKill', true);
		this.bulletPool.setAll('checkWorldBounds', true);

		this.nextShotAt = 0;
		this.shotDelay = 100;

		this.explosionPool = this.add.group();
		this.explosionPool.enableBody = true;
		this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.explosionPool.createMultiple(100, 'explosion');
		this.explosionPool.setAll('anchor.x', 0.5);
		this.explosionPool.setAll('anchor.y', 0.5);
		this.explosionPool.forEach(function(explosion) {
			explosion.animations.add('boom');
		});

		this.cursors = this.input.keyboard.createCursorKeys();

		this.instructions = this.add.text(this.game.width / 2, this.game.height * 0.8,
			'Use Arrow Keys to Move, Press Z to Fire\n' +
			'Tapping/clicking does both',
			{ font: '20px monospace', fill: '#fff', align: 'center' }
		);
		this.instructions.anchor.setTo(0.5, 0.5);
		this.instExpire = this.time.now + 10*1000;
	},

	update: function() {
		this.sea.tilePosition.y += 0.2;

		this.physics.arcade.overlap(this.bulletPool, this.enemyPool, this.enemyHit, null, this);
		this.physics.arcade.overlap(this.player, this.enemyPool, this.playerHit, null, this);

		if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
			this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemyPool.getFirstExists(false);
			enemy.reset(this.rnd.integerInRange(20, this.game.width - 20), 0);
			enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
			enemy.play('fly');
		}

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

		if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
			this.fire();
		}

		if (this.instructions.exists && this.time.now > this.instExpire) {
			this.instructions.destroy();
		}
	},

	fire: function() {
		if (!this.player.alive) return;
		if (this.nextShotAt > this.time.now) return;
		if (this.bulletPool.countDead() === 0) return;
		
		this.nextShotAt = this.time.now + this.shotDelay;

		var bullet = this.bulletPool.getFirstExists(false);
		bullet.reset(this.player.x, this.player.y - 20);
		bullet.body.velocity.y = -500;
	},

	enemyHit: function(bullet, enemy) {
		bullet.kill();
		this.explode(enemy);
		enemy.kill();
	},

	playerHit: function(player, enemy) {
		this.explode(enemy);
		enemy.kill();
		this.explode(player);
		player.kill();
	},

	explode: function(sprite) {
		if (this.explosionPool.countDead() === 0) return;

		var explosion = this.explosionPool.getFirstExists(false);
		explosion.reset(sprite.x, sprite.y);
		explosion.play('boom', 15, false, true);
		explosion.body.velocity.x = sprite.body.velocity.x;
		explosion.body.velocity.y = sprite.body.velocity.y;
	},

	render: function() {
		// this.game.debug.body(this.bullet);
		// this.game.debug.body(this.enemy);
	}

};
