(function() {

  'use strict';

  // main controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('mainController', mainController);

  mainController
    .$inject = ['$rootScope', '$mdToast', '$scope'];

  function mainController($rootScope, $mdToast, $scope) {

    $rootScope.showToast = function(message) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(message)
        .position("top right")
        .hideDelay(1200)
      );
    };
  }

}());
