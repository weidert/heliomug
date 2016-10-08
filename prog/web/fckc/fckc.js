var suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
var ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
var keys = ["Q", "O", "T", "C", "M", "P"];
var colors = ["#f88", "#f84", "#ff8", "#8f8", "#48f", "#f8f"];
var names = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];

var WIDTH = 200;
var HEIGHT = 100;
var MARGIN = 10;
var TIME_LIMIT = 10;

function Player(name, key, color, x, y) {
	this.wins = 0;
	this.holeCard;
	this.cash = 100;
	this.cards = [];
	this.name = name;
	this.key = key;
	this.color = color;
	this.left = x - WIDTH / 2,
	this.right = x + WIDTH / 2;
	this.top = y + HEIGHT / 2
	this.bottom = y - HEIGHT / 2;

	this.getWidth = function() { return this.right - this.left; }
	this.getHeight = function() { return this.top - this.bottom; }

	this.setHoleCard = function(c) {
		this.holeCard = c;
	}

	this.addCard = function(c) {
		this.cards.push(c);
	}

	this.isAlive = function() {
		for (var i = 0 ; i < this.cards.length ; i++) {
			if (this.cards[i].isFaceCard()) {
				return false;
			}
		}
		return true;
	}

	this.getPublicScore = function() {
		if (!this.isAlive()) return 0;
		var sum = 0;
		for (var i = 0 ; i < this.cards.length ; i++) {
			sum += this.cards[i].getScore();
		}
		return sum;
	}

	this.getTotalScore = function() {
		if (!this.isAlive()) return 0;
		return this.holeCard.getScore() + this.getPublicScore();
	}

	this.getCardString = function() {
		var str = "";
		for (var i = 0 ; i < this.cards.length ; i++) {
			str += this.cards[i].toString() + ", ";
		}
		return str;
	}

	this.contains = function(x, y) {
		return (x < this.right && x > this.left && y < this.top && y > this.bottom);
	}

	this.draw = function(context, x, y) {
		var lh = 16;
		context.font = "18px Monospace";
		if (this.isAlive()) {
			context.fillStyle = this.color;
		} else {
			context.fillStyle = "#888";
		}
		context.fillRect(this.left, this.bottom, this.getWidth(), this.getHeight());
		context.fillStyle = "#000";
		var score = this.getPublicScore();
		if (!this.isAlive()) score = "X";
		context.fillText(this.name + " - " + score + " points", this.left, this.bottom + 1 * lh);
		context.fillText(this.key, this.left, this.bottom + 2 * lh);
		context.fillText(this.getCardString(), this.left, this.bottom + 3 * lh);
	}

}

function Deck() {
	this.cards = [];
	for (var i = 0 ; i < suits.length ; i++) {
		for (var j = 0 ; j < ranks.length ; j++) {
			this.cards.push(new Card(values[j], ranks[j], suits[i]));
		}
	}

	this.shuffle = function() {
		var j, temp;
		for (var i = 0 ; i < this.cards.length ; i++) {
			j = Math.floor(Math.random() * this.cards.length);
			temp = this.cards[i];
			this.cards[i] = this.cards[j];
			this.cards[j] = temp;
		}
	}

	this.deal = function() {
		return this.cards.pop();
	}
}

function KeyMap() {
	var keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
}

function Card(value, rank, suit) {
	this.value = value;
	this.suit = suit;
	this.rank = rank;

	this.isFaceCard = function() {
		return (rank > 10);
	}

	this.getScore = function() {
		if (this.rank == 1) return 11;
		if (this.rank > 10) return 0;
		return this.rank;
	}

	this.toString = function() {
		return this.value + this.suit;
	}
}

function Game(numPlayers) {
	this.width = 640;
	this.height = 480;
	var r = 200;

	this.deck = new Deck();
	this.deck.shuffle();

	this.pot = 0;
	this.timeLastDrawn = Date.now();

	this.board = $('#board')[0];
	this.context = this.board.getContext("2d");
	this.board.width = this.width;
	this.board.height = this.height;

	this.roundActive = true;

	var _this = this;

	this.players = [];

	for (var i = 0 ; i < numPlayers ; i++) {
		var x = (this.width / 2 - WIDTH / 2 - MARGIN) * Math.cos(i * 2 * Math.PI / numPlayers) + this.width / 2;
		var y = (this.height / 2 - HEIGHT / 2 - MARGIN) * Math.sin(i * 2 * Math.PI / numPlayers) + this.height / 2;
		this.players.push(new Player(names[i], keys[i], colors[i], x, y));
		this.players[i].setHoleCard(_this.deck.deal());
	}

	this.board.addEventListener('mousedown', function(e) {
		var x = e.pageX - _this.board.offsetLeft;
		var y = e.pageY - _this.board.offsetTop;
		var p = _this.getClickedPlayer(x, y);
		if (p != null) {
			_this.dealPlayer(p);
		}
	});

	this.board.addEventListener('keydown', function(e) {
		var p = _this.getTypedPlayer(String.fromCharCode(e.keyCode));
		if (p != null) {
			_this.dealPlayer(p);
		}
	}, false);
	this.board.contentEditable = true;

	this.dealPlayer = function(player) {
		if (player.isAlive()) {
			player.addCard(this.deck.deal());
			this.updateScreen();
		}
		_this.resetTimer();
	}

	this.resetTimer = function() {
		_this.timeLastDrawn = Date.now();
	}

	this.getTimeLeft = function() {
		return Math.floor(TIME_LIMIT - (Date.now() - this.timeLastDrawn) / 1000);
	}

	this.getTypedPlayer = function(c) {
		for (var i = 0 ; i < this.players.length ; i++) {
			if (this.players[i].key == c) {
				return this.players[i];
			}
		}
		return null;
	}

	this.getClickedPlayer = function(x, y) {
		for (var i = 0 ; i < this.players.length ; i++) {
			if (this.players[i].contains(x, y)) {
				return this.players[i];
			}
		}
		return null;
	}

	this.endRound = function() {
		if (this.roundActive) {
			this.roundActive = false;
			var winner = this.getWinner();
			alert("WINNER: " + winner.name + " with " + winner.getTotalScore() + " points and hole card " + winner.holeCard.toString());
			if (confirm("Play again?")) {
				this.startRound();
			}
		}
	}

	this.getWinner = function() {
		var winner = null;
		var maxScore = 0;
		for (var i = 0 ; i < _this.players.length ; i++) {
			var p = _this.players[i];
			console.log(p.name);
			console.log(p.getTotalScore());
			if (p.getTotalScore() > maxScore) {
				maxScore = p.getTotalScore();
				winner = p;
			}
		}
		return winner;
	}

	this.isGameOver = function() {
		if (this.deck.length == 0) return true;
		if (this.getTimeLeft() < 0) return true;
		var numAlive = 0;
		for (var i = 0 ; i < this.players.length ; i++) {
			if (this.players[i].isAlive()) {
				numAlive++;
			}
		}
		return (numAlive <= 1);
	}

	this.drawPlayers = function() {
		var r = 200;
		for (var i = 0 ; i < this.players.length ; i++) {
			this.players[i].draw(this.context);
		}
	}

	this.startRound = function() {
		this.players = [];
		for (var i = 0 ; i < numPlayers ; i++) {
			var x = (this.width / 2 - WIDTH / 2 - MARGIN) * Math.cos(i * 2 * Math.PI / numPlayers) + this.width / 2;
			var y = (this.height / 2 - HEIGHT / 2 - MARGIN) * Math.sin(i * 2 * Math.PI / numPlayers) + this.height / 2;
			this.players.push(new Player(names[i], keys[i], colors[i], x, y));
			this.players[i].setHoleCard(_this.deck.deal());
		}
		this.activeRound = true;
		this.showSecretCards();
		this.updateScreen();
	}

	this.start = function() {
		_this.startRound();
		_this.update();
		_this.board.contentEditable = true;
		setInterval(_this.update, 1000);
	}

	this.update = function() {
		if (_this.isGameOver()) {
			_this.endRound();
		} else {
			_this.updateScreen();
		}
	}

	this.updateScreen = function() {
		this.drawPlayers();
		this.context.fillStyle = "#fff";
		this.context.fillRect(this.width / 2 - WIDTH / 2, this.height / 2 - HEIGHT / 2, WIDTH, HEIGHT);
		this.context.fillStyle = "#000";
		this.context.fillText("Time Left: " + this.getTimeLeft(), this.width / 2 - WIDTH / 2, this.height / 2 - HEIGHT / 2 + 16);
	}

	this.showSecretCards = function() {
		for (var i = 0 ; i < _this.players.length ; i++) {
			var p = _this.players[i];
			alert(p.name + " player ONLY, hit OK to see your secret card.");
			var points = p.holeCard.getScore();
			if (points == 1) {
				points = " (" + points + " point)";
			} else {
				points = " (" + points + " points)";
			}
			alert(p.name + ", your card is: " + p.holeCard.toString() + points);
		}
		_this.resetTimer();
	}
}

function main() {
	var game = new Game(4);
	game.start();
}
