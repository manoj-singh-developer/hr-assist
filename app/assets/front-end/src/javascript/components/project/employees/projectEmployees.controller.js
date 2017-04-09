(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('projectEmployeesCtrl', projectEmployeesCtrl);

  projectEmployeesCtrl.$inject = ['$rootScope', '$scope', 'autocompleteService', 'miscellaneousService', 'Employee'];

  function projectEmployeesCtrl($rootScope, $scope, autocompleteService, miscellaneousService, Employee) {


  }

})();
