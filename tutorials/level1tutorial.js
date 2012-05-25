var i_so_blue_events = function(){
  var elements = new Elements(Circuit.getElements())
  var blue_sensor_connection = elements.sensor().first_connection()

  if (elements.sensor('C').output('empty').exists() &&
      elements.lightbulb().input('empty').exists()){
    highlightSection(blue_sensor_connection, true)
    createSpeechBubble(blue_sensor_connection, getText(1, 1))
  }

  else if (elements.sensor('C').active_connection().exists() &&
          elements.lightbulb().input('empty').exists()){
    //since lightbulbs only have one connection point, and it has been confirmed that it is empty, it is safe to go directly to it with first_connection
    var lightbulb_in = elements.lightbulb().first_connection()
    highlightSection(lightbulb_in, true);
    createSpeechBubble(blue_sensor_connection, getText(1, 2));
  }

  else if (elements.sensor('C').output('filled').exists() &&
          elements.lightbulb().input('filled').exists()){
    console.log("the user has connected the two");
    Tutorial.unhighlightSection()
//    waiting on FactorFloor to expose getLeverLocation()
//    var level = FactoryFloor.getLeverLocation()
//    highlightSection(lever, false);
//    createSpeechBubble(blue_sensor_connection, getText(1, 3));

//    do we need to deal with the clipboard here, or will it pop up on its own?
//    var advance_location = getAdvanceLocation();
//    highlightSection(advance_location)

  }

  else {
     Tutorial.unhighlightSection()
  }
}
