let Minesweeper = {
	init: function() {
		
		let mineCount = 40;
		let width = 16;
		let height = 16;

		let solution = []
		for (let i = 0; i < height; i++) {
			let row = []
			for (let j = 0; j < width; j++) {
				row.push(0)
			}
			solution.push(row)
		}

		while (mineCount > 0) {
			let xCoord = getRandomInt(0, width - 1);
			let yCoord = getRandomInt(0, height - 1);
			if (solution[yCoord][xCoord] === 0) {
				solution[yCoord][xCoord] = "*";
				mineCount--;

				for (let i = yCoord - 1; i <= yCoord + 1; i++) {
					for (let j = xCoord - 1; j <= xCoord + 1; j++) {
						if (solution[i] != undefined && solution[i][j] != undefined && solution[i][j] != "*") {
							solution[i][j]++;
						}
					}
				}
			}
		}
		this.solution = solution

		let board = []
		for (let i = 0; i < height; i++) {
			let row = []
			for (let j = 0; j < width; j++) {
				row.push('_')
			}
			board.push(row)
		}
		this.board = board
		board.forEach(row => console.log(row.join('')))
	},

	showBoard: function() {
		this.board.forEach(row => console.log(row.join('')))
	}
}

let getRandomInt = function(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min);
}

console.log(progress.argv)
