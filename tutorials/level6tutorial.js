var anti_twinkle_events = function(){

  var elements = new Elements(Circuit.getElements())

  if(elements.OR().exists() && elements.NOT().exists()){
    //do nothing
  } else {
    createSpeechBubble(elements.sensor().first_connection(), "You'll need both an OR and a NOT to solve this.")
  }
}
