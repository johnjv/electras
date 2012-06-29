function Level(data) {
	this.levelid = data.levelid;
	this.levelname = data.levelname;
	this.orderText = data.orderText;
	this.hint = data.hint;
	this.sensors = data.sensors;
	this.tools = data.tools;
	this.types = data.types;
	this.script = data.script;
	this.answers = data.answers;
	this.complete = false;
}

var all_levels = [
	new Level({
		script: 'i_so_blue',
		levelname: "lev01name",
		levelid: 1,
		orderText:  "lev01desc",
		hint: "lev01hint",
		sensors:  'C',
		tools: [],
		types: '*o', 
		answers: 'C*'
	}),

	new Level({
		script: 'its_a_start',
		levelname: "lev02name",
		levelid: 2,
		orderText: "lev02desc",
		hint: "lev02hint",
		sensors: '|o-',
		tools: [],
		types: 'C*',
		answers: '*|'
	}),

	new Level({
		script: 'soyl_not_green',
		levelname: "lev03name",
		levelid: 3,
		orderText: "lev03desc",
		hint: "lev03hint",
		sensors: 'G',
		tools: ['not'],
		types: '*-',
		answers: 'C*,R*,Y*'
	}),

	new Level({
		script: 'flavor_unearthed',
		levelname: "lev04name",
		levelid: 4,
		orderText: "lev04desc",
		hint: "lev04hint",
		sensors: 'GC',
		tools: ['or'],
		types: '*o',
		answers: 'C*,G*'
	}),

	new Level({
		script: 'indecisive',
		levelname: "lev05name",
		levelid: 5,
		orderText: "lev05desc",
		hint:  "lev05hint",
		sensors: 'CRo-',
		tools: ['or'],
		types: '**',
		answers: 'R*,*o'
	}),

	new Level({
		script: 'anti_twinkle',
		levelname: "lev06name",
		levelid: 6,
		orderText: "lev06desc",
		hint: "lev06hint",
		sensors: 'Y|',
		tools: ['or', 'not'],
		types: '**',
		answers: 'Co,C-,Ro,R-,Go,G-'
	}),

	new Level({
		script: 'a_new_earth',
		levelname: "lev07name",
		levelid: 7,
		orderText: "lev07desc",
		hint: "lev07hint",
		sensors: 'YR',
		tools: ['or', 'not'],
		types: '**',
		answers: 'C*,G*'
	}),

	new Level({
		script: 'out_on_a_lemon',
		levelname: "lev08name",
		levelid: 8,
		orderText: "lev08desc",
		hint: "lev08hint",
		sensors: 'Y-',
		tools: ['and'],
		types: '**',
		answers: 'Y-'
	}),

	new Level({
		script: 'backlash',
		levelname: "lev09name",
		levelid: 9,
		orderText: "lev09desc",
		hint: "lev09hint",
		sensors: 'Y-',
		tools: ['and', 'not'],
		types: '**',
		answers: 'Yo,Y|,R*,G*,C*'
	}),

	new Level({
		script: 'speak_softly_cherry_a_stick',
		levelname: "lev10name",
		levelid: 10,
		orderText: "lev10desc",
		hint: "lev10hint",
		sensors: '-RY',
		tools: ['and', 'or'],
		types: '**',
		answers: 'R-,Y-'
	}),

	new Level({
		script: 'botique',
		levelname: "lev11name",  
		levelid: 11,
		orderText: "lev11desc"  ,
		hint: "lev11hint",
		sensors: 'GY-o',
		tools: ['and', 'or'],
		types: '**',
		answers: 'Yo,G-'
	}),

	new Level({
		script: 'winnowing',
		levelname: "lev12name",  
		levelid: 12,
		orderText: "lev12desc",
		hint: "lev12hint",
		sensors: 'YRo|',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'Ro,R|,Yo,Y|'
	}),

	new Level({
		script: 'gniwonniw',
		levelname: "lev13name",
		levelid: 13,
		orderText: "lev13desc",
		hint: "lev13hint",
		sensors: 'YRo|',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'C-,G-'
	}),

	new Level({
		script: 'mishmash',
		levelname: "lev14name",
		levelid: 14,
		orderText: "lev14desc",
		hint: "lev14hint",
		sensors: 'RCo|',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'Ro,R|,G|,Y|'
	}),

	new Level({
		script: 'combination',
		levelname: "lev15name",
		levelid: 15,
		orderText:"lev15desc" ,
		hint:  "lev15hint",
		sensors: 'CRY',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'G*'
	}),

	new Level({
		script: 'conditional',
		levelname: "lev16name",
		levelid: 16,
		orderText: "lev16desc",
		hint: "lev16hint",
		tools: ['and', 'or', 'not'],
		sensors: 'C-',
		types: '**',
		answers: 'C-,R*,Y*,G*'
	}),
		//ADD A TUTorIAL For THIS?  short, one panel about using the sensor more than once

	new Level({
		script: 'fake_it',
		levelname: "lev17name",
		levelid: 17,
		orderText: "lev17desc",
		hint: "lev17hint",
		tools: ['and', 'not'],
		sensors: 'CG',
		types: '**',
		answers: 'C*,G*'
	}),

	new Level({
		script: 'fake_out',
		levelname: "lev18name",
		levelid: 18,
		orderText: "lev18desc",
		hint: "lev18hint",
		tools: ['or', 'not'],
		sensors: 'Yo',
		types: '**',
		answers: 'Yo'
	}),

	new Level({
		script: 'stop_gap',
		levelname: "lev19name",
		levelid: 19,
		orderText: "lev19desc",
		hint: "lev19hint",
		tools: ['and', 'or'],
		sensors: 'CGRY',
		types: '**',
		answers: 'C*,R*,Y*'
	}),

	new Level({
		script: 'kludge',
		levelname: "lev20name",
		levelid: 20,
		orderText: "lev20desc",
		hint: "lev20hint",
		tools: ['and', 'or'],
		sensors: '|RYC',
		types: '**',
		answers: 'C*,R|,Y|'
	})
];
