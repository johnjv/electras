var picky_events = function(){
  var elements = new Elements(everything_got) //getElements();

  if(elements.OR().exists() && elements.NOT().exists()){
    //do nothing
  } else {
    createSpeechBubble(elements.first_connection(), "You'll need both an OR and a NOT to solve this.")
  }
}

var not_quite = [
  test_lightbulb(''),
  test_sensor(2, 'lemon', ''),
  test_sensor(3, 'stick', ''),
  test_OR(4, '', '', '')
]


var everything_got = [
  test_lightbulb(''),
  test_sensor(2, 'lemon', ''),
  test_sensor(3, 'stick', ''),
  test_OR(4, '', '', ''),
  test_NOT(5, '', '')
]