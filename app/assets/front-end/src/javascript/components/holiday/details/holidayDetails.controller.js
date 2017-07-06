(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('holidayDetailsController', holidayDetailsController);

  function holidayDetailsController($stateParams, $window, HolidayModel, User) {

    let vm = this;
    vm.today = new Date();
    vm.holidayPaper = {};
    vm.print = print;

    _getHolidays();

    function print() {
      $window.print();
    }

    function _getHolidays() {
      HolidayModel.getHolidayById($stateParams.id)
        .then((holiday) => {
          let leaders = $.map(holiday.employee_replacements, (value, index) => {
            if (value.team_leader) {
              return [value.team_leader];
            }
          });

          User.getAll()
            .then((employeeData) => {
              employeeData.forEach((employee, index) => {
                if (employee.id === holiday.user_id) {
                  vm.holidayPaper = {
                    firstName: employee.first_name,
                    lastName: employee.last_name,
                    holidays: holiday.days,
                    signing: holiday.signing_day,
                    startDate: holiday.start_date,
                    endDate: holiday.end_date,
                    holidayRep: holiday.employee_replacements,
                    leaders: leaders
                  }
                }
              });
            });
        });
    }


  }

})();
