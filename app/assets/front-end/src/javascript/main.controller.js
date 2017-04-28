(function() {

  'use strict';

  // main controller
  // ------------------------------------------------------------------------

  function mainController($rootScope, $mdToast, $scope, $state, $timeout, $location, tokenService) {

    var self = this;
    $scope.nav = false;
    $rootScope.showToast = function(message) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(message)
        .position("top right")
        .hideDelay(1200)
      );
    };

    if(localStorage.getItem('auth_token')){
      var tokenToDecode = localStorage.getItem('user_token');
      var decodeToken = tokenService.decodeToken(tokenToDecode);
      var userId  = decodeToken.user_id;
      
      $location.path("employees/" + userId);
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams){

        if(toState.name === 'landing-page'){
            self.isLanding = true;
        } else if (toState.name !== 'landing-page'){
            self.isLanding = false;
        }
    });

    self.logOut = function () {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_token');

        self.isLanding = true;
    };
    $scope.secNavBar = function(){
      $scope.nav = false;
    }
    $scope.firstNavBar = function(){
      $scope.nav = true;
    }

    return $scope.mainCtrl = self;

  }

    mainController
        .$inject = ['$rootScope', '$mdToast', '$scope', '$state', '$timeout', '$location', 'tokenService'];

    angular
        .module('HRA')
        .controller('mainController', mainController);

}());
