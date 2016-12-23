var quiz = angular.module('quiz', []);

quiz.service("mainService", function($http, $q) {
	var deferred = $q.defer(); // odraczać
	$http.get('list.json').success(function(data) {
		deferred.resolve(data);
	});
	this.getPlayers	= function() {
		return deferred.promise;
	}
});

quiz.controller('guessController', function($scope, mainService) {
    var promise = mainService.getPlayers();
    
    $scope.loadJson1 = function () {
	    promise.then(function(data) {
	    	$scope.words = data;
	    	console.log($scope.words);
	    });
	}
    
    $scope.loadJson2 = function () {
	    promise.then(function(data) {
	    	$scope.words = data;
	    	console.log($scope.words);
	    });
	}

    //values of variables on the start of application
    $scope.isInputDisabled = true;
    $scope.disableStartButton = false;
    $scope.restartButton = true;
    $scope.nextButton = true;
    $scope.isAlreadyDrawn = [];
    $scope.wordGuessed = true;
    $scope.numberOfWords = 0;
    $scope.numberOfCorrectAnswers = 0;
    $scope.rules = true;

    //activities for "START" and "NEXT" button
    $scope.startGame = function() {
    	$scope.rules = false;
    	$scope.whenGuessWord = false;
    	$scope.wrapper = true;
    	$scope.wordsCounter = true;
    	$scope.restartAlert = false;
        $scope.nextButton = false;
        $scope.restartButton = true;
        $scope.isInputDisabled = false;
        $scope.disableStartButton = true;
        $scope.empty = [];
        $scope.msgError = "";
        $scope.guess = "";
        $scope.guessNum = 0;
        $scope.wordGuessed = false;
        $scope.loseAlert = false;
        $scope.alertDanger = false;
        $scope.chosenWord = $scope.words[Math.floor(Math.random() * $scope.words.length)]
        $scope.isWordDrawn();
        $scope.numberOfWords = $scope.numberOfWords + 1;
    }

    //activities for reset button
    $scope.restartGame = function() {
    	$scope.finalAlertCorrect = false;
    	$scope.finalAlertWrong = false;
    	$scope.restartButton = true;
        $scope.disableStartButton = false;
        $scope.isInputDisabled = true;
        $scope.empty = [];
        $scope.msgError = "";
        $scope.guess = "";
        $scope.guessNum = 0;
        $scope.wordGuessed = true;
        $scope.alertDanger = false;
        $scope.chosenWord = "";
        $scope.nextButton = true;
        $scope.loseAlert = false;
        $scope.isAlreadyDrawn = [];
        $scope.restartAlert = true;
        $scope.numberOfWords = 0;
        $scope.whenGuessWord = false;
        $scope.numberOfCorrectAnswers = 0;
    }

    // function checks if word is already used, if true, don't draw it again
    $scope.isWordDrawn = function() {
	    $scope.isAlreadyDrawn.length == 9 && buttonVisibility();
    	($scope.isAlreadyDrawn.indexOf($scope.chosenWord.description) == -1) ? whenWordUsed() : whenWordIsNotUsed()
    }

    //activities for "CHECK" button
    $scope.checkWord = function() {
        $scope.guessNum++;
       	(($scope.guess).toUpperCase() === $scope.chosenWord.word) &&  whenWordGuessed();
        $scope.guessNum == 3 && whenWordNotGuessed();
        $scope.msgError = "";

        if (!$scope.guess) {
            $scope.msgError = 'You did not input any data';
            $scope.alertDanger = true;

            if ($scope.loseAlert == true) {
                $scope.alertDanger = false;
            }
            return;
        }

        ($scope.empty.indexOf($scope.guess) == -1) ? $scope.empty.push($scope.guess) : repeatedText()
    }
	
	//functions for isWordDrawn
    function buttonVisibility() {
    	 $scope.nextButton = true;
    }
    
    function whenWordUsed() {
		$scope.isAlreadyDrawn.push($scope.chosenWord.description);
		console.log($scope.isAlreadyDrawn);
    }
    
    function whenWordIsNotUsed() {
    	do {
		console.log($scope.chosenWord.description);
			for (i = 0; i <= $scope.isAlreadyDrawn.length; i++) {
			    $scope.chosenWord = $scope.words[Math.floor(Math.random() * $scope.words.length)];
			    if ($scope.isAlreadyDrawn[i] === $scope.chosenWord.description) {
			        console.log($scope.chosenWord.description);
			    }
			}
		} while ($scope.isAlreadyDrawn.indexOf($scope.chosenWord.description) != -1);
		$scope.isAlreadyDrawn.push($scope.chosenWord.description);
		console.log($scope.isAlreadyDrawn);
    }
	
	//functions for function checkWord
	function whenWordGuessed() {
		$scope.isInputDisabled = true;
		$scope.whenGuessWord = true;
		$scope.wordGuessed = true;
		$scope.numberOfCorrectAnswers = $scope.numberOfCorrectAnswers +1;
	
		if ($scope.numberOfWords == 10) {
			$scope.whenGuessWord = false;
			$scope.finalAlertCorrect = true;
			$scope.restartButton = false;
		}
   }

   function whenWordNotGuessed() {
		$scope.wordGuessed = true;
		$scope.isInputDisabled = true;
		$scope.loseAlert = true;

		if ($scope.numberOfWords == 10) {
			$scope.finalAlertWrong = true;
				if ($scope.finalAlertWrong == true) {
					$scope.loseAlert = false;
					$scope.alertDanger = false;
					$scope.restartButton = false;
				}
			return;
		}

		if ($scope.whenGuessWord == true) {
			$scope.loseAlert = false;
		}
    }
    
    function repeatedText() {
		$scope.msgError = 'Meh! You tried this answer already :(';
		$scope.alertDanger = true;
		($scope.loseAlert == true) ? $scope.alertDanger = false : $scope.alertDanger = true
  	}
})