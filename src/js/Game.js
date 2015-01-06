BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

  create: function () {
    this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
  },

  update: function () {
  },

  quitGame: function (pointer) {
    this.state.start('MainMenu');
  }

};
