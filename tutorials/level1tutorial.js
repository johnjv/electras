var i_so_blue_events = function(){
  var elements = new Elements(Circuit.getElements())
  var blue_sensor_connection = elements.sensor().first_connection()

  if (elements.sensor('C').output('empty').exists() &&
      elements.lightbulb().input('empty').exists()){
    highlightSection(blue_sensor_connection, true)
    createSpeechBubble(blue_sensor_connection, getBubble(1, 1))
  }

  else if (elements.sensor('C').active_connection().exists() &&
          elements.lightbulb().input('empty').exists()){
    //since lightbulbs only have one connection point, and it has been confirmed that it is empty, it is safe to go directly to it with first_connection
    var lightbulb_in = elements.lightbulb().first_connection()
    highlightSection(lightbulb_in, true);
    createSpeechBubble(blue_sensor_connection, getBubble(1, 2));
  }

  else if (elements.sensor('C').output('filled').exists() &&
          elements.lightbulb().input('filled').exists()){
    console.log("the user has connected the two");
    Tutorial.unhighlightSection()
    createSpeechBubble(blue_sensor_connection, getBubble(1, 3));

  }

  else {
     Tutorial.unhighlightSection()
  }
}
