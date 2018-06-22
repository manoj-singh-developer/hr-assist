(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('hraScheduleCtrl', hraScheduleCtrl);

  function hraScheduleCtrl($rootScope, $scope, $state, User) {

    let vm = this;
    vm.selectedSchedule = [];
    vm.scheduleArray = [];
    vm.numbersScheduleArray = [];
    vm.hours = 91;
    vm.showEditSchedule = false;
    vm.studentMode = false;
    vm.hourType = [
      { id: '1', name: 'Any week' },
      { id: '2', name: 'Even' },
      { id: '3', name: 'Odd' },
      { id: '0', name: 'Free' }
    ];
    let str;
    let arrayHr = [];
    let noHr;
    let strHours;
    let newSchedule = '';

    //Index of items in scheduleArray that are represented by halves hours
    let halfHours = [4, 6, 17, 19, 30, 32, 43, 45, 56, 58];

    vm.save = save;
    vm.cancelAdd = cancelAdd;
    vm.displayEditSchedule = displayEditSchedule;
    vm.numbersScheduleArray = Array(vm.hours).fill().map((e, i) => i = i + 1);

    initSchedule();

    $rootScope.$on('event:userResourcesLoaded', function(event, resource) {
      vm.user = resource.user;
    });

    $('.c-shedule--right').bind('mousedown', function(e) {
      e.metaKey = true;
    }).selectable();

    function save() {
      let scheduleSave = '';
      let scheduleType = '';

      for (let i = 0; i < vm.hours; i++) {
        if (vm.studentMode) {
          switch (vm.scheduleArray[i]) {
            case '1':
              scheduleSave += '1,';
              break;
            case '2':
              scheduleSave += '2,';
              break;
            case '3':
              scheduleSave += '3,';
              break;
            default:
              scheduleSave += '0,';
              break;
          }
        } else {
          if (vm.selectedSchedule.includes((i + 1)))
            scheduleSave += '1,';
          else
            scheduleSave += '0,';
        }
      }

      str = scheduleSave;
      arrayHr = str.split(',').map(Number);
      noHr = arrayHr.reduce(_sum, 0);

      if (noHr <= 20 || noHr <= 29) {
        scheduleType = 'Part-time 4h'
      } else if (noHr >= 30 && noHr <= 39) {
        scheduleType = 'Part-time 6h'
      } else if (noHr >= 40) {
        scheduleType = 'Full-time'
      }

      newSchedule = scheduleSave.substr(0, scheduleSave.length - 1);
      vm.schedule.name = scheduleType;

      if (newSchedule != vm.schedule.timetable) {
        vm.schedule.timetable = newSchedule;
        User.updateSchedule(vm.user.id, vm.schedule).then((data) => {
          if (data) {
            vm.schedule = data;
            $rootScope.$emit('notifyScheduleUpdate', data);
          }
        });
      }
    }

    function cancelAdd() {
      $state.reload();
    }

    function initSchedule() {
      User.getSchedule()
        .then((data) => {
          vm.schedule = data;
          $rootScope.$emit('loadUserSchedule', data);
        })
        .then(() => {
          if (vm.schedule.timetable !== '' &&
            vm.schedule.timetable !== undefined &&
            vm.schedule.timetable !== null && vm.schedule.timetable.length != 0) {

            str = vm.schedule.timetable;
            arrayHr = str.split(',').map(Number);
            noHr = arrayHr.reduce(_sum, 0);
            strHours = [arrayHr.join('')].toString();

            for (let i = 0; i < strHours.length; i++) {
              vm.scheduleArray.push(strHours[i]);
            }

          } else {
            vm.scheduleArray = Array(vm.hours).fill().map((e, i) => i = 0);
          }
        });
    }

    function _sum(total, number, currentIndex) {
      if (number === 3 || number === 2 || halfHours.includes(currentIndex)) {
        number = 0.5;
      }
      return total + number;
    }

    function displayEditSchedule() {
      vm.showEditSchedule = !vm.showEditSchedule;
      $('.c-shedule--right').selectable('enable');
    }

  }

})();
