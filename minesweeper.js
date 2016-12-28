const readline = require('readline')
const chalk = require('chalk')
const log = console.log

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

let Minesweeper = {
	init: function() {
		
		this.moves = 0;
		this.revealed = 1;
		let mineCount = 40;
		let width = 16;
		this.width = width;
		let height = 16;
		this.height = height;
		this.totalCells = height * width;

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
				solution[yCoord][xCoord] = "*"
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
		
		this.solution = solution.map((row, idx) => {
			let rowNum = idx.toString()
			if (rowNum.length === 1) {
				rowNum = "0" + rowNum
			}
			row.push(rowNum)
			return row
		})

		let board = []
		for (let i = 0; i < height; i++) {
			let row = []
			for (let j = 0; j < width; j++) {
				row.push('_')
			}
			let rowNum = i.toString()
			if (rowNum.length === 1) {
				rowNum = "0" + rowNum
			}
			row.push(rowNum)
			board.push(row)
		}
		this.board = board

		let firstMove = false;

		while (!firstMove) {
			let xCoord = getRandomInt(0, width - 1);
			let yCoord = getRandomInt(0, height - 1);
			if (solution[yCoord][xCoord] != '*') {
				board[yCoord][xCoord] = color(solution[yCoord][xCoord])
				firstMove = true
			}
		}
		let firstRow = []
		for (let i = 0; i < width; i++) {
			let columnNum = i.toString()
			if (columnNum.length > 1) {
				columnNum = columnNum.slice(columnNum.length-1)
			}
			firstRow.push(columnNum)
		}
		firstRow.push('--')
		board.push(firstRow)
		this.solution.push(firstRow)

		board.forEach(row => console.log(row.join('')))
		log(chalk.yellow("Available commands are REVEAL, FLAG, SHOWBOARD, HELP, and SURRENDER."))

		this.prompt();
	},

	help: function() {
		log(chalk.cyan("REVEAL: Type 'reveal' followed by 'x' and 'y' coordinates to reveal the specified game cell."))
		log(chalk.cyan("If that cell is not a bomb, it will become a number indicating how many bombs are in proximity to that square."))
		log(chalk.cyan("If that cell is a bomb, you will blow up."))
		log(chalk.cyan("Format: 'reveal 13 5'"))
		log(chalk.yellow("FLAG: Type 'flag' followed by 'x' and 'y' coordinates to flag the specified game cell."))
		log(chalk.yellow("That cell will be visibly flagged to indicate that you think it's a bomb."))
		log(chalk.yellow("Format: 'flag 13 5'"))
		log(chalk.magenta("SHOWBOARD: This command shows you the current gameboard."))
		log(chalk.red("HELP: This command gives you information about the game."))
		log(chalk.green("SURRENDER: This command ends the game and shows you the gameboard."))
		this.prompt();
	},

	showboard: function() {
		this.board.forEach(row => console.log(row.join('')))
		this.prompt()
	},

	surrender: function() {
		let surrenderBoard = this.solution.map(row => {
			return row.map(cell => color(cell))
		})
		surrenderBoard.forEach(row => console.log(row.join('')))
		console.log(chalk.cyan("You lose!"))
		rl.question("Try again? [y/n] \n", answer => {
			if (answer === 'y') {
				this.init()
			} else {
				process.exit()
			}
		})
	},

	flag: function(x, y) {
		x = parseInt(x)
		y = parseInt(y)
		if ( x < 0 || x >= this.width || y < 0 || y >= this.height || x === NaN || y === NaN ) {
			console.log("I don't understand those coordinates.")
		} else if (this.board[y][x] === "_") {
			this.board[y][x] = chalk.bgBlue("F")
		} else if (this.board[y][x] = chalk.bgBlue("F")) {
			this.board[y][x] = "_"
		}
		this.showboard();
	},

	reveal: function(x, y) {
		x = parseInt(x)
		y = parseInt(y)
		if (x < 0 || x >= this.width || y < 0 || y >= this.height || typeof x != "number" || typeof y != "number") {
			console.log("I don't understand those coordinates.");
			this.showboard();
		} else if (this.board[y][x] != "_") {
			console.log("You've already revealed that cell.");
			this.showboard();
		} else if (this.solution[y][x] === "*") {
			log(chalk.bgRed("You hit a mine!"));
			this.surrender();
		} else {
			this.board[y][x] = color(this.solution[y][x]);
			this.moves++;
			this.revealed++;
			if (this.revealed === this.totalCells) {
				this.win()
			} else {
				this.showboard();
			} 
		}
	},

	win: function() {
		log(chalk.green("You win!"))
		log(chalk.green(`You won in ${this.moves} moves.`))
		rl.question("Play again? [y/n] \n", answer => {
			if (answer === 'y') {
				this.init()
			} else {
				process.exit()
			}
		})
	},

	prompt: function() {
		let game = this
		log(chalk.yellow(`Moves made: ${this.moves}`))
		rl.question("What's your move? \n", answer => {
			answer = answer.split(' ')
			try {
				this[answer[0].toLowerCase()](answer[1], answer[2])
			}
			catch (e){
				console.log(e)
				log(chalk.red("Sorry, I didn't understand that command."))
				this.prompt()
			}
		})
	}
}

let getRandomInt = function(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min);
}

let color = function(cellContents) {
	
	switch (cellContents) {
		case '*':
			return chalk.red.bold(cellContents)	
			break;

		case 1:
			return chalk.green(cellContents)	
			break;

		case 2:
			return chalk.yellow(cellContents)	
			break;

		case 3:
			return chalk.magenta(cellContents)	
			break;

		case (cellContents > 3):
			return chalk.red(cellContents)	
			break;

		default:
			return cellContents
			break;
	}
}

Minesweeper.init()
