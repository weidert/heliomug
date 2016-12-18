var SUITS = ["\u2660", "\u2665", "\u2666", "\u2663"];
var RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

var KEYS = ["Q", "]", "T", "E", "U", "O"];
var COLORS = ["#f88", "#f84", "#ff8", "#8f8", "#48f", "#f8f"];
var NAMES = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];

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

	this.setHoleCard = function(card) {
		this.holeCard = card;
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

	this.draw = function() {
		var context = $('#board')[0].getContext("2d");
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

function Deck(suits, values, ranks) {
	this.cards = [];
	
	for (var i = 0 ; i < suits.length ; i++) {
		for (var j = 0 ; j < ranks.length ; j++) {
			this.cards.push(new Card(values[j], ranks[j], suits[i]));
		}
	}

	this.shuffle = function() {
		var j, temp;
		for (var i = 0 ; i < this.cards.length ; i++) {
			j = Math.floor(Math.random() * (this.cards.length - i)) + i;
			temp = this.cards[i];
			this.cards[i] = this.cards[j];
			this.cards[j] = temp;
		}
	}

	this.deal = function() {
		return this.cards.pop();
	}
}

/*
function KeyMap() {
	var keys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
}
*/

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

function Game() {
	this.width = 640;
	this.height = 480;
	var r = 200;

	this.pot = 0;
	this.timeLastDrawn;

	this.isActive = false;

	this.io = new IO();
	
	var _this = this;

	this.players = [];
	this.deck = null;
	
	this.getBoard = function() {
		return $('#board')[0];
	}
	
	this.getContext = function() {
		return _this.getBoard().getContext("2d");
	}
	
	this.getPlayers = function() {
		return _this.players;
	}
	
	
	this.setupGame = function() {
		console.log("setup game");
		_this.resetDeck();
		var numPlayers = $('#playerCount').find(":selected").val();
		_this.setPlayers(numPlayers);
		_this.drawBoard();
		_this.io.clearMessages();
	}
	
	this.setupRound = function() {
		console.log("setup round");
		_this.isActive = false;
		_this.resetDeck();
		_this.dealHoleCards();
		_this.showSecretCards();
		_this.io.clearMessages();
	}
	
	this.startRound = function() {
		console.log("start round");
		_this.getBoard().contentEditable = true;
		_this.resetTimer();
		_this.isActive = true;
		_this.update();
		setInterval(_this.update, 1000);
	}
	
	this.addListeners = function() {
		$('#newGame').click(function() { _this.setupGame(); });
		$('#newRound').click(function() { _this.setupRound(); });
		$('#startRound').click(function() { _this.startRound(); });
		
		var board = $('#board')[0];
		
		board.width = this.width;
		board.height = this.height;


		board.addEventListener('mousedown', function(e) {
			if (_this.isActive) {
				var board = _this.getBoard();
				var x = e.pageX - board.offsetLeft;
				var y = e.pageY - board.offsetTop;
				var p = _this.getClickedPlayer(x, y);
				if (p != null) {
					_this.dealPlayer(p);
				}
			}
		});

		board.addEventListener('keydown', function(e) {
			if (_this.isActive) {
				var p = _this.getTypedPlayer(String.fromCharCode(e.keyCode));
				if (p != null) {
					_this.dealPlayer(p);
				}
			}
		}, false);
		
		board.contentEditable = true;
	}

	
	this.resetDeck = function() {
		_this.deck = new Deck(SUITS, VALUES, RANKS);
		_this.deck.shuffle();
	}
	
	this.setPlayers = function(numPlayers) {
		_this.players = [];
		for (var i = 0 ; i < numPlayers ; i++) {
			var angle = i * 2 * Math.PI / numPlayers;
			var x = (this.width / 2 - WIDTH / 2 - MARGIN) * Math.cos(angle) + this.width / 2;
			var y = (this.height / 2 - HEIGHT / 2 - MARGIN) * Math.sin(angle) + this.height / 2;
			_this.players.push(new Player(NAMES[i], KEYS[i], COLORS[i], x, y));
		}
	}
	
	this.dealHoleCards = function() {
		for (var i = 0 ; i < _this.players.length ; i++) {
			_this.players[i].setHoleCard(_this.deck.deal());
		}
	}
	
	this.dealPlayer = function(player) {
		if (player.isAlive()) {
			player.addCard(this.deck.deal());
			_this.drawBoard();
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
				return _this.players[i];
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
		console.log("game over");
		if (this.isActive) {
			this.isActive = false;
			var winner = this.getWinner();
			var name = winner.name;
			var score = winner.getTotalScore();
			var holeCard = winner.holeCard.toString();
			var message = "WINNER: " + name + " with " + score + " points and hole card " + holeCard;
			this.io.addMessage(message);
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
		for (var i = 0 ; i < this.players.length ; i++) {
			_this.players[i].draw();
		}
	}

	this.update = function() {
		console.log("update");
		if (_this.isActive) {
			if (_this.isGameOver()) {
				_this.endRound();
			} else {
				_this.drawBoard();
			}
		}
	}

	this.drawBoard = function() {
		_this.drawPlayers();
		var context = _this.getContext();
		context.fillStyle = "#fff";
		context.fillRect(_this.width / 2 - WIDTH / 2, _this.height / 2 - HEIGHT / 2, WIDTH, HEIGHT);
		context.fillStyle = "#000";
		var timeLeft = _this.getTimeLeft();
		var x =  _this.width / 2 - WIDTH / 2;
		var y = _this.height / 2 - HEIGHT / 2 + 16;
		context.fillText("Time Left: " + timeLeft, x, y);
	}
	
	this.showSecretCards = function() {
		for (var i = 0 ; i < _this.players.length ; i++) {
			var p = _this.players[i];
			this.io.addMessage(p.name + " player ONLY, hit \"Next Message\" to see your secret card.");
			var score = p.holeCard.getScore();
			var points;
			if (score == 1) {
				points = " (" + score + " point)";
			} else {
				points = " (" + score + " points)";
			}
			this.io.addMessage(p.name + ", your card is: " + p.holeCard.toString() + points);
		}
	}

	this.addListeners();
}

function IO() {
	var _this = this;
	
	this.messages = [];
	this.questions = [];
	this.fxns = [];
	this.currentFxn;

	$('#messageDiv').hide();
	
	$('#nextMessage').click(function() {
		$('#messageDiv').hide();
		_this.showMessage();
	});

	$('#ok').click(function() {
		console.log("approve!");
		$('#questionDiv').hide();
		var fxn = _this.currentFxn;
		console.log("fxn");
		console.log(fxn);
		fxn();
		_this.showQuestion();
	});
	
	$('#no').click(function() {
		console.log("decline!");
		$('#questionDiv').hide();
		_this.showQuestion();
	});
	
	this.showMessage = function() {
		if (_this.messages.length == 0) {
			$('#messageDiv').hide();
		} else {
			if (!$('#messageDiv').is(":visible")) {
				$('#messageDiv').show();
				var message = _this.messages.shift();
				$('#message').html(message);
			}
		}
	}

	this.showQuestion = function() {
		if (_this.questions.length == 0) {
			$('#questionDiv').hide();
		} else {
			if (!$('#questionDiv').is(":visible")) {
				$('#questionDiv').show();
				var question = _this.questions.shift();
				_this.currentFxn = _this.fxns.shift();
				$('#question').html(question);
			}
		}
	}

	this.clearMessages = function() {
		_this.messages = [];
	}
	
	this.addMessage = function(message) {
		_this.messages.push(message);
		_this.showMessage();
	}
	
	this.addQuestion = function(question, fxn) {
		_this.questions.push(question);
		_this.fxns.push(fxn);
		_this.showQuestion();
	}
}

function main() {
	var game = new Game();//numPlayers);
	//game.start();
}
