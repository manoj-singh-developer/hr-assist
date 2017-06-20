((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('holidayDetailsController', holidayDetailsController);


  function holidayDetailsController($rootScope, $stateParams, HolidayModel, $mdToast, User, $timeout, errorService, $window) {

    let vm = this;
    let ids = $stateParams.id;
    let empArr = [];
    let holidayId, days, signingDay, startDate, endDate, holidayReplace;

    vm.viewLists = null;
    vm.viewObject = null;
    vm.today = new Date();
    vm.leaders = [];
    vm.holidayPaper = [];
    vm.print = print;
    vm.getHolidays = getHolidays;
    vm.getUsers = getUsers;

    function print() {
      $window.print();
    }

    function getUsers() {

      vm.holidayRep;

      User.getAll()
        .then(function(data) {
          empArr = data;
          $timeout(function() {
            empArr.forEach(function(employee, index) {
              if (employee.id === holidayId) {

                let firstName = employee.first_name;
                let lastName = employee.last_name;
                let holidays = days;
                let signing = signingDay;
                let start = startDate;
                let end = endDate;

                let employeeObj = {
                  firstName: firstName,
                  lastName: lastName,
                  holidays: holidays,
                  signing: signing,
                  startDate: start,
                  endDate: end
                };

                let replaceObj = holidayReplace;

                vm.holidayPaper.push(employeeObj);
                vm.holidayRep = replaceObj;
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

  }

})();
