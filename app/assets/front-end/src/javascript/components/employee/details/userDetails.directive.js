(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraUserDetails', hraUserDetails);

  function hraUserDetails() {
    let directive = {
      restrict: 'E',
      scope: {},
      bindToController: {
        'candidate': '='
      },
      controller: 'userDetailsCtrl',
      controllerAs: 'userDetails',
      templateUrl: rootTemplatePath + '/employee/details/userDetails.view.html'
    };

    return directive;
  }

})();
