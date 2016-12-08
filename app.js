(function() {

	var quiz = angular.module('quiz', []);
 		
 		quiz.controller('guessController', ['$scope', '$http', '$log', function($scope, $http, $log) {
			$http.get('list.json')
				.success(function(model, id) {
	
					$scope.words = model;
	
				})
				.error(function(model, status){
	
					$log.error('Unexpected error number:' +status+'');
	
				});

 				$scope.openInput=true;
 				$scope.disableStartButton=false;
 				$scope.nextButton=true;
 				$scope.isAlreadyDrawn = [];
 		
 			$scope.restartGame = function() {
 				$scope.disableStartButton=false;
 				$scope.openInput=false;
 				$scope.empty = [];
 				$scope.msgError = "";
 				$scope.guess = "";
 				$scope.guessNum = 0;
 				$scope.wordGuessed = false;
 				$scope.alertDanger = false;
 				$scope.chosenWord = "";
 				$scope.nextButton=true;
 				$scope.lose = false;
 				$scope.isAlreadyDrawn = [];
 			}

 			$scope.initGame = function(){
 				$scope.nextButton=false;
 				$scope.openInput=false;
 				$scope.disableStartButton=true;	
 				$scope.empty = [];
 				$scope.msgError = "";
 				$scope.guess = "";
 				$scope.guessNum = 0;
 				$scope.wordGuessed = false;
 				$scope.lose = false;
 				$scope.alertDanger = false;
				$scope.chosenWord = $scope.words[Math.floor(Math.random()*$scope.words.length)]
				$scope.isWordDrawn();

 			}

 			$scope.isWordDrawn = function(){		
				if ($scope.isAlreadyDrawn.length == 9) {
	         		$scope.nextButton=true;
	         	}
				if ($scope.isAlreadyDrawn.indexOf($scope.chosenWord.description) == -1) {
            		$scope.isAlreadyDrawn.push($scope.chosenWord.description);
            		console.log($scope.isAlreadyDrawn);
         		} 
         		else {
         			do {
         				console.log($scope.chosenWord.description);
	         			for (i=0; i <= $scope.isAlreadyDrawn.length; i++) {
	         				$scope.chosenWord = $scope.words[Math.floor(Math.random()*$scope.words.length)];
	         				if ($scope.isAlreadyDrawn[i] === $scope.chosenWord.description) {
	         					console.log($scope.chosenWord.description);
	         				}
	         			}
	         		} while ($scope.isAlreadyDrawn.indexOf($scope.chosenWord.description) != -1);
	         		$scope.isAlreadyDrawn.push($scope.chosenWord.description);
	         		console.log($scope.isAlreadyDrawn);
         		}
  			}

 			$scope.checkWord = function(){
 				$scope.guessNum++;
 			
 				if(($scope.guess).toUpperCase() === $scope.chosenWord.word) {
 					$scope.wordGuessed = true;
 				} 

 				if ($scope.guessNum == 3) {
 					$scope.lose = true;
 					if ($scope.wordGuessed == true) {
 						$scope.lose = false;
 					}
 				}

 				$scope.msgError = "";

 				if (!$scope.guess) {
 					$scope.msgError = 'You did not input any data';
 					$scope.alertDanger=true;
 					
 					if($scope.lose == true) {
 						$scope.alertDanger=false;
 					}
 					return;			
 				}

 				if ($scope.empty.indexOf($scope.guess) == -1) {
            		$scope.empty.push($scope.guess);
         		} else {
             		$scope.msgError = 'Meh! You tried this answer already :(';
             		$scope.alertDanger=true;

             		 if($scope.lose == true) {
 						$scope.alertDanger=false;
 					}
             	 		return;	
         		}

 				$scope.guess = "";
 				$scope.alertDanger=false;
 			}
 		}])
})();