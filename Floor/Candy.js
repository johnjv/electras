function Candy(type, levelSays, circuitSays){
	this.type = type;
	this.picture = this.setCandyPicture();
	this.levelSays = levelSays;
	this.circuitSays = circuitSays;
	this.src = this.getPicSource();
}

Candy.prototype.getCandyType = function(){
	return this.type;
};

Candy.prototype.setCandyPicture = function(){
	"use strict";
	var sourcePic = this.getPicSource();
	var picture = $(sourcePic);
	return picture;
};

Candy.prototype.getPicSource = function(){
		"use strict";
	var candy;
	candy = this.type;
	candy = $.trim(candy);
	var num =  new Array();
	if(candy[0] === 'C')
	    num[0] = '0';
	else if(candy[0] === 'R')
	    num[0] = '1';
	else if(candy[0] === 'G')
	    num[0] = '2';
	else if(candy[0] === 'Y')
	    num[0] = '3';
	if(candy[1] === 'o')
	    num[1] = '0';
	if(candy[1] === '|')
	    num[1] = '1';
	if(candy[1] === '-')
	    num[1] = '2';
	
	var src = "<img src=../Floor/resource-image/candy" + num[0]+ num[1] + ".png class='srcCandy'></img>";
	return src;
};


Candy.prototype.checkCandy = function(){
	"use strict";
	var value;
	if(this.circuitSays.accept === false) {
		if(this.levelSays) {
			value = 0;
		}
		else{
			value = -1;
		}
	}
		
	else {
		if(this.levelSays) {
			value = 1;
		}
		else{
			value = 2;
		}
	}
	return value;
};
