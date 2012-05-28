Translator.addListener(Tutorial.circuitChanged)

var getBubble = function(tutNumber, bubbleNumber){
  return Translator.getText('tutorial' + tutNumber, 'bubble' + bubbleNumber)
}
