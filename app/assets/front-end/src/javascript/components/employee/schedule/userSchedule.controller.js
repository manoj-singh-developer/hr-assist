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
    vm.disabledSchedule = true;
    vm.selectedSchedule = [];
    vm.scheduleArray = [];
    vm.numbersScheduleArray = [];
    vm.hours = 50;




    vm.save                 = save;
    vm.cancelAdd            = cancelAdd;
    vm.generalInfoShowHide  = generalInfoShowHide;


    vm.numbersScheduleArray = Array(vm.hours).fill().map((e,i)=>i=i+1);

    $rootScope.$on('event:userResourcesLoaded', function(event, resource) {
      vm.user = resource.user;
      vm.schedule = resource.schedule;
      initSchedule();
    });

    $(".c-shedule--right").bind("mousedown", function(e) {
      e.metaKey = true;
    }).selectable();

    disableHours();

    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function save() {
      let scheduleSave = "";
      for(let i=0;i<vm.hours;i++){
        if(vm.selectedSchedule.includes((i+1)))
          scheduleSave += "1";
        else
          scheduleSave += "0";
      }
      vm.schedule.timetable = scheduleSave;
      User.updateSchedule(vm.user.id,  vm.schedule).then((data) => {
        if (data) {
          vm.schedule = data;
        }
      });
      vm.disabledSchedule = true;
      disableHours();

    }

    function disableHours() {

      $(".c-shedule--right").selectable({
        disabled: true
      });
    }


    function cancelAdd() {
      
      vm.disabledSchedule = true;
      disableHours();
      initSchedule();
    }



    function initSchedule() {
      if (vm.schedule.timetable !== "" && 
        vm.schedule.timetable !== undefined && 
        vm.schedule.timetable !== null && vm.schedule.timetable.length!=0) {
        for(let i = 0; i<vm.schedule.timetable.length;i++)
          vm.scheduleArray.push(vm.schedule.timetable[i]);
        for(let i = 0;i<vm.scheduleArray.length;i++)
          if(vm.scheduleArray[i] === "1"){
            $(".c-shedule--right li").eq(i).addClass("ui-selected");
          }
      }
      else{
        vm.scheduleArray = Array(vm.hours).fill().map((e,i)=>i=0);
      }

    }

    function generalInfoShowHide(data) {

      if (data === 'schedule') {

        vm.disabledSchedule = false;

        $(".c-shedule--right").selectable({
          disabled: false
        });
      }
  }

  }

})();