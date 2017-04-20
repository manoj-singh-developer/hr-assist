(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeHolidayController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeHolidayController', employeeHolidayController);

  employeeHolidayController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'User', 'autocompleteService', 'miscellaneousService'];


  function employeeHolidayController($rootScope, $scope, $stateParams, User, autocompleteService, miscellaneousService) {


    var vm = this;
    vm.userHolidays;

    _getUserHolidays();

    function _getUserHolidays(){
      User.getHolidays($stateParams.id)
        .then((data) => {
          console.log(data);
          vm.userHolidays = data;
        })
        .catch((error) => {
          console.log(error)
        });
    }

  }

}());
