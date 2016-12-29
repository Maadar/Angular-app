var quiz = angular.module('quiz', []);

quiz.service("animalsService", function($http, $q) {
    var deferred = $q.defer(); // odraczać
    $http.get('animals.json').success(function(data) {
        deferred.resolve(data);
    });
    this.getData = function() {
        return deferred.promise;
    }
});

quiz.service("foodService", function($http, $q) {
    var deferred = $q.defer(); // odraczać
    $http.get('food.json').success(function(data) {
        deferred.resolve(data);
    });
    this.getData = function() {
        return deferred.promise;
    }
});

quiz.controller('guessController', function($scope, animalsService, foodService) {
    var promiseAnimals = animalsService.getData();
    var promiseFood = foodService.getData();
    
    //load json file by service after clcick the button
    $scope.loadJson1 = function loadJson1 () {
        promiseAnimals.then(function(data) {
            $scope.words = data;
            console.log($scope.words);
        });
    }
    //load json file by service after clcick the button
    $scope.loadJson2 = function () {
        promiseFood.then(function(data) {
            $scope.words = data;
            console.log($scope.words);
        });
    }

    //declare an object (set variables values)
    var config = {
        expandInput : true,
        isOptionDisabled : true,
        nextButton : true,
        restartButton : true,
        rules : true,
        wordsCountContainer : true,
        disableStartButton : false,
        wrapper : false,
        answersCounter : 0,
        guessNum : 0,
        numberOfWords : 0
    };
    $scope.config = config;

    var alerts = {
        infoAlert : false,
        whenGuessWord : false,
        loseAlert : false,
        alertDanger : false,
        finalAlertCorrect : false,
        finalAlertWrong : false
    };
    $scope.alerts = alerts;

    $scope.isAlreadyDrawn = [];

    //activities for "START" and "NEXT" button
    $scope.startGame = function() {
        config.isOptionDisabled = false;
        config.disableStartButton = true;
        config.restartButton = true;
        config.nextButton = false;
        config.expandInput = false;
        config.rules = false;
        config.numberOfWords = config.numberOfWords + 1;
        config.wrapper = true;
        config.wordsCountContainer = true;
        config.guessNum = 0;
        
        alerts.whenGuessWord = false;
        alerts.infoAlert = false;
        alerts.loseAlert = false;
        alerts.alertDanger = false;

        $scope.empty = [];
        $scope.msgError = "";
        $scope.guess = "";
        $scope.chosenWord = $scope.words[Math.floor(Math.random() * $scope.words.length)]
        $scope.isWordDrawn();
    }

    //activities for reset button
    $scope.restartGame = function() {
        config.restartButton = true;
        config.disableStartButton= false;
        config.isOptionDisabled;
        config.nextButton;
        config.expandInput = true;
        config.numberOfWords = 0;
        config.answersCounter = 0;
        config.guessNum = 0;
        
        alerts.infoAlert = true;
        alerts.whenGuessWord = false;
        alerts.loseAlert = false;
        alerts.alertDanger = false;
        alerts.finalAlertCorrect = false;
        alerts.finalAlertWrong = false;
        
        $scope.empty = [];
        $scope.msgError = "";
        $scope.guess = "";
        $scope.chosenWord = "";
        $scope.isAlreadyDrawn = [];
    }

    // function checks if word is already used, if true, don't draw it again
    $scope.isWordDrawn = function() {
        $scope.isAlreadyDrawn.length == 9 && buttonVisibility();
        
        ($scope.isAlreadyDrawn.indexOf($scope.chosenWord.description) == -1) 
        ? whenWordUsed() 
        : whenWordIsNotUsed()
    }

    //activities for "CHECK" button
    $scope.checkWord = function() {
        config.guessNum++;
        (($scope.guess).toUpperCase() === $scope.chosenWord.word) &&  whenWordGuessed();
        config.guessNum == 3 && whenWordNotGuessed();

        $scope.msgError = "";
        alerts.alertDanger = false;

        if (!$scope.guess) {
            $scope.msgError = 'You did not input any data';
            alerts.alertDanger = true;

            if ((alerts.loseAlert == true) || (alerts.finalAlertWrong == true)) {
                alerts.alertDanger = false;
            }
            return;
        }

        ($scope.empty.indexOf($scope.guess) == -1) ? $scope.empty.push($scope.guess) : repeatedTextAlert()

        $scope.guess = "";
    }
    
    //functions for isWordDrawn
    function buttonVisibility() {
        config.nextButton = true;
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
        config.isOptionDisabled = true;
        config.expandInput = true;
        config.answersCounter = config.answersCounter +1;
        alerts.whenGuessWord = true;
        alerts.alertDanger = false;
    
        if (config.numberOfWords == 10) {
            alerts.whenGuessWord = false;
            alerts.finalAlertCorrect = true;
            config.restartButton = false;
        }
   }

   function whenWordNotGuessed() {
        config.expandInput = true;
        config.isOptionDisabled = true;
        alerts.loseAlert = true;

        if (config.numberOfWords == 10) {
            alerts.finalAlertWrong = true;
            config.restartButton = false;
            if (alerts.finalAlertWrong == true) {
                alerts.loseAlert = false;
            }
            return;
        }

        if (alerts.whenGuessWord == true) {
            alerts.loseAlert = false;
        }
    }
    
    function repeatedTextAlert() {
        $scope.msgError = 'Meh! You tried this answer already :(';
        alerts.alertDanger = true;
        
        ((alerts.loseAlert == true) || (alerts.finalAlertWrong == true)) 
        ? alerts.alertDanger = false 
        : alerts.alertDanger = true
    }
})