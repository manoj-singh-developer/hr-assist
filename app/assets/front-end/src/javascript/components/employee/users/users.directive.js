(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraEmployees
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployees', hraEmployees);

  function hraEmployees() {
    return {
      restrict: 'EA',
      replace: true,
      bindToController: {
        'candidate': '='
      },
      controller: 'usersCtrl',
      controllerAs: 'users',
      templateUrl: rootTemplatePath + 'employee/users/users.view.html'
    };
  }

}());
