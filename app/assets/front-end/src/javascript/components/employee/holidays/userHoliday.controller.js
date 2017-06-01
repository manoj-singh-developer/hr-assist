(() => {

  'use strict';


  angular
    .module('HRA')
    .controller('userHolidayCtrl', userHolidayCtrl);

  userHolidayCtrl

  function userHolidayCtrl($rootScope, $stateParams, User, autocompleteService, dateService, $timeout) {

    let vm = this;
    let days;
    vm.userHolidays;
    vm.projects = [];
    vm.users = [];
    vm.teamLeaders = [];
    vm.searchProj = [];
    vm.searchUser = [];

    vm.table = {
      options: {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
      },
      query: {
        limit: 5,
        page: 1
      },
      "limitOptions": [5, 10, 15],
      selected: []
    };

    vm.errMsg = false;
    vm.displayOrHide = false;
    vm.replaceInputs = [{}];
    vm.dateList = [];
    vm.validateDate = false;

    vm.dateService = dateService;

    vm.queryUserSearch = queryUserSearch;

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.projects = data.projects;
      vm.users = data.users;
      vm.userHolidays = data.holidays;
      autocompleteService.buildList(vm.projects, ['name']);
      autocompleteService.buildList(vm.users, ['first_name', 'last_name']);
    });

    function _getUserHolidays() {
      User.getHolidays($stateParams.id)
        .then((data) => {
          vm.userHolidays = data;
        })
        .catch((error) => {
          console.log(error)
        });
    }


    function queryUserSearch(query) {
      let empArr = autocompleteService.querySearch(query, vm.users);
      let empIdArr = [];
      let userID = parseInt($stateParams.id);
      let currentUser;

      for (let i = 0; i < empArr.length; i++) {

        empIdArr.push(empArr[i].id);

        currentUser = _.find(empIdArr, function(id) {
          if (id === userID) {
            return id;
          }
        });

        if (empArr[i].id === currentUser) {
          empArr.splice(i, 1);
        }

      }

      return empArr;
    }

    vm.saveHoliday = () => {

      _calculateHolidays(vm.from, vm.to);

      let usersObj = vm.searchUser;
      let projObj = vm.searchProj;
      let projectId = [];
      let replacerId = [];

      let userId = $stateParams.id;
      let daysNo = days;

      let startDate = vm.dateService.format(vm.from);
      let endDate = vm.dateService.format(vm.to);
      let signingDate = vm.dateService.format(vm.signingDate);

      let leaders = $.map(vm.teamLeaders, (value, index) => {
        return [value.id];
      });

      let usersArr = $.map(usersObj, (value, index) => {
        return [value];
      });

      let projArr = $.map(projObj, (value, index) => {
        return [value];
      });

      for (var x = 0; x < usersArr.length; x++) {
        let userName = usersArr[x];

        for (let i = 0; i < vm.users.length; i++) {
          let usersName = vm.users[i].first_name + ' ' + vm.users[i].last_name;

          if (userName === usersName) {
            replacerId.push(vm.users[i].id);
          }
        }
      }

      for (var y = 0; y < projArr.length; y++) {
        let projName = projArr[y];

        for (let j = 0; j < vm.projects.length; j++) {
          let projectsName = vm.projects[j].name;

          if (projName === projectsName) {
            projectId.push(vm.projects[j].id);
          }
        }
      }

      vm.objToSave = {
        days: daysNo,
        start_date: startDate,
        end_date: endDate,
        signing_day: signingDate,
        project_ids: projectId,
        replacer_ids: replacerId,
        user_id: userId,
        team_leader_ids: leaders
      };

      if (vm.userHolidays.length > 0) {
        let toSaveStartDate = vm.objToSave.start_date;
        let toSaveEndDate = vm.objToSave.end_date;
        let intervalExist = false;

        for (let i = 0; i < vm.userHolidays.length; i++) {
          let existingStartDate = vm.userHolidays[i].start_date;
          let existingEndDate = vm.userHolidays[i].end_date;

          if ((toSaveStartDate <= existingEndDate) && (existingStartDate <= toSaveEndDate)) {
            vm.errMsg = true;

            $timeout(() => {
              vm.errMsg = false;
            }, 5500);
            intervalExist = true;
            break;
          }
        }

        if (!intervalExist) {
          _addHoliday(vm.objToSave);
        }
      } else {
        _addHoliday(vm.objToSave);
      }
    }

    vm.clearFields = () => {
      vm.searchUser = '';
      vm.searchProj = '';
      vm.leader = '';
      vm.teamLeaders = [];
      vm.from = undefined;
      vm.to = undefined;
      vm.signingDate = undefined;
      vm.errMsg = false;
      vm.errMsgIntersectInterval = false;
    }

    function _addHoliday(objToSave) {
      User.addHolidays(objToSave)
        .then((response) => {
          _getUserHolidays();
          vm.displayOrHide = false;
        })
        .catch((error) => {
          console.log(error);
        });
      vm.clearFields();
    }

    function _calculateHolidays(dDate1, dDate2) {

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

    vm.checkDates = () => {
      if (vm.from != undefined && vm.signingDate != undefined && vm.to != undefined && vm.signingDate > vm.from || vm.from > vm.to) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }

    vm.addEmptyReplacement = () => {
      vm.replaceInputs.push({});
    }

    vm.removeEmptyReplacement = (index) => {
      vm.replaceInputs.splice(index, 1);
      vm.searchProj.splice(index, 1);
      vm.searchUser.splice(index, 1);
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

    vm.onlyWorkDay = function(date) {
      var day = date.getDay();
      return !(day === 0 || day === 6);
    };

    vm.addLeaders = () => {
      vm.leader = ' ';
    }
  }

})();
