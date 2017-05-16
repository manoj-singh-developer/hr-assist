(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraUsersFilters', hraUsersFilters);

  function hraUsersFilters() {
    let directive = {
      restrict: 'E',
      templateUrl: rootTemplatePath + 'employee/filters/usersFilters.view.html'
    };

    return directive;
  }

})();
