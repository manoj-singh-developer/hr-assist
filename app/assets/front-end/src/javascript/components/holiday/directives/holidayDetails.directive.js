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
      templateUrl: rootTemplatePath + 'holiday/views/holidayDetails.view.html'
    };
  }


  // holidayDetailsController controller
  //  Todo: Move Controller from directive! Make an separate file for each controller.
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('holidayDetailsController', holidayDetailsController);


  function holidayDetailsController($rootScope, $scope, $stateParams, HolidayModel, $mdToast, User, $timeout, errorService) {

    var vm = this;
    vm.viewLists = null;
    vm.viewObject = null;
    var ids = $stateParams.id;
    var empArr = [];
    var holidayId, days, signingDay, startDate, endDate, holidayReplace;
    $scope.today = new Date();
    vm.leaders = [];
    vm.print = print;
    // public methods
    // ------------------------------------------------------------------------
    vm.getHolidays = getHolidays;
    vm.getUsers = getUsers;


    // public methods declaration
    // ------------------------------------------------------------------------
    function print() {
      window.print();
    }

    function getUsers() {
      $scope.holidayPaper = [];
      $scope.holidayRep;

      User.getAll()
        .then(function(data) {
          empArr = data;
          $timeout(function() {
            empArr.forEach(function(employee, index) {
              if (employee.id === holidayId) {

                var firstName = employee.first_name;
                var lastName = employee.last_name;
                var holidays = days;
                var signing = signingDay;
                var start = startDate;
                var end = endDate;

                var employeeObj = {
                  firstName: firstName,
                  lastName: lastName,
                  holidays: holidays,
                  signing: signing,
                  startDate: start,
                  endDate: end
                };

                var replaceObj = holidayReplace;

                $scope.holidayPaper.push(employeeObj);
                $scope.holidayRep = replaceObj;
              }
            });
          }, 1000);
        })
        .catch(function(error) {
          errorService.forceLogout(error);
          console.log(error);
        })
    }

    function getHolidays() {
      HolidayModel.getHolidayById(ids)
        .then(function(response) {

          startDate = response.start_date;
          endDate = response.end_date;
          days = response.days;
          signingDay = response.signing_day;
          holidayId = response.user_id;
          holidayReplace = response.employee_replacements;
          vm.leaders = $.map(response.employee_replacements, (value, index) => {
            if (value.team_leader) {
              return [value.team_leader];
            }
          });
        })
        .catch(function(error) {
          errorService.forceLogout(error);
          $rootScope.showToast('Error on loading data! Please refresh!');
        })
    }

    vm.getUsers();
    vm.getHolidays();

    return ($scope.se = vm);
  }

}());
