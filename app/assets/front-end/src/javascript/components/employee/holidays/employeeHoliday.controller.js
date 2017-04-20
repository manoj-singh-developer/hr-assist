((_) => {

  'use strict';


  angular
    .module('HRA')
    .controller('employeeHolidayController', employeeHolidayController);

  employeeHolidayController
    .$inject = ['$rootScope', '$stateParams', 'User', 'autocompleteService'];


  function employeeHolidayController($rootScope, $stateParams, User, autocompleteService) {


    let vm = this;
    let days;
    vm.userHolidays;
    vm.projects = [];
    vm.users = [];
    vm.holidaysTable = {
      order: 'days',
      limit: 5,
      page: 1
    };
    vm.displayOrHide = false;

    vm.queryProjectSearch = queryProjectSearch;
    vm.queryUserSearch = queryUserSearch;
    vm.saveHoliday = saveHoliday;

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.projects = data.projects;
      vm.users = data.users;
      _getUserHolidays();

      autocompleteService.buildList(vm.projects, ['name']);
      autocompleteService.buildList(vm.users, ['first_name', 'last_name']);
    });

    function _getUserHolidays(){
      User.getHolidays($stateParams.id)
        .then((data) => {
          vm.userHolidays = data;
        })
        .catch((error) => {
          console.log(error)
        });
    }

    function queryProjectSearch(query) {
      return autocompleteService.querySearch(query, vm.projects);
    }

    function queryUserSearch(query){
      return autocompleteService.querySearch(query, vm.users);
    }

    function saveHoliday () {
      let userName = vm.searchUser;
      let projName = vm.searchProj;

      console.log(vm.signingDate, 'signing date');
      console.log(vm.from, 'start date');
      console.log(vm.to, 'end date');

      calculateHolidays(vm.from, vm.to);
      console.log(days, 'days');

      for(let i = 0; i < vm.users.length; i++){
        let usersName = vm.users[i].first_name + ' ' + vm.users[i].last_name;

        if(userName === usersName){
          console.log(vm.users[i].id, 'userID');
        }
      }

      for(let j = 0; j < vm.projects.length; j++){
        let projectsName = vm.projects[j].name;

        if(projName === projectsName){
          console.log(vm.projects[j].id);
        }
      }
    }

    function calculateHolidays(dDate1, dDate2) {

      let iWeeks, iDateDiff, iAdjust = 0;

      if (dDate2 < dDate1) return -1;

      let iWeekday1 = dDate1.getDay();
      let iWeekday2 = dDate2.getDay();

      iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;
      iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;

      if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1;

      iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1;
      iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;


      iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000);

      if (iWeekday1 <= iWeekday2) {
        iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
      } else {
        iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
      }

      iDateDiff -= iAdjust;

      return days = (iDateDiff + 1);

    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

  }

})(_);
