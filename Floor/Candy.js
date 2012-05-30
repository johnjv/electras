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
	
	var picture = $("<img src=../Floor/resource-image/candy" + num[0]+ num[1] + ".png class='candy'></img>");
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
			console.log("This candy should not be accepted by machine, but the level says it should, pushed away and marked with an X");
		}
		else{
			value = -1;
			console.log("This candy is not accepted by both the circuit or the level, therefore it is pushed out of the way");
		}
	}
		
	else {
		if(this.levelSays) {
			value = 1;
			console.log("This candy is accepted by both the level and the circuit, therefore this is a correct candy and should be kept");
		}
		else{
			value = 2;
			console.log("This candy should be accepted by the machine, but the level says it should not, therefore it is kept and marked with an X");
		}
	}
	return value;
};
