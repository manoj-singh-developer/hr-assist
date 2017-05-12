(function() {

  'use strict';

  // main controller
  // ------------------------------------------------------------------------

  function mainController($rootScope, $mdToast, $scope) {

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

    angular
        .module('HRA')
        .controller('mainController', mainController);

}());
