((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('HolidaysController', HolidaysController);


  function HolidaysController($mdDialog, $rootScope, autocompleteService, Holiday, tableSettings, User) {


    let vm = this;
    let filteredHolidays = [];
    let dateFrom, dateTo;
    let final = [];
    let holidaysCopy = [];

    vm.users = [];
    vm.holidays = [];
    vm.ids = [];
    vm.holidayList = [];
    vm.monthSelection = [];
    vm.dateList = [];
    vm.selectedMonth = null;

    vm.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    vm.tableSettings = tableSettings;
    vm.tableSettings.query = {
      order: 'employee',
      limit: 10,
      page: 1
    };

    vm.querySearch = querySearch;
    vm.showFormDialog = showFormDialog;
    vm.selectedMonthDate = selectedMonthDate;
    vm.searchMonthFilter = searchMonthFilter;
    vm.resetFilters = resetFilters;
    vm.searchPeriodFilter = searchPeriodFilter;
    vm.checkDates = checkDates;

    _getHolidays();

    $rootScope.$on('event:holidayAdded', (event, data) => {
      _getHolidays();
    });

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        _updateTablePagination(autocompleteService.querySearch(query, vm.holidays));
      } else {
        _updateTablePagination(vm.holidays);
      }
      return autocompleteService.querySearch(query, list);
    }

    function showFormDialog(event) {
      event.stopPropagation();
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: rootTemplatePath + 'holiday/form/holidayForm.view.html',
        controller: 'holidayFormController as holidayForm',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function selectedMonthDate(data) {

      vm.indexMonth = vm.monthsList.indexOf(data);
      if (data) {
        vm.monthSelection[vm.indexMonth] = data;
        return vm.selectedMonth;
      } else {
        return "Pick a month";
      }
    }

    function searchMonthFilter() {

      vm.holidays.forEach((holiday) => {

        dateFrom = new Date(holiday.startDate);
        dateTo = new Date(holiday.endDate);

        if (vm.monthSelection[vm.indexMonth] === vm.monthsList[dateFrom.getMonth()] || vm.monthSelection[vm.indexMonth] === vm.monthsList[dateTo.getMonth()]) {
          filteredHolidays.push(holiday);
          return filteredHolidays;
        }
      });

      vm.holidays = filteredHolidays;
      filteredHolidays = [];
      vm.disabledMonth = true;
    }

    function resetFilters() {
      vm.holidays = holidaysCopy;
      filteredHolidays = [];
      vm.dateList = [];
      vm.selectedMonth = null;
      vm.searchText = "";
      vm.disabledMonth = false;
      vm.disabledPeriod = false;
      vm.validateDate = false;
      _updateTablePagination(vm.holidays);
    }

    function searchPeriodFilter() {

      vm.holidays.forEach((holiday) => {

        dateFrom = new Date(holiday.startDate);
        dateTo = new Date(holiday.endDate);

        if ((dateFrom.getTime() >= vm.dateList.from.getTime() && dateTo.getTime() <= vm.dateList.to.getTime())) {
          filteredHolidays.push(holiday);
          return filteredHolidays;
        }
      });

      vm.holidays = filteredHolidays;
      filteredHolidays = [];
      vm.disabledPeriod = true;
    }

    function checkDates() {
      if (vm.dateList.from && vm.dateList.to && vm.dateList.from >= vm.dateList.to) {
        vm.validateDate = true;
      } else {
        vm.validateDate = false;
      }
    }

    function _getHolidays() {
      vm.holidays = [];
      Holiday.getAll().then((holidays) => {

        User.getAll().then((users) => {
          let holidayObj = {};
          vm.users = users;

          if (holidays) {
            holidays.forEach((holiday) => {

              if (vm.users) {
                vm.users.forEach((user) => {

                  if (user.id === holiday.user_id) {

                    holidayObj = {
                      employee: user.first_name + ' ' + user.last_name,
                      signing_day: holiday.signing_day,
                      startDate: holiday.start_date,
                      endDate: holiday.end_date,
                      days: holiday.days,
                      holidayId: holiday.holiday_id
                    };

                    vm.holidays.push(holidayObj);

                  }
                });
              }

            });
          }

          holidaysCopy = vm.holidays;
          _updateTablePagination(vm.holidays);
          autocompleteService.buildList(vm.holidays, ['employee'])
          return autocompleteService.buildList(vm.users, ['last_name', 'first_name']);
        });

      });
    }

    function _updateTablePagination(data) {
      vm.tableSettings.total = data ? data.length : 0;
    }

  }

})(_);
