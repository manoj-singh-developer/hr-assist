((_) => {
  angular
    .module('HRA')
    .controller('holidayFormController', holidayFormController);

  function holidayFormController($mdDialog, $rootScope, autocompleteService, dateService, Holiday, Project, User) {

    let vm = this;
    let replacerIds = [];
    let replaceProjIds = [];
    vm.projects = [];
    vm.minLength = 0;
    vm.validateDate = false;
    vm.btnIsDisabled = false;
    vm.users = [];
    vm.user = {};
    vm.dateList = {};
    vm.teamLeaders = [];
    vm.holidayDateIncrement = [{}];
    vm.holidayReplaceIncrement = [{}];
    vm.dateService = dateService;

    vm.querySearch = querySearch;
    vm.saveHoliday = saveHoliday;
    vm.print = print;
    vm.addEmployeeReplacer = addEmployeeReplacer;
    vm.addRepProject = addRepProject;
    vm.addNewReplaceHoliday = addNewReplaceHoliday;
    vm.addUser = addUser;
    vm.clearFields = clearFields;
    vm.closeDialog = closeDialog;
    vm.addLeaders = addLeaders;
    vm.checkDates = checkDates;
    vm.getWorkingDay = getWorkingDay;

    _getEmployees();
    _getProjects();

    function querySearch(query, list) {
      return autocompleteService.querySearch(query, list);
    }

    function saveHoliday() {

      let leaders = $.map(vm.teamLeaders, (value, index) => {
        return value.id;
      });
      let holiday = {
        user_id: vm.user.id,
        days: _calculateHolidays(vm.dateList.from, vm.dateList.to),
        start_date: vm.dateService.format(vm.dateList.from),
        end_date: vm.dateService.format(vm.dateList.to),
        signing_day: vm.dateService.format(vm.dateList.signing_day),
        replacer_ids: replacerIds,
        project_ids: replaceProjIds,
        team_leader_ids: leaders
      };

      Holiday.save(holiday).then((data) => {
        $rootScope.$emit('event:holidayAdded', data);
        clearFields();
        closeDialog();
        vm.btnIsDisabled = true;
      });

    }

    function print() {
      let printContents = document.getElementById('printable').innerHTML;
      let popupWin = window.open('', '_blank');
      popupWin.document.open();
      popupWin.document.write('<html>' +
        '<head>' +
        '<link rel="stylesheet" href="./vendor.css">' +
        '<link rel="stylesheet" href="./app.css">' +
        '</head>' +
        '<body onload="window.print(); window.close();">' + printContents + '</body></html>');
      popupWin.document.close();
    }

    function addEmployeeReplacer(item, index) {
      if (item) {
        vm.users = _.without(vm.users, item);
        replacerIds[index] = item.id;
      }
    }

    function addRepProject(item, index) {
      if (item) {
        replaceProjIds[index] = item.id;
        vm.projects = _.without(vm.projects, item);
      }
    }

    function addNewReplaceHoliday() {
      vm.holidayReplaceIncrement.push({});
    }

    function addUser(item) {
      vm.user = item;
    }

    function clearFields() {
      vm.user = [];
      vm.dateList = [];
      vm.holidayDateIncrement = [{}];
      vm.holidayReplaceIncrement = [{}];
      replaceProjIds = [];
      replacerIds = [];
      vm.searchUserText = '';
      vm.searchEmp = [];
      vm.searchProjectHold = [];
      vm.teamLeaders = [];
      vm.validateDate = false;
    }

    function closeDialog() {
      $mdDialog.cancel();
    }

    function addLeaders() {
      vm.minLength = 1;
    }

    function checkDates() {
      if (vm.dateList.signing_day && vm.dateList.from && vm.dateList.to && vm.dateList.signing_day > vm.dateList.from || vm.dateList.from >= vm.dateList.to) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }

    function getWorkingDay(date) {
      var day = date.getDay();
      return !(day === 0 || day === 6);
    };

    function _calculateHolidays(dDate1, dDate2) {

      let iWeeks, iDateDiff, iAdjust = 0;

      if (dDate2 < dDate1) return -1;

      let iWeekday1 = dDate1.getDay();
      let iWeekday2 = dDate2.getDay();

      iWeekday1 = (iWeekday1 === 0) ? 7 : iWeekday1;
      iWeekday2 = (iWeekday2 === 0) ? 7 : iWeekday2;

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

      return (iDateDiff + 1);

    }

    function _getEmployees() {
      User.getAll().then((data) => {
        vm.users = data;
        return autocompleteService.buildList(vm.users, ['last_name', 'first_name']);
      });
    }

    function _getProjects() {
      Project.getAll().then((data) => {
        vm.projects = data;
        return autocompleteService.buildList(vm.projects, ['name']);
      });
    }

  }
})(_);
