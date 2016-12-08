(function() {

    var quiz = angular.module('quiz', []);

    quiz.controller('guessController', ['$scope', '$http', '$log', function($scope, $http, $log) {
        $http.get('list.json')
            //check if json is loaded correct
            .success(function(model, id) {
                $scope.words = model;
            })
            //send msg about error
            .error(function(model, status) {
                $log.error('Unexpected error number:' + status + '');
            });

        //values of variables on the start of application
        $scope.isInputDisabled = true;
        $scope.disableStartButton = false;
        $scope.restartButton = true;
        $scope.nextButton = true;
        $scope.isAlreadyDrawn = [];
        $scope.wordGuessed = true;
        $scope.numberOfWords = 0;

        //activities for "START" and "NEXT" button
        $scope.startGame = function() {
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
        	$scope.whenEveryWordsUsedAlert = false;
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
        }

        // function checking if word is already used, if it is, don't draw it again
        // draw == wylosować
        $scope.isWordDrawn = function() {
            if ($scope.isAlreadyDrawn.length == 9) {
            	$scope.whenEveryWordsUsedAlert = true;
                $scope.nextButton = true;
                $scope.isInputDisabled = true;
                $scope.wordGuessed = true;
                $scope.restartButton = false;
            }
            if ($scope.isAlreadyDrawn.indexOf($scope.chosenWord.description) == -1) {
                $scope.isAlreadyDrawn.push($scope.chosenWord.description);
                console.log($scope.isAlreadyDrawn);
            } else {
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
        }

        //activities for "CHECK" button
        $scope.checkWord = function() {
            $scope.guessNum++;

           	if (($scope.guess).toUpperCase() === $scope.chosenWord.word) {
            	$scope.isInputDisabled = true;
           	    $scope.whenGuessWord = true;
            }

            if ($scope.guessNum == 3) {
            	$scope.wordGuessed = true;
            	$scope.isInputDisabled = true;
                $scope.loseAlert = true;

                if ($scope.whenGuessWord == true) {
                    $scope.loseAlert = false;
                }
            }

            $scope.msgError = "";

            if (!$scope.guess) {
                $scope.msgError = 'You did not input any data';
                $scope.alertDanger = true;

                if ($scope.loseAlert == true) {
                    $scope.alertDanger = false;
                }
                return;
            }

            if ($scope.empty.indexOf($scope.guess) == -1) {
                $scope.empty.push($scope.guess);
            } else {
                $scope.msgError = 'Meh! You tried this answer already :(';
                $scope.alertDanger = true;

                if ($scope.loseAlert == true) {
                    $scope.alertDanger = false;
                }
                return;
            }

            $scope.guess = "";
            $scope.alertDanger = false;
        }
    }])
})();