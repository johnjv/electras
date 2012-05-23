
var a_bar_walks_into_my_tummy_events = function(){
  var elements = new Elements(Circuit.getElements())
  var lightbulb_in = elements.lightbulb().first_connection()
  var empty_sensors = elements.sensor().empty().elements

  if (empty_sensors && empty_sensors.length == 3) {
    $.each(empty_sensors, function(i, sensor){
//       highlightSection(find_outgoing([sensor], 'empty'), true);
      console.log(sensor)
        highlightSection(Filters.find_connection(sensor,'empty',false), true)
    })
    createSpeechBubble(empty_sensors[0].connections[0], "Candies can have 3 shapes: round(o), stick(|), and bar(-)");
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

var start2 = [
    test_lightbulb(''),
    test_sensor(2, 'bar', ''),
    test_sensor(3, 'stick', ''),
    test_sensor(4, 'ball', '')
]

var bar_selected = [
  test_lightbulb(''),
  test_sensor(2, 'bar', 'active'),
  test_sensor(3, 'stick', ''),
  test_sensor(4, 'ball', '')
]

var stick_selected = [
  test_lightbulb(''),
  test_sensor(2, 'bar', ''),
  test_sensor(3, 'stick', 'active'),
  test_sensor(4, 'ball', '')
]


var wrong_one = [
  test_lightbulb('4'),
  test_sensor(2, 'bar', ''),
  test_sensor(3, 'stick', ''),
  test_sensor(4, 'ball', '1')
]

//change to acommadate eraser