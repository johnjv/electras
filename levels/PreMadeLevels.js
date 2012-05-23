var all_my_chocolates = new Level({
  levelname: 'All my chocolates',  
  levelid: 1,
  orderText:  "Give me every chocolate you make!",
  hint: 'You should connect the chocolate sensor to the lightbulb by clicking on the connectors.',
  sensors:  'C',
  tools: [],
  types:  ['*o'], 
  answers: 'C*',
  script: 'all_my_chocolates'
});

var a_bar_walks_into_my_tummy = new Level({
  levelname: 'A bar walks into my tummy',  
  levelid: 2,
  orderText: 'I only want bar-shaped candies',
  hint: "You have some choices.  Remember, bar-shaped candies are rectangular.",
  sensors: '|o-',
  tools: [],
  types: ['C*'],
  answers: '*-',
  script: 'a_bar_walks_into_my_tummy'
});

var soyl_not_green = new Level({
  levelname: 'Soyl, not green',
  levelid: 3,
  orderText: "I want everything that's not green!",
  hint: "You can add components now!  Try placing the 'NOT' component between the lightbulb and the green sensor and see what happens.",
  sensors: 'G',
  tools: ['NOT'],
  types: ['*-'],
  answers: 'C*,R*,Y*',
  script: 'soyl_not_green'
});

var mint_chocolate = new Level({
  levelname: 'Mint chocolate',
  levelid: 4,
  orderText: 'I want to combine mint candies and chocolate candies into something EXTREMELY delicious.',
  hint: "This is the OR component.  It takes two inputs and lights up if either of them are on.  Try connecting" +
      " a green and a brown sensor to it.",
  sensors: 'GC',
  tools: ['OR'],
  types: ['*o'],
  answers: 'C*,G*',
  script: 'mint_chocolate'
});

var indecisive = new Level({
  levelname: 'Indecisive',
  levelid: 5,
  orderText: "I really like cherries, but I'm not sure if it's their flavor or their round shape." +
      "  Get me some things that are either round OR cherry-flavored, so I can decide.",
  hint:  "They want things that are round OR cherry-flavored.  This looks similar to what you did in the last level.",
  sensors: 'CRo-',
  tools: ['OR'],
  types: ['**'],
  answers: 'R*,*o',
  script: 'indecisive'
});

var picky = new Level({
  levelname: 'Picky',
  levelid: 6,
  orderText: "I don't know what I like, but I know what I don't like:  lemons and sticks.  Don't give me any lemons and don't give me any sticks.",
  hint: "You'll have to combine an OR with either one or two NOTs.",
  sensors: 'Y|',
  tools: ['OR', 'NOT'],
  types: ['**'],
  answers: 'Co,C-,Ro,R-,Go,G-', 
  script: 'picky'
});

var mint_chocolate_returns = new Level({
  levelname: 'Mint chocolate returns',
  levelid: 7,
  orderText: "I only want candies that are mint or chocolate.  I don't care if you got the wrong sensors, you can figure it out!",
  hint: "Looks like whoever delivers our sensors messed up and gave us the wrong ones!  You'll just have to use your brains to overcome that.",
  sensors: 'YR',
  tools: ['OR', 'NOT'],
  types: ['**'],
  answers: 'C*,G*',
  script: 'mint_chocolate_returns'
});

var classic = new Level({
  levelname: 'Classic',
  levelid: 8,
  orderText: "I want chocolate bars.  Not chocolate spheres, or cherry bars, but only things that are chocolate AND bars.",
  hint: "The AND operator combines two different sensors, and only lights up it both are true",
  sensors: 'C-',
  tools: ['AND'],
  types: ['**'],
  answers: 'C-',
  script: 'classic'
});

var backlash = new Level({
  levelname: 'Backlash',
  levelid: 9,
  orderText: "Oh, that was a disaster!  Now my customers won't take chocolate bars!  I want everything that is NOT a chocolate bar.",
  hint: "We want the OPPOSITE of last time.  What operator gives you the opposite?",
  sensors: 'C-',
  tools: ['AND', 'NOT'],
  types: ['**'],
  answers: 'Co,C|,R*,G*,Y*',
  script: 'backlash'
});

var speak_softly_cherry_a_stick = new Level({
  levelname: 'Speak softly, cherry a stick',
  levelid: 10,
  orderText: "I want Cherry bars and Lemon bars.",
  hint: "There are only so many ways to combine these operators and sensors.  Keep trying!",
  sensors: '-RY',
  tools: ['AND', 'OR'],
  types: ['**'],
  answers: 'C-,Y-',
  script: 'speak_softly_cherry_a_stick'
});


var botique = new Level({
  levelname: 'Botique',  
  levelid: 11,
  orderText: "I want lemon bars and chocolate balls. But not lemon balls or chocolate bars! "  ,
  hint: "Make something that finds lemon bars, then something that finds chocolate balls, then combine them.",
  sensors: 'CY-o',
  tools: ['AND', 'OR'],
  types: ['**'],
  answers: 'Y-,Co',
  script: 'botique'
});

var winnowing = new Level({
  levelname: 'Winnowing',  
  levelid: 12,
  orderText: "I want something cherry or lemon, and I want it in either a ball or a stick shape.",
  hint: "You'll have to combine an AND and two ORs to make this work.",
  sensors: 'YRo|',
  tools: ['AND', 'OR', 'NOT'],
  types: ['**'],
  answers: 'Ro,R|,Yo,Y|',
  script: 'winnowing'
});

var gniwonniw = new Level({
  levelname: 'Gniwonniw',
  levelid: 13,
  orderText: "I want something that is mint or chocolate, and I want it as a bar.",
  hint: "We've got the same tools as last time, but we want the exact opposite.  How do we reverse what the machine is telling us?",
  sensors: 'YRo|',
  tools: ['AND', 'OR', 'NOT'],
  types: ['**'],
  answers: 'C-,G-',
  script: 'gniwonniw'
});

var mish_mash = new Level({
  levelname: 'Mishmash',
  levelid: 14,
  orderText: "We want cherry bars or any ball that isn't chocolate.",
  hint: "You'll have to use all of the operators creatively.  Try making a machine that fills the first part of the order, then a machine that fills the second part, then one that combines them.",
  sensors: 'RCo|',
  tools: ['AND', 'OR', 'NOT'],
  types: ['**'],
  answers: 'R-,Ro,Go,Yo',
  script: 'mishmash'
});

var combination = new Level({
  levelname: 'Combination',
  levelid: 15,
  orderText: "Mint.  ONLY MINT." ,
  hint:  "There doesn't seem to be a mint sensor.  It looks like we'll have to get the other sensors working together to make up for that.",
  sensors: 'CRY',
  tools: ['AND', 'OR', 'NOT'],
  types: ['**'],
  answers: 'G*',
  script: 'combination'
});

var conditional = new Level({
  levelname: 'Conditional',
  levelid: 16,
  orderText: "I don't want any chocolates... unless it's a chocolate bar.",
  hint: "Each operator gets used EXACTLY once, and one of the sensors gets used more than once.",
  tools: ['AND', 'OR', 'NOT'],
  sensors: 'C-',
  types: ['**'],
  answers: 'C-,R*,Y*,G*',
  script: 'conditional'
});
//ADD A TUTORIAL FOR THIS?  short, one panel about using the sensor more than once

var fake_it = new Level({
  levelname: 'Fake it',
  levelid: 17,
  orderText: "I want chocolate OR mint... oh, and I'll be borrowing your OR operator.  I hope you don't need it.",
  hint: "Oh no!  Whatever will we do?  Somehow you'll have to make an OR operator from the AND and NOT operators.  ",
  tools: ['AND', 'NOT'],
  sensors: 'CG',
  types: ['**'],
  answers: 'C*,G*',
  script: 'fake_it'
});

var fake_out = new Level({
  levelname: 'Fake out',
  levelid: 18,
  orderText: "I want lemon balls!  And your AND operator!",
  hint: "Wait, hasn't this happened before?  Let's try and solve it the same way as last time.",
  tools: ['OR', 'NOT'],
  sensors: 'Yo',
  types: ['**'],
  answers: 'Yo',
  script: 'fake_out'
});

var stop_gap = new Level({
  levelname: 'Stop gap',
  levelid: 19,
  orderText: "I'll take anything not mint... and I'll take your NOT operator too!",
  hint: "",
  tools: ['AND', 'OR'],
  sensors: 'CGRY',
  types: ['**'],
  answers: 'C*,R*,Y*',
  script: 'stop_gap'
});

var kludge = new Level({
  levelname: 'Kludge',
  levelid: 20,
  orderText: "I want chocolate balls and sticks that aren't mint.  By the way, I'm loving that NOT operator, I hope you don't need it back!",
  hint: "When they said 'and', it's a trick of the English language.  In our world, that means OR.  Anything we let pass will be a chocolate bar OR a stick that isn't mint.",
  tools: ['AND', 'OR'],
  sensors: '|RYCo',
  types: ['**'],
  answers: 'Co,C|,R|,Y|',
  script: 'kludge'
});
//need to edit this to get it down to 4 sensors

var all_levels = [
    all_my_chocolates,
    a_bar_walks_into_my_tummy,
    soyl_not_green,
    mint_chocolate,
    indecisive,
    picky,
    mint_chocolate_returns,
    classic,
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
