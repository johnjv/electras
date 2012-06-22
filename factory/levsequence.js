var computeSequence = (function ($, Circuit) {
	"use strict";

	function SequenceItem(type, levelSays, circuitSays) {
		this.type = type;		
		this.levelSays = levelSays;	
		this.circuitSays = circuitSays;
	}

	function levelCandyDescriptionToArray(candies) {
		var possible, tokens, k, type, colors, shapes, i, j, candy;
		possible = [];
		tokens = candies.split(',');
		for (k = 0; k < tokens.length; k += 1) {
			type = tokens[k];
			colors = [type.substring(0, 1)];
			shapes = [type.substring(1)];
			if (colors[0] === '*') {
				colors = ['C', 'R', 'G', 'Y'];
			}
			if (shapes[0] === '*') {
				shapes = ['o', '|', '-'];
			}
			for (i = 0; i < colors.length; i += 1) {
				for (j = 0; j < shapes.length; j += 1) {
					candy = colors[i] + shapes[j];
					if ($.inArray(possible, candy) < 0) {
						possible.push(candy);
					}
				}
			}
		}
		return possible;
	}

	function levelCandyDescriptionToSet(candies) {
		var possible, arr, i;
		possible = {};
		arr = levelCandyDescriptionToArray(candies);
		for (i = 0; i < arr.length; i += 1) {
			possible[arr[i]] = true;
		}
		return possible;
	}

	function levelGenerateSequence(candyPool) {
		var sequence, sequenceLength, i, index;
		sequenceLength = 8;
		sequence = [];
		for (i = 0; i < sequenceLength; i += 1) {
			index = Math.floor(Math.random() * candyPool.length);
			sequence.push(candyPool[index]);
		}
		return sequence;
	}

	function levelEvaluateSequence(seqIndex, sequence, candyAcceptSet) {
		var evaluator, i, candy, circuitSays, levelSays, numWrong, combo,
			combos, numCombos, minCombo, c, colors, numColors,
			shapes, numShapes, candies, numCandies, varMetric;

		combos = [0, 0, 0, 0];
		// combos[0]: number of times circuit says reject, level says reject
		// combos[1]: number of times circuit says reject, level says accept
		// combos[2]: number of times circuit says accept, level says reject
		// combos[3]: number of times circuit says accept, level says accept
		candies = {}; // candies[x] will be true when x was found in sequence
		shapes = {}; // shapes[x] will be true when x was found in sequence
		colors = {}; // colors[x] will be true when x was found in sequence
		numWrong = 0; // number of candies where machine was wrong
		numCandies = 0; // count distinct candies - i.e. size(candies)
		numColors = 0; // count distinct colors in candies - i.e. size(colors)
		numShapes = 0; // count distinct shapes in candies - i.e. size(shapes)
		evaluator = Circuit.getEvaluator();
		for (i = 0; i < sequence.length; i += 1) {
			candy = sequence[i];
			circuitSays = evaluator.evaluate(candy).accept;
			levelSays = candyAcceptSet[candy] === true;

			if (circuitSays !== levelSays) {
				numWrong += 1;
			}
			combo = (circuitSays ? 2 : 0) + (levelSays ? 1 : 0);
			combos[combo] += 1;
			if (!candies.hasOwnProperty(candy)) {
				candies[candy] = true;
				numCandies += 1;
			}
			c = candy.substring(0, 1);
			if (!colors.hasOwnProperty(c)) {
				colors[c] = true;
				numColors += 1;
			}
			c = candy.substring(1, 2);
			if (!shapes.hasOwnProperty(c)) {
				shapes[c] = true;
				numShapes += 1;
			}
		}

		numCombos = 0;
		minCombo = sequence.length;
		for (i = 0; i < 4; i += 1) {
			combo = combos[i];
			if (combo > 0) {
				numCombos += 1;
				if (combo < minCombo) {
					minCombo = combo;
				}
			}
		}

		// We will be selecting results based on the following criteria,
		// choosing the result for which the first number (after numWrong)
		// is maximal.
		// * Our first preference is a sequence that displays as
		//   many combinations of circuitAccepts/levelAccepts as possible.
		// * Our second preference is a sequence that has several of
		//   each such combination.
		// * Our third preference is a sequence that has a variety
		//   of shapes, colors, and candies.
		// * Our fourth preference is just to select the first
		//   sequence generated - this is just a conclusive tie-breaker.
		varMetric = Math.min(numShapes, numCandies) * 64 +
			Math.max(numShapes, numCandies) * 16 + numCandies;
		return [numWrong, numCombos, minCombo, varMetric, seqIndex, sequence];
	}

	function levelSelectSequence(candyPool, candyAcceptSet) {
		var results, worstWrong, i, sequence, result, thresh, initResults;

		// Generate 100 random sequences, evaluating each of them
		// and tracking the worst performance of the machine.
		results = [];
		worstWrong = 0;
		for (i = 0; i < 100; i += 1) {
			sequence = levelGenerateSequence(candyPool);
			result = levelEvaluateSequence(i, sequence, candyAcceptSet);
			results.push(result);
			if (result[0] > worstWrong) {
				worstWrong = result[0];
			}
		}

		if (worstWrong > 0) {
			// Machine is wrong. Constrain attention to sequences where machine
			// did more than half as badly as its worst performance.
			thresh = 1 + Math.floor(worstWrong / 2);
			initResults = results;
			results = [];
			for (i = 0; i < initResults.length; i += 1) {
				result = initResults[i];
				if (result[0] >= thresh) {
					results.push(result);
				}
			}
		}

		results.sort(function (r0, r1) {
			var i, d;
			for (i = 1; i < 10; i += 1) {
				d = r0[i] - r1[i];
				if (d !== 0) {
					return d;
				}
			}
			return 0; // should never happen
		});

		// Choose the result from the last among this sorted list.
		result = results[results.length - 1];
		return result[result.length - 1];
	}

	return function (level) {
		var candyPool, candyAcceptSet, sequence, analysis, evaluator, i, candy;

		candyPool = levelCandyDescriptionToArray(level.types);
		candyAcceptSet = levelCandyDescriptionToSet(level.answers);
		sequence = levelSelectSequence(candyPool, candyAcceptSet);

		analysis = [];
		evaluator = Circuit.getEvaluator();
		for (i = 0; i < sequence.length; i += 1) {
			candy = sequence[i];
			analysis.push(new SequenceItem(candy,
				candyAcceptSet[candy] === true, evaluator.evaluate(candy)));
		}
		return analysis;
	};
}(jQuery, Circuit));
