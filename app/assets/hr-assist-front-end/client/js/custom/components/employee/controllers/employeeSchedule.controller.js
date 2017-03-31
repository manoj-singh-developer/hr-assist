(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @emplyeeGeneralInfoCtrl
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('hraScheduleCtrl', hraScheduleCtrl);

  hraScheduleCtrl
    .$inject = ['$rootScope', '$scope'];





  function hraScheduleCtrl($rootScope, $scope) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.serverErrors = false;
    vm.disabledSchedule = true;
    vm.newJob = [];
    vm.selectedSchedualeMonday = [];
    vm.selectedSchedualeTuesday = [];
    vm.selectedSchedualeWednesday = [];
    vm.selectedSchedualeThursday = [];
    vm.selectedSchedualeFriday = [];
    vm.selection = true;
    vm.copyCatMonday = [];
    vm.copyCatTuesday = [];
    vm.copyCatWednesday = [];
    vm.copyCatThursday = [];
    vm.copyCatFriday = [];
    vm.scheduale = [{
      hours: "09:00 - 10:00"
    }, {
      hours: "10:00 - 11:00"
    }, {
      hours: "11:00 - 12:00"
    }, {
      hours: "12:00 - 12:30"
    }, {
      hours: "12:30 - 13:30 (lunch)"
    }, {
      hours: "13:30 - 14:00"
    }, {
      hours: "14:00 - 15:00"
    }, {
      hours: "15:00 - 16:00"
    }, {
      hours: "16:00 - 17:00"
    }, {
      hours: "17:00 - 18:00"
    }];





    // ----------------------------------------------------------------------
    //  EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    vm.saveEmployee         = saveEmployee;
    vm.clearFields          = clearFields;
    vm.cancelAdd            = cancelAdd;
    vm.generalInfoShowHide  = generalInfoShowHide;
    vm.toggleScheduale      = toggleScheduale;
    vm.existsScheduale      = existsScheduale;
    vm.toggleCard           = toggleCard;
    /* beautify preserve:end */





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
      updateSchaduale();
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    function saveEmployee(employee) {

      fill(employee);
      vm.disabledSchedule = true;
      vm.copyCatMonday = angular.copy(vm.selectedSchedualeMonday);
      vm.copyCatTuesday = angular.copy(vm.selectedSchedualeTuesday);
      vm.copyCatWednesday = angular.copy(vm.selectedSchedualeWednesday);
      vm.copyCatThursday = angular.copy(vm.selectedSchedualeThursday);
      vm.copyCatFriday = angular.copy(vm.selectedSchedualeFriday);
      disableHours();
      $rootScope.$emit("callSaveMethodCards", employee);

    }


    $(".monday").bind("mousedown", function(e) {
      e.metaKey = true;
    }).selectable();
    $(".tuesday").bind("mousedown", function(e) {
      e.metaKey = true;
    }).selectable();
    $(".wednesday").bind("mousedown", function(e) {
      e.metaKey = true;
    }).selectable();
    $(".thursday").bind("mousedown", function(e) {
      e.metaKey = true;
    }).selectable();
    $(".friday").bind("mousedown", function(e) {
      e.metaKey = true;
    }).selectable();
    disableHours();

    function clearFields() {

      vm.employee = {};

    }


    function disableHours() {

      $(".monday").selectable({
        disabled: true
      });
      $(".tuesday").selectable({
        disabled: true
      });
      $(".wednesday").selectable({
        disabled: true
      });
      $(".thursday").selectable({
        disabled: true
      });
      $(".friday").selectable({
        disabled: true
      });

    }


    function cancelAdd() {

      vm.disabledSchedule = true;
      disableHours();

      for (var j = 0; j < vm.selectedSchedualeMonday.length; j++) {
        $(".monday").find('li').each(function() {
          $(this).removeClass('ui-selected');
        });
      }

      for (var j = 0; j < vm.selectedSchedualeTuesday.length; j++) {
        $(".tuesday").find('li').each(function() {
          $(this).removeClass('ui-selected');
        });
      }

      for (var j = 0; j < vm.selectedSchedualeWednesday.length; j++) {
        $(".wednesday").find('li').each(function() {
          $(this).removeClass('ui-selected');
        });
      }

      for (var j = 0; j < vm.selectedSchedualeThursday.length; j++) {
        $(".thursday").find('li').each(function() {
          $(this).removeClass('ui-selected');
        });
      }

      for (var j = 0; j < vm.selectedSchedualeFriday.length; j++) {
        $(".friday").find('li').each(function() {
          $(this).removeClass('ui-selected');

        });
      }

      for (var j = 0; j < vm.copyCatMonday.length; j++) {
        $(".monday").find('li').each(function() {
          if ($(this).text() === vm.copyCatMonday[j].hours) {
            $(this).addClass('ui-selected');
          }
        });
      }
      for (var k = 0; k < vm.copyCatTuesday.length; k++) {
        $(".tuesday").find('li').each(function() {
          if ($(this).text() === vm.copyCatTuesday[k].hours) {
            $(this).addClass('ui-selected');
          }
        });
      }
      for (var l = 0; l < vm.copyCatWednesday.length; l++) {
        $(".wednesday").find('li').each(function() {
          if ($(this).text() === vm.copyCatWednesday[l].hours) {
            $(this).addClass('ui-selected');
          }
        });
      }
      for (var m = 0; m < vm.copyCatThursday.length; m++) {
        $(".thursday").find('li').each(function() {
          if ($(this).text() === vm.copyCatThursday[m].hours) {
            $(this).addClass('ui-selected');
          }
        });
      }
      for (var n = 0; n < vm.copyCatFriday.length; n++) {
        $(".friday").find('li').each(function() {
          if ($(this).text() === vm.copyCatFriday[n].hours) {
            $(this).addClass('ui-selected');
          }
        });
      }

    }


    function toggleScheduale(item, list) {

      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }

    }


    function existsScheduale(item, list) {

      return list.indexOf(item) > -1;

    }


    function updateSchaduale() {

      if (vm.employee.schedule !== "" && vm.employee.schedule !== undefined && vm.employee.schedule !== null && vm.employee.schedule.length!=0) {
        vm.selectedSchedualeMonday = vm.employee.schedule.monday;
        vm.selectedSchedualeTuesday = vm.employee.schedule.tuesday;
        vm.selectedSchedualeWednesday = vm.employee.schedule.wednesday;
        vm.selectedSchedualeThursday = vm.employee.schedule.thursday;
        vm.selectedSchedualeFriday = vm.employee.schedule.friday;

        vm.copyCatMonday = angular.copy(vm.selectedSchedualeMonday);
        vm.copyCatTuesday = angular.copy(vm.selectedSchedualeTuesday);
        vm.copyCatWednesday = angular.copy(vm.selectedSchedualeWednesday);
        vm.copyCatThursday = angular.copy(vm.selectedSchedualeThursday);
        vm.copyCatFriday = angular.copy(vm.selectedSchedualeFriday);
        debugger

        console.log("'vm.employee.schedule'"+" empty");

        // vm.selectedSchedualeMonday undefined


        for (var j = 0; j < vm.selectedSchedualeMonday.length; j++) {
          $(".monday").find('li').each(function() {
            if ($(this).text() === vm.selectedSchedualeMonday[j].hours) {
              $(this).addClass('ui-selected');
            }
          });
        }
        for (var k = 0; k < vm.selectedSchedualeTuesday.length; k++) {
          $(".tuesday").find('li').each(function() {
            if ($(this).text() === vm.selectedSchedualeTuesday[k].hours) {
              $(this).addClass('ui-selected');
            }
          });
        }
        for (var l = 0; l < vm.selectedSchedualeWednesday.length; l++) {
          $(".wednesday").find('li').each(function() {
            if ($(this).text() === vm.selectedSchedualeWednesday[l].hours) {
              $(this).addClass('ui-selected');
            }
          });
        }
        for (var m = 0; m < vm.selectedSchedualeThursday.length; m++) {
          $(".thursday").find('li').each(function() {
            if ($(this).text() === vm.selectedSchedualeThursday[m].hours) {
              $(this).addClass('ui-selected');
            }
          });
        }
        for (var n = 0; n < vm.selectedSchedualeFriday.length; n++) {
          $(".friday").find('li').each(function() {
            if ($(this).text() === vm.selectedSchedualeFriday[n].hours) {
              $(this).addClass('ui-selected');
            }
          });
        }
      }

    }


    function fill(employee) {

      vm.employee.schedule = {
        "monday": vm.selectedSchedualeMonday,
        "tuesday": vm.selectedSchedualeTuesday,
        "wednesday": vm.selectedSchedualeWednesday,
        "thursday": vm.selectedSchedualeThursday,
        "friday": vm.selectedSchedualeFriday
      };

      if (vm.employee.equipments.length === 0) {
        vm.employee.equipments.length = 0;
      } else {
        vm.employee.equipments = vm.employee.equipments;
      }

      employee = vm.employee;
      return employee;

    }


    function generalInfoShowHide(data) {

      if (data === 'schedule') {

        vm.disabledSchedule = false;

        $(".monday").selectable({
          disabled: false
        });
        $(".tuesday").selectable({
          disabled: false
        });
        $(".wednesday").selectable({
          disabled: false
        });
        $(".thursday").selectable({
          disabled: false
        });
        $(".friday").selectable({
          disabled: false
        });
      }

    }


  }

})();
