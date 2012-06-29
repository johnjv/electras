function Level(data) {
	this.id = data.id;
	this.title = data.title;
	this.orderText = data.orderText;
	this.hint = data.hint;
	this.sensors = data.sensors;
	this.tools = data.tools;
	this.types = data.types;
	this.script = data.script;
	this.answers = data.answers;
	this.complete = false;
}

var allLevels = [
	new Level({
		script: 'i_so_blue',
		title: "lev01name",
		id: 1,
		orderText:  "lev01desc",
		hint: "lev01hint",
		sensors:  'C',
		tools: [],
		types: '*o', 
		answers: 'C*'
	}),

	new Level({
		script: 'its_a_start',
		title: "lev02name",
		id: 2,
		orderText: "lev02desc",
		hint: "lev02hint",
		sensors: '|o-',
		tools: [],
		types: 'C*',
		answers: '*|'
	}),

	new Level({
		script: 'soyl_not_green',
		title: "lev03name",
		id: 3,
		orderText: "lev03desc",
		hint: "lev03hint",
		sensors: 'G',
		tools: ['not'],
		types: '*-',
		answers: 'C*,R*,Y*'
	}),

	new Level({
		script: 'flavor_unearthed',
		title: "lev04name",
		id: 4,
		orderText: "lev04desc",
		hint: "lev04hint",
		sensors: 'GC',
		tools: ['or'],
		types: '*o',
		answers: 'C*,G*'
	}),

	new Level({
		script: 'indecisive',
		title: "lev05name",
		id: 5,
		orderText: "lev05desc",
		hint:  "lev05hint",
		sensors: 'CRo-',
		tools: ['or'],
		types: '**',
		answers: 'R*,*o'
	}),

	new Level({
		script: 'anti_twinkle',
		title: "lev06name",
		id: 6,
		orderText: "lev06desc",
		hint: "lev06hint",
		sensors: 'Y|',
		tools: ['or', 'not'],
		types: '**',
		answers: 'Co,C-,Ro,R-,Go,G-'
	}),

	new Level({
		script: 'a_new_earth',
		title: "lev07name",
		id: 7,
		orderText: "lev07desc",
		hint: "lev07hint",
		sensors: 'YR',
		tools: ['or', 'not'],
		types: '**',
		answers: 'C*,G*'
	}),

	new Level({
		script: 'out_on_a_lemon',
		title: "lev08name",
		id: 8,
		orderText: "lev08desc",
		hint: "lev08hint",
		sensors: 'Y-',
		tools: ['and'],
		types: '**',
		answers: 'Y-'
	}),

	new Level({
		script: 'backlash',
		title: "lev09name",
		id: 9,
		orderText: "lev09desc",
		hint: "lev09hint",
		sensors: 'Y-',
		tools: ['and', 'not'],
		types: '**',
		answers: 'Yo,Y|,R*,G*,C*'
	}),

	new Level({
		script: 'speak_softly_cherry_a_stick',
		title: "lev10name",
		id: 10,
		orderText: "lev10desc",
		hint: "lev10hint",
		sensors: '-RY',
		tools: ['and', 'or'],
		types: '**',
		answers: 'R-,Y-'
	}),

	new Level({
		script: 'botique',
		title: "lev11name",  
		id: 11,
		orderText: "lev11desc"  ,
		hint: "lev11hint",
		sensors: 'GY-o',
		tools: ['and', 'or'],
		types: '**',
		answers: 'Yo,G-'
	}),

	new Level({
		script: 'winnowing',
		title: "lev12name",  
		id: 12,
		orderText: "lev12desc",
		hint: "lev12hint",
		sensors: 'YRo|',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'Ro,R|,Yo,Y|'
	}),

	new Level({
		script: 'gniwonniw',
		title: "lev13name",
		id: 13,
		orderText: "lev13desc",
		hint: "lev13hint",
		sensors: 'YRo|',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'C-,G-'
	}),

	new Level({
		script: 'mishmash',
		title: "lev14name",
		id: 14,
		orderText: "lev14desc",
		hint: "lev14hint",
		sensors: 'RCo|',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'Ro,R|,G|,Y|'
	}),

	new Level({
		script: 'combination',
		title: "lev15name",
		id: 15,
		orderText:"lev15desc" ,
		hint:  "lev15hint",
		sensors: 'CRY',
		tools: ['and', 'or', 'not'],
		types: '**',
		answers: 'G*'
	}),

	new Level({
		script: 'conditional',
		title: "lev16name",
		id: 16,
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
		title: "lev17name",
		id: 17,
		orderText: "lev17desc",
		hint: "lev17hint",
		tools: ['and', 'not'],
		sensors: 'CG',
		types: '**',
		answers: 'C*,G*'
	}),

	new Level({
		script: 'fake_out',
		title: "lev18name",
		id: 18,
		orderText: "lev18desc",
		hint: "lev18hint",
		tools: ['or', 'not'],
		sensors: 'Yo',
		types: '**',
		answers: 'Yo'
	}),

	new Level({
		script: 'stop_gap',
		title: "lev19name",
		id: 19,
		orderText: "lev19desc",
		hint: "lev19hint",
		tools: ['and', 'or'],
		sensors: 'CGRY',
		types: '**',
		answers: 'C*,R*,Y*'
	}),

	new Level({
		script: 'kludge',
		title: "lev20name",
		id: 20,
		orderText: "lev20desc",
		hint: "lev20hint",
		tools: ['and', 'or'],
		sensors: '|RYC',
		types: '**',
		answers: 'C*,R|,Y|'
	})
];
