function enableWorldUpdates(wiz){
  wiz.getAvatar = function(){
    return document.getElementById(this.id);
  }
  wiz.toggleClass = function(className) {
    var avatar = this.getAvatar();
    if (avatar.classList.indexOf(className) !== -1) {
      avatar.classList.add(className)
    } else {
      avatar.classList.remove(className)
    }
  }
  wiz.getVital = function(vital) {
    return document.getElementById(this.id+ '-' + vital);
  }
  wiz.setVital = function(vital, value) {
    this.getVital(vital).style.width = value +'%';
  }
  wiz.enableCounterSpells = function() {
    var buttons = document.getElementsByClassName('btn-spell')
    for (var i = 0; i < buttons.length; i++ ){
      if (buttons[i].getAttribute('data-spell-type') !== 'Attack') {
        buttons[i].removeAttribute('disabled')
      }
    }
  }
  wiz.disableCounterSpells = function() {
    var buttons = document.getElementsByClassName('btn-spell')
    for (var i = 0; i < buttons.length; i++ ){
      if (buttons[i].getAttribute('data-spell-type') !== 'Attack') {
        buttons[i].setAttribute('disabled', 'disabled')
      }
    }
  }
  wiz.enableAttackSpells = function() {
    var buttons = document.getElementsByClassName('btn-spell')
    for (var i = 0; i < buttons.length; i++ ){
      if (buttons[i].getAttribute('data-spell-type') === 'Attack') {
        buttons[i].removeAttribute('disabled')
      }
    }
  }
  wiz.disableAttackSpells = function() {
    var buttons = document.getElementsByClassName('btn-spell')
    for (var i = 0; i < buttons.length; i++ ){
      if (buttons[i].getAttribute('data-spell-type') === 'Attack') {
        buttons[i].setAttribute('disabled', 'disabled')
      }
    }
  }
  wiz.displayAttackResolutionMessage = function(resolution) {
    function updateView(wizId) {
      document.getElementById(wizId + '-wizard-message').innerHTML = resolution.spellName + ' (Damage: #)';
      document.getElementById(wizId + '-avatar-overlay').style.visibility = 'visible';
      setTimeout(function() {
        document.getElementById(wizId + '-avatar-overlay').style.visibility = 'hidden';
        document.getElementById(wizId + '-wizard-message').innerHTML = '';
      }, 1500);
    }
    switch (this.id) {
      case resolution.casterId:
        updateView(this.foeId);
        break;

      case resolution.targetId:
        updateView(this.id);
        break;
    }
  }
  //// refactored out
  wiz.addClass = function(cname){
    this.getAvatar().classList.add(cname)
  }
  wiz.removeClass = function(cname) {
    this.getAvatar().classList.remove(cname)
  }
  wiz.getHealth = function(){
    return document.getElementById(this.id+'-health');
  }
  wiz.getMana = function(){
    return document.getElementById(this.id+'-mana');
  }
  wiz.setHealth = function(health) {
    this.getHealth().style.width = health +'%';
  }
  wiz.setMana = function(mana) {
    this.getMana().style.width = mana+'%';
  }




return wiz
}
module.exports = enableWorldUpdates;
