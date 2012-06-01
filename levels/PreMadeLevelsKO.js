var i_so_blue = new Level({
  levelname: '푸른사탕',
  levelid: 1,
  orderText:  "모든 푸른 사탕을 주세요!",
  hint: '푸른색 감지기를 전구에 연결하세요.',
  sensors:  'C',
  tools: [],
  types:  ['*o'], 
  answers: 'C*',
  script: 'i_so_blue'
});

var its_a_start = new Level({
  levelname: '별사탕',
  levelid: 2,
  orderText: '별사탕만 주세요. 맛은 상과없어요.',
  hint: "별사탕 감지기를 쓰세요.",
  sensors: '|o-',
  tools: [],
  types: ['C*'],
  answers: '*|',
  script: 'its_a_start'
});

var soyl_not_green = new Level({
  levelname: '박하사탕은 빼줘',
  levelid: 3,
  orderText: "녹색 사탕만 빼고 다 주세요!",
  hint: "이제는 부품을 쓸수 있다!  'NOT' 부품을 감지기와 전구가운데에 쓰세요.",
  sensors: 'G',
  tools: ['not'],
  types: ['*-'],
  answers: 'C*,R*,Y*',
  script: 'soyl_not_green'
});

var flavor_unearthed = new Level({
  levelname: '하늘과 땅',
  levelid: 4,
  orderText: '하늘같이 푸른 사탕 이랑 지구같이 새의 사탕을 주세요.',
  hint: "'OR' 부품에 녹색 감지기와 푸른 감지기를 연결하면…",
  sensors: 'GC',
  tools: ['or'],
  types: ['*o'],
  answers: 'C*,G*',
  script: 'flavor_unearthed'
});

var indecisive = new Level({
  levelname: '몰라!',
  levelid: 5,
  orderText: "체리를 정말로 좋아하는데, 색깔때문인지, 아니면 동그란 모양때문인지 이유를 모르갯어. 동그란 사탕이나 아니면 빨간 사탕을 보내주세요.",
  hint:  "빨간 사탕이나 동그란 사탕을 보내주세요.  방금전에 푼 퍼즐이랑 비슷합니다.",
  sensors: 'CRo-',
  tools: ['or'],
  types: ['**'],
  answers: 'R*,*o',
  script: 'indecisive'
});

var anti_twinkle = new Level({
  levelname: '반짝이지 마!',
  levelid: 6,
  orderText: "난 무엇을 좋아하는진 몰라도, 레몬과 별사탕은 정말로 않좋아해요. 이런 사탕만 빼고 나머지만 주세요.",
  hint: "하나의 'or' 부품에 하나, 또는 두 개의 'not' 부품에 연결해야 될께에요.",
  sensors: 'Y|',
  tools: ['or', 'not'],
  types: ['**'],
  answers: 'Co,C-,Ro,R-,Go,G-', 
  script: 'anti_twinkle'
});

var a_new_earth = new Level({
  levelname: '다른 땅과 하늘',
  levelid: 7,
  orderText: "지나번 같이 푸른색 사탕과 녹색 사탕을 주세요. 하지만 내가 엉뚱한 감지기를 보냇내요, 미안해요!",
  hint: "필요한 감지기가 없서도 이 주문은 채울수 있서요. 조금 생각을 더 해봐요.",
  sensors: 'YR',
  tools: ['or', 'not'],
  types: ['**'],
  answers: 'C*,G*',
  script: 'a_new_earth'
});

var out_on_a_lemon = new Level({
  levelname: '네모 레몬',
  levelid: 8,
  orderText: "노란 네모만 주세요.  노란 방울, 빨간 네모는 빼고, 노란 네모만.",
  hint: " 'and' 부속을 쓰세요. 이 부품은 두게의 입력이 동시에 '진실' 일때만 전구를 켜집니다.",
  sensors: 'Y-',
  tools: ['and'],
  types: ['**'],
  answers: 'Y-',
  script: 'out_on_a_lemon'
});

var backlash = new Level({
  levelname: '쓴 맛',
  levelid: 9,
  orderText: "아, 이제는 아무도 네모양 레몬 사탕을 원하지 않아요!  지금 빨리 그것만 빼고 다른 사탕을 주세요!",
  hint: "어떻게 해야 반대 결과가 나올까요?",
  sensors: 'Y-',
  tools: ['and', 'not'],
  types: ['**'],
  answers: 'Yo,Y|,R*,G*,C*',
  script: 'backlash'
});

var speak_softly_cherry_a_stick = new Level({
  levelname: '빨간 네모, 레몬 네모',
  levelid: 10,
  orderText: "이번에는 빨간 네모와 노란 네모만 주세요.",
  hint: "노력해봐요!",
  sensors: '-RY',
  tools: ['and', 'or'],
  types: ['**'],
  answers: 'R-,Y-',
  script: 'speak_softly_cherry_a_stick'
});


var botique = new Level({
  levelname: '부티크',  
  levelid: 11,
  orderText: "노란 방울 사탕과 녹색 네모 사탕만! 노란 네모나 녹색 방울은 빼줘요!"  ,
  hint: "노란 방울사탕을 선택하는 회로를 녹색 네모를 고르는 회로랑 결합하세요.",
  sensors: 'GY-o',
  tools: ['and', 'or'],
  types: ['**'],
  answers: 'Yo,G-',
  script: 'botique'
});

var winnowing = new Level({
  levelname: '선별',  
  levelid: 12,
  orderText: "빨간색이나 노란색 사탕들을 별 이나 방울모양의로 보내세요.",
  hint: " 'and' 부품 하나와 두개의 'or' 부속을 쓰세요.",
  sensors: 'YRo|',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'Ro,R|,Yo,Y|',
  script: 'winnowing'
});

var gniwonniw = new Level({
  levelname: '나머지만',
  levelid: 13,
  orderText: "푸른색이랑 녹색 네모를 주세요.",
  hint: "지나번이랑 비슷하내요.어떻게 해야 반대 결과가 나올까요?",
  sensors: 'YRo|',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'C-,G-',
  script: 'gniwonniw'
});

var mish_mash = new Level({
  levelname: '뒤범벅',
  levelid: 14,
  orderText: "빨간 방울이나 파라지 않는 별사탕을 주문할께요.",
  hint: "부속들을 창조적으로 사용 해야 되요.  첫 번째 부분을 채우는 기계를 만들어보세요. 다음에는 나머지 주문을 채우는 회로를 많들어 봐요. 마지막의로 두게의 회로를 결합시켜요!",
  sensors: 'RCo|',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'Ro,R|,G|,Y|',
  script: 'mishmash'
});

var combination = new Level({
  levelname: '결합',
  levelid: 15,
  orderText: "녹색만…" ,
  hint:  "녹색 감지기가 없어도 다른 감지기들을 이용해서 주문을 채우세요.",
  sensors: 'CRY',
  tools: ['and', 'or', 'not'],
  types: ['**'],
  answers: 'G*',
  script: 'combination'
});

var conditional = new Level({
  levelname: '조건',
  levelid: 16,
  orderText: "푸른 네모가 아니면, 푸른색 사탕은 절대로 보내지 마세요.",
  hint: "부품은 한번만 이용하지만, 감지기들은 여러 번 쓸것입니다.",
  tools: ['and', 'or', 'not'],
  sensors: 'C-',
  types: ['**'],
  answers: 'C-,R*,Y*,G*',
  script: 'conditional'
});
//ADD A TUTorIAL For THIS?  short, one panel about using the sensor more than once

var fake_it = new Level({
  levelname: '가짜 부속',
  levelid: 17,
  orderText: "푸른색 사탕과 녹색 사탕을 주문할께요. 하지만 'or' 부속은 쓰지 마세요.",
  hint: "'and' 와 'not' 부품들을 써서 'or' 부품을 만드세요.",
  tools: ['and', 'not'],
  sensors: 'CG',
  types: ['**'],
  answers: 'C*,G*',
  script: 'fake_it'
});

var fake_out = new Level({
  levelname: '또 다른 가짜',
  levelid: 18,
  orderText: "노란 방울사탕만… 또 'and' 부속은 쓰지 마세요.",
  hint: "지나번이랑 정말 비슷하네요.",
  tools: ['or', 'not'],
  sensors: 'Yo',
  types: ['**'],
  answers: 'Yo',
  script: 'fake_out'
});

var stop_gap = new Level({
  levelname: '방해',
  levelid: 19,
  orderText: "녹색만 빼고 다 주세요. 'not' 부속은 사용하지 마세요. ",
  hint: "생각해봐요!",
  tools: ['and', 'or'],
  sensors: 'CGRY',
  types: ['**'],
  answers: 'C*,R*,Y*',
  script: 'stop_gap'
});

var kludge = new Level({
  levelname: '짬뽕',
  levelid: 20,
  orderText: "녹색과 파란색인 사탕들은 빼주세요. 'not' 부속은 쓰지마세요.",
  hint: "논리회로에서 'and' 부속이 어떻게 'or' 부품이 되나요? 우리는 파란 네모외 녹색이 아닌 사탕을 원한다는것을 생각해 보세요. ",
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
