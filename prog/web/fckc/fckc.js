var SUITS = ["\u2660", "\u2665", "\u2666", "\u2663"];
var RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
var VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

var KEYS = ["Q", "P", "T", "E", "U", "O"];
var COLORS = ["#f88", "#f84", "#ff8", "#8f8", "#48f", "#f8f"];
var NAMES = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];

var TIME_LIMIT = 20;

function Player(name) {
	this.wins = 0;
	this.holeCard;
	this.cash = 100;
	this.cards = [];
	this.name = name;

	this.setHoleCard = function(card) {
		this.holeCard = card;
	}

	this.resetHand = function() {
		this.cards = [];	
	}
	
	this.addCard = function(card) {
		this.cards.push(card);
	}

	this.isAlive = function() {
		for (var i = 0 ; i < this.cards.length ; i++) {
			if (this.cards[i].isFaceCard()) {
				return false;
			}
		}
		return true;
	}
	
	this.addWin = function() {
		this.wins++;	
	}

	this.getWins = function() {
		return this.wins;	
	}
	
	this.getName = function() { return this.name;}
	
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
	this.pot = 0;
	this.timeLastDrawn = 0;

	this.isActive = false;
	this.gameStage = -1;

	this.io = new IO();
	
	var _this = this;

	this.players = [];
	this.deck = null;
	
	this.setupGame = function() {
		console.log("setup game");
		_this.resetDeck();
		var numPlayers = $('#playerCount').find(":selected").val();
		_this.setPlayers(numPlayers);
		_this.io.clearMessages();
		_this.draw();
	}
	
	this.setupRound = function() {
		console.log("setting up round");
		_this.io.clearMessages();
		_this.isActive = false;
		_this.gameStage = -1;
		_this.timeLastDrawn = 0;
		_this.resetDeck();
		_this.resetPlayers();
		_this.dealHoleCards();
		_this.showSecretCards();
	}
	
	this.startRound = function() {
		console.log("starting round");
		//_this.getBoard().contentEditable = true;
		_this.resetTimer();
		_this.isActive = true;
		_this.gameStage = 0;
		_this.update();
		setInterval(_this.update, 1000);
	}
	
	this.addListeners = function() {
		$('#newPlayers').click(function() { 
			console.log("new players");
			_this.setupGame(); 
		});
		$('#startRound').click(function() { _this.setupRound(); });
		
		$("#board").keydown(function(e) {
			if (_this.isActive) {
				var p = _this.getTypedPlayer(String.fromCharCode(e.keyCode));
				if (p != null) {
					_this.dealPlayer(p);
				}
			}
		});
	}

	this.resetPlayers = function() {
		for (var i = 0 ; i < this.players.length ; i++) {
			var player = _this.players[i];
			player.resetHand();
		}
	}
	
	this.resetDeck = function() {
		_this.deck = new Deck(SUITS, VALUES, RANKS);
		_this.deck.shuffle();
	}
	
	this.setPlayers = function(numPlayers) {
		_this.players = [];
		for (var i = 0 ; i < numPlayers ; i++) {
			_this.players.push(new Player(NAMES[i]));
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
			_this.draw();
		}
		_this.resetTimer();
	}

	this.resetTimer = function() {
		_this.timeLastDrawn = Date.now();
	}

	
	this.getTimeLeft = function() {
		if (this.timeLastDrawn == 0) {
			return 0;
		} else {
			return Math.floor(TIME_LIMIT - (Date.now() - this.timeLastDrawn) / 1000);
		}
	}

	this.getTypedPlayer = function(c) {
		for (var i = 0 ; i < this.players.length ; i++) {
			console.log(c);
			console.log(KEYS[i]);
			if (KEYS[i] == c) {
				return _this.players[i];
			}
		}
		return null;
	}

	this.endRound = function() {
		if (this.isActive) {
			this.isActive = false;
			this.gameStage = 1;
			var winner = this.getWinner();
			var name = winner.name;
			var score = winner.getTotalScore();
			var holeCard = winner.holeCard.toString();
			var message = "WINNER: " + name + " with " + score + " points and hole card " + holeCard;
			winner.addWin();
			this.io.addMessage(message);
			this.io.showNextMessage();
			this.draw();
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

	this.update = function() {
		if (_this.isActive) {
			if (_this.isGameOver()) {
				_this.endRound();
			} else {
				_this.draw();
			}
			$("#board").focus();
		}
	}

	this.getInfoDiv = function() {
		var $div = $("<div>", {"class": "game floater ephemeral"});
		$div.addClass("floater");
		if (_this.gameStage == 0) {
			var timeLeft = _this.getTimeLeft();
			$div.append("<p>Time Left: " + timeLeft + "</p>");
		} else if (_this.gameStage == -1) {
			$div.append("<p>Round not started</p>");
		} else {
			$div.append("<p>Round finished</p>");
		}
		return $div;
	}
	
	this.getPlayerDiv = function(player, color, key, x, y) {
		var score = player.getPublicScore();
		
		var $div = $("<div>", {"class": "floater ephemeral"});
		$div.addClass("floater");
		if (player.isAlive()) {
			$div.css("background-color", color);
		} else {
			$div.css("background-color", "#888");
			score = "X";
		}
		var winString;
		if (player.getWins() == 0) {
			winString = "";
		} else if (player.getWins() == 1) {
			winString = " (1 win)";
		} else {
			winString = " (" + player.getWins() + " wins)";
		}
		$div.append("<h3>" + player.getName() + winString + "</h3>");	
		var $table = $("<table>");
		$table.append("<tr><td>Score:</td><td class='leftt'>" + score + "</td></tr>")
		$table.append("<tr><td>Draw:</td><td class='leftt'>&quot" + key + "&quot</td></tr>")
		$table.append("<tr><td>Cards:</td><td class='leftt'>" + player.getCardString() + "</td></tr>")
		$div.append($table);
		
		$div.click(function() {
			if (_this.isActive) {
				_this.dealPlayer(player);
				_this.update();
			}
		});
		return $div;
	}
	
	this.placePlayerDiv = function($playerDiv, i) {

		var boardWidth = $("#board").width();
		var boardHeight = $("#board").height();

		var ySize = .25;
		var xSize = .25;
		
		$playerDiv.css("width", boardWidth * xSize);
		$playerDiv.css("height", boardHeight * ySize);
		$('#board').append($playerDiv);

		
		var angle = i * 2 * Math.PI / this.players.length;
		var r = .33;
		
		var x = boardWidth / 2 + boardWidth * r * Math.cos(angle);
		var y = boardHeight / 2 + boardHeight * r * Math.sin(angle);
		
		$playerDiv.css("left", x - boardWidth * xSize * .5);
		$playerDiv.css("top", y - boardHeight * ySize * .5);
	}
	
	this.draw = function() {
		console.log("drawing board");
		$(".ephemeral").remove();
		$("#board").append(_this.getInfoDiv());
		for (var i = 0 ; i < this.players.length ; i++) {
			var player = _this.players[i];
			var color = COLORS[i];
			var key = KEYS[i];
			$div = _this.getPlayerDiv(player, color, key);
			_this.placePlayerDiv($div, i);
		}
	}
	
	this.showSecretCards = function() {
		for (var i = 0 ; i < _this.players.length ; i++) {
			var p = _this.players[i];
			this.io.addMessage(p.name + " ONLY, hit \"Ok!\" to see your secret card.");
			var score = p.holeCard.getScore();
			var points;
			if (score == 1) {
				points = " (" + score + " point)";
			} else {
				points = " (" + score + " points)";
			}
			this.io.addMessage(p.name + ", your card is: " + p.holeCard.toString() + points);
		}
		this.io.addMessageWithCallback("Start Round!", this.startRound);
		this.io.showNextMessage();
	}

	this.addListeners();
}

function IO() {
	var _this = this;
	
	this.messages = [];
	this.questions = [];
	this.callbacks = [];

	this.hideMessage = function() {
		$("#message").html("&nbsp");
		$("#message").html("&nbsp");
		$("#okButton").attr("disabled", "disabled");
	}

	this.hideMessage();

	$('#okButton').click(function() {
		var fxn = _this.callbacks.shift();
		if (fxn != undefined) {
			fxn();
		}
		if (_this.messages.length == 0) {
			_this.hideMessage();
		} else {
			_this.showNextMessage();
		}
	});

	this.showNextMessage = function() {
		if (_this.messages.length > 0) {
			var message = _this.messages.shift();
			$('#messageDiv').show();
			$('#okButton').prop('disabled', false);
			$('#message').html(message);
		}
	}

	this.clearMessages = function() {
		_this.messages = [];
		_this.callbacks = [];
		_this.hideMessage();
	}

	this.addMessage = function(message) {
		_this.messages.push(message);
		_this.callbacks.push(function() {});
	}
	
	this.addMessageWithCallback = function(message, callback) {
		_this.messages.push(message);
		_this.callbacks.push(callback);
	}
}

function main() {
	var game = new Game();//numPlayers);
	//game.start();
}
