var i_so_blue_events = function(){
  var elements = new Elements(Circuit.getElements())

  if (elements.sensor('C').output('empty').exists() &&
      elements.lightbulb().input('empty').exists()){
    var sensor_out = elements.sensor('C').first_connection()
    highlightSection(sensor_out, true)
    createSpeechBubble(sensor_out, "We must tell the machine what to do.  Click on the sensor to start laying down wire.")
  }

  else if (elements.sensor('C').active_connection().exists() &&
          elements.lightbulb().input('empty').exists()){
    //since lightbulbs only have one connection point, and it has been confirmed that it is empty, it is safe to go directly to it with first_connection
    var lightbulb_in = elements.lightbulb().first_connection()
    highlightSection(lightbulb_in, true);
    createSpeechBubble(lightbulb_in, "Good job!  Now connect it to the lightbulb!");
  }

  else if (elements.sensor('C').output('filled').exists() &&
          elements.lightbulb().input('filled').exists()){
    console.log("the user has connected the two");
//    var lever = getLeverLocation()
//    highlightSection(lever, false);
//    createSpeechBubble(lever, "Click on the lever to test your machine!");

    //here we do something a little hacky... we set a click event on the lever,
    // which sets a timer (how long the checking animation takes to play) to a callback which highlights the chalkboard
//the following should be wrapped in some sort of click event, then a timeout event.  Take care of when there are things to test on, it is too difficult without feedback.
//    var advance_location = getAdvanceLocation();
//    highlightSection(advance_location)

  }
}
//
//elements_start = [
//  {
//    id: 1,
//    type: 'chocolate sensor',
//    connections: [
//      {
//        connection_type: 'outgoing',
//        x: 100,
//        y: 100,
//        width: 50,
//        height: 50,
//        connected_to: ['']
//      }
//    ]
//  },
//  {
//    id: 2,
//    type: 'lightbulb',
//    connections: [
//      {
//        connection_type: 'incoming',
//        x: 500,
//        y: 100,
//        width: 10,
//        height: 10,
//        connected_to: ['']
//      }
//    ]
//  }
//]
//
//elements_first_selected = [
//  {
//    id: 1,
//    type: 'chocolate sensor',
//    connections: [
//      {
//        connection_type: 'outgoing',
//        x: 100,
//        y: 100,
//        width: 50,
//        height: 50,
//        connected_to: ['active']
//      }
//    ]
//  },
//  {
//    id: 2,
//    type: 'lightbulb',
//    connections: [
//      {
//        connection_type: 'incoming',
//        x: 500,
//        y: 100,
//        width: 10,
//        height: 10,
//        connected_to: ['']
//      }
//    ]
//  }
//]
//
//elements_finished = [
//  {
//    id: 1,
//    type: 'chocolate sensor',
//    connections: [
//      {
//        connection_type: 'outgoing',
//        x: 100,
//        y: 100,
//        width: 50,
//        height: 50,
//        connected_to: ['2']
//      }
//    ]
//  },
//  {
//    id: 2,
//    type: 'lightbulb',
//    connections: [
//      {
//        connection_type: 'incoming',
//        x: 500,
//        y: 100,
//        width: 10,
//        height: 10,
//        connected_to: ['1']
//      }
//    ]
//  }
//]
//
