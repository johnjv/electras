var allLevels = (function ($) {
	"use strict";

	function Level(data) {
		this.id = 0;
		this.title = 'undefined';
		this.orderText = 'undefined';
		this.hint = 'undefined';
		this.sensors = data.sensors;
		this.tools = data.tools;
		if (data.hasOwnProperty('types')) {
			this.types = data.types;
		} else {
			this.types = '**';
		}
		this.script = data.script;
		this.answers = data.answers;
		this.complete = false;
		this.hintShown = false;
	}

	var allLevels = [
		new Level({
			script: 'i_so_blue',
			sensors:  'C',
			tools: [],
			types: '*o', 
			answers: 'C*'
		}),

		new Level({
			script: 'its_a_start',
			sensors: '|o-',
			tools: [],
			types: 'C*',
			answers: '*|'
		}),

		new Level({
			script: 'soyl_not_green',
			sensors: 'G',
			tools: ['not'],
			types: '*-',
			answers: 'C*,R*,Y*'
		}),

		new Level({
			script: 'flavor_unearthed',
			sensors: 'GC',
			tools: ['or'],
			types: '*o',
			answers: 'C*,G*'
		}),

		new Level({
			script: 'indecisive',
			sensors: 'CRo-',
			tools: ['or'],
			answers: 'R*,*o'
		}),

		new Level({
			script: 'anti_twinkle',
			sensors: 'Y|',
			tools: ['or', 'not'],
			answers: 'Co,C-,Ro,R-,Go,G-'
		}),

		new Level({
			script: 'a_new_earth',
			sensors: 'YR',
			tools: ['or', 'not'],
			answers: 'C*,G*'
		}),

		new Level({
			script: 'out_on_a_lemon',
			sensors: 'Y-',
			tools: ['and'],
			answers: 'Y-'
		}),

		new Level({
			script: 'backlash',
			sensors: 'Y-',
			tools: ['and', 'not'],
			answers: 'Yo,Y|,R*,G*,C*'
		}),

		new Level({
			script: 'speak_softly_cherry_a_stick',
			sensors: '-RY',
			tools: ['and', 'or'],
			answers: 'R-,Y-'
		}),

		new Level({
			script: 'botique',
			sensors: 'GY-o',
			tools: ['and', 'or'],
			answers: 'Yo,G-'
		}),

		new Level({
			script: 'winnowing',
			sensors: 'YRo|',
			tools: ['and', 'or', 'not'],
			answers: 'Ro,R|,Yo,Y|'
		}),

		new Level({
			script: 'gniwonniw',
			sensors: 'YRo|',
			tools: ['and', 'or', 'not'],
			answers: 'C-,G-'
		}),

		new Level({
			script: 'mishmash',
			sensors: 'RCo|',
			tools: ['and', 'or', 'not'],
			answers: 'Ro,R|,G|,Y|'
		}),

		new Level({
			script: 'combination',
			sensors: 'CRY',
			tools: ['and', 'or', 'not'],
			answers: 'G*'
		}),

		new Level({
			script: 'conditional',
			tools: ['and', 'or', 'not'],
			sensors: 'C-',
			answers: 'C-,R*,Y*,G*'
		}),
			//ADD A TUTorIAL For THIS?  short, one panel about using the sensor more than once

		new Level({
			script: 'fake_it',
			tools: ['and', 'not'],
			sensors: 'CG',
			answers: 'C*,G*'
		}),

		new Level({
			script: 'fake_out',
			tools: ['or', 'not'],
			sensors: 'Yo',
			answers: 'Yo'
		}),

		new Level({
			script: 'stop_gap',
			tools: ['and', 'or'],
			sensors: 'CGRY',
			answers: 'C*,R*,Y*'
		}),

		new Level({
			script: 'kludge',
			tools: ['and', 'or'],
			sensors: '|RYC',
			answers: 'C*,R|,Y|'
		})
	];

	$.each(allLevels, function (i, level) {
		var prefix;
		level.id = i;

		if (i < 9) {
			prefix = 'lev0' + (i + 1);
		} else {
			prefix = 'lev' + (i + 1);
		}
		level.title = prefix + 'name';
		level.orderText = prefix + 'desc';
		level.hint = prefix + 'hint';
	});

	return allLevels;
}(jQuery));
