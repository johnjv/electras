var its_a_start_events = function(){
  //console.log("starting")
  var elements = new Elements(Circuit.getElements())
  var lightbulb_in = elements.lightbulb().first_connection()
  var empty_sensors = elements.sensor().empty().elements
  //console.log('hello', elements)
  var first_sensor = elements.sensor().first_connection()

  if (empty_sensors && empty_sensors.length == 3) {
    var params = []
    $.each(empty_sensors, function(i, sensor){
//console.log(sensor)
        var highlighted_thing = Filters.find_connection(sensor,'empty',false)
        var parametric_thing = make_parametric(highlighted_thing, true)
        params.push(parametric_thing)
    })
    highlightSections(params)
    createSpeechBubble(first_sensor, getBubble(2, 1));
  }

  else if (elements.sensor('-').active_connection().exists() &&
            elements.lightbulb().empty().exists()) {
    highlightSection(lightbulb_in, true);
    createSpeechBubble(first_sensor, getBubble(2, 2));
  }

  else if (elements.sensor().active_connection().exists() &&
           elements.lightbulb().empty().exists()){
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(2, 3));
  }

  else if (elements.lightbulb().input('filled').exists() &&
          elements.sensor('-').empty().exists()) {
    Tutorial.unhighlightSection()
    createSpeechBubble(first_sensor, getBubble(2, 4));
  }

  else {
    Tutorial.unhighlightSection()
  }
}
