var i_so_blue = new Level({
  levelname: "lev01name",
  levelid: 1,
  orderText:  "lev01desc",
  hint: "lev01hint",
  sensors:  'C',
  tools: [],
  types: '*o', 
  answers: 'C*',
  script: 'i_so_blue'
});

var its_a_start = new Level({
  levelname: "lev02name",
  levelid: 2,
  orderText: "lev02desc",
  hint: "lev02hint",
  sensors: '|o-',
  tools: [],
  types: 'C*',
  answers: '*|',
  script: 'its_a_start'
});

var soyl_not_green = new Level({
  levelname: "lev03name",
  levelid: 3,
  orderText: "lev03desc",
  hint: "lev03hint",
  sensors: 'G',
  tools: ['not'],
  types: '*-',
  answers: 'C*,R*,Y*',
  script: 'soyl_not_green'
});

var flavor_unearthed = new Level({
  levelname: "lev04name",
  levelid: 4,
  orderText: "lev04desc",
  hint: "lev04hint",
  sensors: 'GC',
  tools: ['or'],
  types: '*o',
  answers: 'C*,G*',
  script: 'flavor_unearthed'
});

var indecisive = new Level({
  levelname: "lev05name",
  levelid: 5,
  orderText: "lev05desc",
  hint:  "lev05hint",
  sensors: 'CRo-',
  tools: ['or'],
  types: '**',
  answers: 'R*,*o',
  script: 'indecisive'
});

var anti_twinkle = new Level({
  levelname: "lev06name",
  levelid: 6,
  orderText: "lev06desc",
  hint: "lev06hint",
  sensors: 'Y|',
  tools: ['or', 'not'],
  types: '**',
  answers: 'Co,C-,Ro,R-,Go,G-', 
  script: 'anti_twinkle'
});

var a_new_earth = new Level({
  levelname: "lev07name",
  levelid: 7,
  orderText: "lev07desc",
  hint: "lev07hint",
  sensors: 'YR',
  tools: ['or', 'not'],
  types: '**',
  answers: 'C*,G*',
  script: 'a_new_earth'
});

var out_on_a_lemon = new Level({
  levelname: "lev08name",
  levelid: 8,
  orderText: "lev08desc",
  hint: "lev08hint",
  sensors: 'Y-',
  tools: ['and'],
  types: '**',
  answers: 'Y-',
  script: 'out_on_a_lemon'
});

var backlash = new Level({
  levelname: "lev09name",
  levelid: 9,
  orderText: "lev09desc",
  hint: "lev09hint",
  sensors: 'Y-',
  tools: ['and', 'not'],
  types: '**',
  answers: 'Yo,Y|,R*,G*,C*',
  script: 'backlash'
});

var speak_softly_cherry_a_stick = new Level({
  levelname: "lev10name",
  levelid: 10,
  orderText: "lev10desc",
  hint: "lev10hint",
  sensors: '-RY',
  tools: ['and', 'or'],
  types: '**',
  answers: 'R-,Y-',
  script: 'speak_softly_cherry_a_stick'
});


var botique = new Level({
  levelname: "lev11name",  
  levelid: 11,
  orderText: "lev11desc"  ,
  hint: "lev11hint",
  sensors: 'GY-o',
  tools: ['and', 'or'],
  types: '**',
  answers: 'Yo,G-',
  script: 'botique'
});

var winnowing = new Level({
  levelname: "lev12name",  
  levelid: 12,
  orderText: "lev12desc",
  hint: "lev12hint",
  sensors: 'YRo|',
  tools: ['and', 'or', 'not'],
  types: '**',
  answers: 'Ro,R|,Yo,Y|',
  script: 'winnowing'
});

var gniwonniw = new Level({
  levelname: "lev13name",
  levelid: 13,
  orderText: "lev13desc",
  hint: "lev13hint",
  sensors: 'YRo|',
  tools: ['and', 'or', 'not'],
  types: '**',
  answers: 'C-,G-',
  script: 'gniwonniw'
});

var mish_mash = new Level({
  levelname: "lev14name",
  levelid: 14,
  orderText: "lev14desc",
  hint: "lev14hint",
  sensors: 'RCo|',
  tools: ['and', 'or', 'not'],
  types: '**',
  answers: 'Ro,R|,G|,Y|',
  script: 'mishmash'
});

var combination = new Level({
  levelname: "lev15name",
  levelid: 15,
  orderText:"lev15desc" ,
  hint:  "lev15hint",
  sensors: 'CRY',
  tools: ['and', 'or', 'not'],
  types: '**',
  answers: 'G*',
  script: 'combination'
});

var conditional = new Level({
  levelname: "lev16name",
  levelid: 16,
  orderText: "lev16desc",
  hint: "lev16hint",
  tools: ['and', 'or', 'not'],
  sensors: 'C-',
  types: '**',
  answers: 'C-,R*,Y*,G*',
  script: 'conditional'
});
//ADD A TUTorIAL For THIS?  short, one panel about using the sensor more than once

var fake_it = new Level({
  levelname: "lev17name",
  levelid: 17,
  orderText: "lev17desc",
  hint: "lev17hint",
  tools: ['and', 'not'],
  sensors: 'CG',
  types: '**',
  answers: 'C*,G*',
  script: 'fake_it'
});

var fake_out = new Level({
  levelname: "lev18name",
  levelid: 18,
  orderText: "lev18desc",
  hint: "lev18hint",
  tools: ['or', 'not'],
  sensors: 'Yo',
  types: '**',
  answers: 'Yo',
  script: 'fake_out'
});

var stop_gap = new Level({
  levelname: "lev19name",
  levelid: 19,
  orderText: "lev19desc",
  hint: "lev19hint",
  tools: ['and', 'or'],
  sensors: 'CGRY',
  types: '**',
  answers: 'C*,R*,Y*',
  script: 'stop_gap'
});

var kludge = new Level({
  levelname: "lev20name",
  levelid: 20,
  orderText: "lev20desc",
  hint: "lev20hint",
  tools: ['and', 'or'],
  sensors: '|RYC',
  types: '**',
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
