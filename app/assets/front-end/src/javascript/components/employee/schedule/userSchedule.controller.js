(() => {

  'use strict';

  // ------------------------------------------------------------------------
  // @emplyeeGeneralInfoCtrl
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('hraScheduleCtrl', hraScheduleCtrl);

  hraScheduleCtrl
    .$inject = ['$rootScope', '$scope' , 'User'];





  function hraScheduleCtrl($rootScope, $scope, User) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.serverErrors = false;
    vm.selectedSchedule = [];
    vm.scheduleArray = [];
    vm.numbersScheduleArray = [];
    vm.hours = 84;
    vm.showEditSchedule = false;
    let str;
    let arrayHr = [];
    let noHr;
    let strHours;



    vm.save                 = save;
    vm.cancelAdd            = cancelAdd;


    vm.numbersScheduleArray = Array(vm.hours).fill().map((e,i)=>i=i+1);

    $rootScope.$on('event:userResourcesLoaded', function(event, resource) {
      vm.user = resource.user;
      vm.schedule = resource.schedule;
      initSchedule();
    });

    $(".c-shedule--right").bind("mousedown", function(e) {
      e.metaKey = true;
    }).selectable();

    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function save() {
      let scheduleSave = "";
      let scheduleType = "";
      for(let i=0;i<vm.hours;i++){
        if(vm.selectedSchedule.includes((i+1)))
          scheduleSave += "1,";
        else
          scheduleSave += "0,";
      }

      str = scheduleSave;
      arrayHr = str.split(",").map(Number);
      function add(a, b) {
        return a +b;
      }
      noHr = arrayHr.reduce(add, 0);
      console.log(noHr);
      
      if(noHr <= 20) {
        scheduleType = 'Part-time 4h'
      } else if (noHr >= 30 && noHr <= 39) {
        scheduleType = 'Part-time 6h'
      } else if (noHr >= 40) {
        scheduleType = 'Full-time'
      }

      vm.schedule.timetable = scheduleSave;
      vm.schedule.name = scheduleType;
      User.updateSchedule(vm.user.id,  vm.schedule).then((data) => {
        if (data) {
          vm.schedule = data;
          $rootScope.$emit('notifyScheduleUpdate', data);
        }
      });

    }

    function cancelAdd() {
      initSchedule();
    }

    $(".c-shedule--right").selectable({
        disabled: true
      });

    function initSchedule() {
      if (vm.schedule.timetable !== "" && 
        vm.schedule.timetable !== undefined && 
        vm.schedule.timetable !== null && vm.schedule.timetable.length!=0) {
        
        str = vm.schedule.timetable;
        arrayHr = str.split(",").map(Number);
        
        function add(a, b) {
          return a +b;
        }
        noHr = arrayHr.reduce(add, 0);

        strHours = [arrayHr.join('')].toString();
        for(let i = 0; i<strHours.length;i++)
          vm.scheduleArray.push(strHours[i]);
        for(let i = 0;i<vm.scheduleArray.length;i++)
          if(vm.scheduleArray[i] === "1"){
            $(".c-shedule--right li").eq(i).addClass("ui-selected");
          }
      }
      else{
        vm.scheduleArray = Array(vm.hours).fill().map((e,i)=>i=0);
      }

    }

  vm.displayEditSchedule = () => {
    vm.showEditSchedule = !vm.showEditSchedule;
     $(".c-shedule--right").selectable({
        disabled: !vm.showEditSchedule
      });
  }

  }

})();