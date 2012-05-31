var i_so_blue = new Level({
  levelname: "I'm so blue",
  levelid: 1,
  orderText:  "Give me every blue candy you make!",
  hint: 'You should connect the blue sensor to the lightbulb by clicking on the connectors.',
  sensors:  'C',
  tools: [],
  types:  ['*o'], 
  answers: 'C*',
  script: 'i_so_blue'
});

var its_a_start = new Level({
  levelname: "It's a STARt",
  levelid: 2,
  orderText: 'I only want star-shaped candies',
  hint: "You have some choices.  Remember, star-shaped candies are shaped like stars.",
  sensors: '|o-',
  tools: [],
  types: ['C*'],
  answers: '*|',
  script: 'its_a_start'
});

var soyl_not_green = new Level({
  levelname: 'Soyl, not green',
  levelid: 3,
  orderText: "I want everything that's not green!",
  hint: "You can add components now!  Try placing the 'not' component between the lightbulb and the green sensor and see what happens.",
  sensors: 'G',
  tools: ['not'],
  types: ['*-'],
  answers: 'C*,R*,Y*',
  script: 'soyl_not_green'
});

var flavor_unearthed = new Level({
  levelname: 'Flavor unEARTHed',
  levelid: 4,
  orderText: 'I want to mix blue candies and green candies like a sugary meeting of sky and field.',
  hint: "This is the or component.  It takes two inputs and lights up if either of them are on.  Try connecting" +
      " a green and a blue sensor to it.",
  sensors: 'GC',
  tools: ['or'],
  types: ['*o'],
  answers: 'C*,G*',
  script: 'flavor_unearthed'
});

var indecisive = new Level({
  levelname: 'Indecisive',
  levelid: 5,
  orderText: "I really like cherries, but I'm not sure if it's their color or their round shape." +
      "  Get me some things that are either round or red, so I can decide.",
  hint:  "They want things that are round or red.  This looks similar to what you did in the last level.",
  sensors: 'CRo-',
  tools: ['or'],
  types: ['**'],
  answers: 'R*,*o',
  script: 'indecisive'
});

var anti_twinkle = new Level({
  levelname: 'Anti Twinkle',
  levelid: 6,
  orderText: "I don't know what I like, but I know what I don't like:  yellows and stars.  Don't give me any yellow candies " +
      "and don't give me any stars.",
  hint: "You'll have to combine an 'or' operator with either one or two 'not' operators.",
  sensors: 'Y|',
  tools: ['or', 'not'],
  types: ['**'],
  answers: 'Co,C-,Ro,R-,Go,G-', 
  script: 'anti_twinkle'
});

var a_new_earth = new Level({
  levelname: 'A new earth',
  levelid: 7,
  orderText: "I want candies that are green or blue.  I don't care if you got the wrong sensors, you can figure it out!",
  hint: "Looks like whoever delivers our sensors messed up and gave us the wrong ones!  You'll just have to use your brains to overcome that.",
  sensors: 'YR',
  tools: ['or', 'not'],
  types: ['**'],
  answers: 'C*,G*',
  script: 'a_new_earth'
});

var out_on_a_lemon = new Level({
  levelname: 'Out on a LEMON',
  levelid: 8,
  orderText: "I want yellow squares.  Not yellow drops, or red squares, but only things that are yellow and squares.",
  hint: "The 'and' operator combines two different sensors.It will only light up if both inputs are true",
  sensors: 'Y-',
  tools: ['and'],
  types: ['**'],
  answers: 'Y-',
  script: 'out_on_a_lemon'
});

var backlash = new Level({
  levelname: 'Backlash',
  levelid: 9,
  orderText: "Oh, that was a disaster!  Now my customers won't take any lemon squares!  I want everything that is not a yellow square.",
  hint: "We want the OPPOSITE of last time.  Which operator gives you the opposite?",
  sensors: 'Y-',
  tools: ['and', 'not'],
  types: ['**'],
  answers: 'Yo,Y|,R*,G*,C*',
  script: 'backlash'
});

var speak_softly_cherry_a_stick = new Level({
  levelname: 'Speak softly, CHERRY a stick',
  levelid: 10,
  orderText: "I want red squares and yellow squares.",
  hint: "There are only so many ways to combine these operators and sensors.  Keep trying!",
  sensors: '-RY',
  tools: ['and', 'or'],
  types: ['**'],
  answers: 'R-,Y-',
  script: 'speak_softly_cherry_a_stick'
});


var botique = new Level({
  levelname: 'Botique',  
  levelid: 11,
  orderText: "I want lemon drops and green squares. But not lemon squares or green drops! "  ,
  hint: "Make something that finds lemon drops, then something that finds green squares. Combine them!",
  sensors: 'GY-o',
  tools: ['and', 'or'],
  types: ['**'],
  answers: 'Yo,G-',
  script: 'botique'
});

var winnowing = new Level({
  levelname: 'Winnowing',  
  levelid: 12,
  orderText: "I want something red or yellow, and I want it in either a drop or a star shape.",
  hint: "You'll have to combine an 'and' operator and two 'or' operators to make this work.",
  sensors: 'YRo|',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'Ro,R|,Yo,Y|',
  script: 'winnowing'
});

var gniwonniw = new Level({
  levelname: 'Gniwonniw',
  levelid: 13,
  orderText: "I want something that is green or blue, and I want it as a square.",
  hint: "We've got the same tools as last time, but we want the exact opposite.  How do we reverse what the machine is telling us?",
  sensors: 'YRo|',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'C-,G-',
  script: 'gniwonniw'
});

var mish_mash = new Level({
  levelname: 'Mishmash',
  levelid: 14,
  orderText: "We want cherry drops or any star that isn't blue.",
  hint: "You'll have to use all of the operators creatively.  Try making a machine that fills the first part of the order, then a machine that fills the second part. Finally, create a circuit that combines them.",
  sensors: 'RCo|',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'Ro,R|,G|,Y|',
  script: 'mishmash'
});

var combination = new Level({
  levelname: 'Combination',
  levelid: 15,
  orderText: "Green.  Only green.." ,
  hint:  "There doesn't seem to be a green sensor.  It looks like we'll have to get the other sensors working together to make up for that.",
  sensors: 'CRY',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'G*',
  script: 'combination'
});

var conditional = new Level({
  levelname: 'Conditional',
  levelid: 16,
  orderText: "I don't want any blues... unless it's a blue square.",
  hint: "Each operator gets used EXACTLY once. However, one of the sensors gets used more than once.",
  tools: ['and', 'or', 'not'],
  sensors: 'C-',
  types: ['**'],
  answers: 'C-,R*,Y*,G*',
  script: 'conditional'
});
//ADD A TUTorIAL For THIS?  short, one panel about using the sensor more than once

var fake_it = new Level({
  levelname: 'Fake it',
  levelid: 17,
  orderText: "I want blue or green... oh, and I'll be borrowing your 'or' operator.  I hope you don't need it.",
  hint: "Oh no!  Whatever will we do?  Somehow you'll have to make an 'or' operator from the 'and' operators and the 'not' operators.  ",
  tools: ['and', 'not'],
  sensors: 'CG',
  types: ['**'],
  answers: 'C*,G*',
  script: 'fake_it'
});

var fake_out = new Level({
  levelname: 'Fake out',
  levelid: 18,
  orderText: "I want yellow drops!  And your and operator!",
  hint: "Wait, hasn't this happened before?  Let's try and solve it a similar way as last time.",
  tools: ['or', 'not'],
  sensors: 'Yo',
  types: ['**'],
  answers: 'Yo',
  script: 'fake_out'
});

var stop_gap = new Level({
  levelname: 'Stop gap',
  levelid: 19,
  orderText: "I'll take anything not green... and I'll take your not operator too!",
  hint: "You can do it!",
  tools: ['and', 'or'],
  sensors: 'CGRY',
  types: ['**'],
  answers: 'C*,R*,Y*',
  script: 'stop_gap'
});

var kludge = new Level({
  levelname: 'Kludge',
  levelid: 20,
  orderText: "I want stars that aren't mint, and anything blue.  By the way, I'm loving that not operator, I hope you don't need it back!",
  hint: "When they said 'and', it's a trick of the English language.  In our world, that really means 'or'.  Anything we let pass will be a blue square or a star that isn't mint.",
  tools: ['and', 'or'],
  sensors: '|RYC',
  types: ['**'],
  answers: 'C*,R|,Y|',
  script: 'kludge'
});

var all_levels = [
    i_so_blue,
    its_a_start,
    soyl_not_green,
    flavor_unearthed,
    indecisive,
    anti_twinkle,    
    a_new_earth,
    out_on_a_lemon,
    backlash,
    speak_softly_cherry_a_stick,
    botique,
    winnowing,
    gniwonniw,
    mish_mash,
    combination,
    conditional,
    fake_it,
    fake_out,
    stop_gap,
    kludge 
];
