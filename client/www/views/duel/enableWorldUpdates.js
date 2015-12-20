function enableWorldUpdates(wiz){
  wiz.getAvatar = function(){
    return document.getElementById(this.id);
  }
  wiz.showSpideySense = function() {
    var spideySense = document.getElementById('box-holder')
    spideySense.style.display = 'block';
  }
  wiz.hideSpideySense = function() {
    document.getElementById('box-holder').style.display = 'none';
  }
  wiz.toggleClass = function(className) {
    var avatar = this.getAvatar();
    classList = [];
    for (var i = 0; i < avatar.classList.length; i++){
      classList.push(avatar.classList[i])
    }
    console.log(classList.indexOf(className))
    if (classList.indexOf(className) === -1) {
      console.log('adding class name', className)
      avatar.classList.add(className)
      console.log(avatar.classList)
    } else {
      console.log('remove class name', className)
      avatar.classList.remove(className)
      console.log(avatar.classList)
    }
  }
  // set and get vitals
  wiz.getVital = function(vital, actual) {
    var el = document.getElementById(this.id+ '-' + vital);
    if (actual) return el.style.width.split('%')[0];
    return el;
  }
  wiz.setVital = function(vital, value) {
    this.getVital(vital).style.width = value +'%';
  }
  // spell access
  wiz.enableSpellsBy = function(spellAttr, value) {
    var spells = document.getElementsByClassName('btn-spell')
    for (var i = 0; i < spells.length; i++ ){
      var spell = spells[i];
      if (spell.getAttribute('data-spell-' + spellAttr) === value) {
        spell.removeAttribute('disabled')
      }
    }
  }
  wiz.disableSpellsBy = function(spellAttr, value) {
    var spells = document.getElementsByClassName('btn-spell')
    for (var i = 0; i < spells.length; i++ ){
      var spell = spells[i]
      if (spell.getAttribute('data-spell-' + spellAttr) === value) {
        spell.setAttribute('disabled', 'disabled')
      }
    }
  }
  wiz.resetSpells = function(socket) {
    if (!socket.castingSpell) {
      this.enableSpellsBy('type', 'attack');
      this.enableSpellsBy('role', 'enhancer')
      this.disableSpellsBy('role', 'counter')
    }
  }
  // messages
  wiz.getMessageEl = function() {
    return document.getElementById(this.id + '-wizard-message')
  }
  wiz.updateMessage = function(el, msg) {
    el.innerHTML = msg;
  }
  wiz.setAvatarOverlayVisibility = function(visibility) {
    var el = document.getElementById(this.id + '-avatar-overlay')
    el.style.visibility = visibility;
  }
  wiz.flashMessage = function(msg) {
    // write message to element
    var messageEl = this.getMessageEl();
    this.updateMessage(messageEl, msg)
    // show message
    this.setAvatarOverlayVisibility('visible')
    var ths = this;
    setTimeout(function() {
      ths.setAvatarOverlayVisibility('hidden')
      ths.updateMessage(messageEl, '')
    }, 1500)
  }
  return wiz
}
module.exports = enableWorldUpdates;
