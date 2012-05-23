var its_a_start_events = function(){
  console.log("starting")
  var elements = new Elements(Circuit.getElements())
  var lightbulb_in = elements.lightbulb().first_connection()
  var empty_sensors = elements.sensor().empty().elements
  console.log('hello', elements)

  if (empty_sensors && empty_sensors.length == 3) {
    $.each(empty_sensors, function(i, sensor){
//       highlightSection(find_outgoing([sensor], 'empty'), true);
      console.log(sensor)
        highlightSection(Filters.find_connection(sensor,'empty',false), true)
    })
    createSpeechBubble(empty_sensors[0].connections[0], "Candies can have 3 shapes: ball, star, and square.");
  }

  else if (elements.sensor('-').active_connection().exists() &&
            elements.lightbulb().empty().exists()) {
    highlightSection(lightbulb_in, true);
    createSpeechBubble(lightbulb_in, "Good choice!  Now click on the lightbulb just like last time.");
  }

  else if (elements.sensor().active_connection().exists() &&
           elements.lightbulb().empty().exists()){
    createSpeechBubble(lightbulb_in, 'With great power comes great responsibility.');
  }

  else if (elements.lightbulb().input('filled').exists() &&
          elements.sensor('-').empty().exists()) {
    createSpeechBubble(elements.lightbulb().first_connection(), "Uh oh!  Someone connected this wrong!  " +
        "Grab the eraser and click on the wire to give us a nice clean slate to work with.");
  }
}

//var start2 = [
//    test_lightbulb(''),
//    test_sensor(2, 'square', ''),
//    test_sensor(3, 'star', ''),
//    test_sensor(4, 'ball', '')
//]
//
//var square_selected = [
//  test_lightbulb(''),
//  test_sensor(2, 'square', 'active'),
//  test_sensor(3, 'star', ''),
//  test_sensor(4, 'ball', '')
//]
//
//var star_selected = [
//  test_lightbulb(''),
//  test_sensor(2, 'square', ''),
//  test_sensor(3, 'star', 'active'),
//  test_sensor(4, 'ball', '')
//]
//
//
//var wrong_one = [
//  test_lightbulb('4'),
//  test_sensor(2, 'square', ''),
//  test_sensor(3, 'star', ''),
//  test_sensor(4, 'ball', '1')
//]
