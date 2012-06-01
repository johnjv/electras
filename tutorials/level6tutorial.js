var anti_twinkle_events = function(){

  var elements = new Elements(Circuit.getElements())

  if(elements.OR().exists() && elements.NOT().exists()){
    //do nothing
  } else {
    Tutorial.unhighlightSection()
    createSpeechBubble(elements.sensor().first_connection(), getBubble(6,1))
  }
}
