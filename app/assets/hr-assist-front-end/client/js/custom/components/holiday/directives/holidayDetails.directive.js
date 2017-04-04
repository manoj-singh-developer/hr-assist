(function() {

  'use strict';



  // hraHolidayDetails directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraHolidayDetails', hraHolidayDetails);

  function hraHolidayDetails() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'holidayDetailsController',
      controllerAs: 'holidayDetails',
      templateUrl: rootTemplatePath + 'components/holiday/views/holidayDetails.view.html'
    };
  }



  // holidayDetailsController controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('holidayDetailsController', holidayDetailsController);

  holidayDetailsController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'HolidayModel', '$mdToast', 'Employee', '$timeout'];

  function holidayDetailsController($rootScope, $scope, $stateParams, HolidayModel, $mdToast, Employee, $timeout) {

    var vm = this;
    vm.viewLists = null;
    vm.viewObject = null;
    var ids = $stateParams.id;
    var empArr = [];
    var holidayId, days;

    // public methods
    // ------------------------------------------------------------------------
    vm.getHolidays = getHolidays;
    vm.getUsers  = getUsers;


    // public methods declaration
    // ------------------------------------------------------------------------

    function getUsers() {
        $scope.holidayPaper = [];
        Employee.getAll()
           .then(function(data) {
               empArr = data;
               $timeout(function () {
                   empArr.forEach(function (employee, index) {
                       if(employee.id === holidayId) {

                           var firstName = employee.first_name;
                           var lastName = employee.last_name;
                           var holidays = days;

                           var employeeObj = {
                               firstName: firstName,
                               lastName: lastName,
                               holidays: days
                           };

                           $scope.holidayPaper.push(employeeObj);
                       }
                   });
               }, 1000);
           })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getHolidays() {
      HolidayModel.getHolidayById(ids)
          .then(function(response) {
              days = response.days;
              holidayId = response.user_id;
          })
          .catch(function (error){
              $rootScope.showToast('Error on loading data! Please refresh!');
          })
    }

    vm.getUsers();
    vm.getHolidays();

    return ($scope.se = vm);
  }

}());
