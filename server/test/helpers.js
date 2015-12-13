var helpers = {
  setPower: function()  {return Math.floor(Math.random() * 10 + 1)},
  setCrit: function () {
    var roll = Math.floor(Math.random() * 20 + 1);
    return [roll > 17, roll < 3];
  },
  setTime: function() {return new Date().getTime()},

  castSpell: function(attack) {
    var spell = {
      attackId: attack,
      power: this.setPower(),
      crit: this.setCrit(),
      time: this.setTime(),
    }
    return spell;
  }

}
module.exports = helpers
