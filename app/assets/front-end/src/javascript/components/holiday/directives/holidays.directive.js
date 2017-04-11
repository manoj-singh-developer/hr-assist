(function() {

  'use strict';

  // hraHolidays directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraHolidays', hraHolidays);

  function hraHolidays() {
    return {
      restrict: 'EA',
      replace: true,
      controller: 'HolidaysController as holidays',
      templateUrl: rootTemplatePath + '/holiday/views/holidays.view.html'
    };
  }



  // employeesList controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('HolidaysController', HolidaysController);

  HolidaysController
    .$inject = ['$rootScope', '$scope', '$mdDialog', 'autocompleteService', 'miscellaneousService', 'HolidayModel', 'Employee', '$timeout'];

  function HolidaysController($rootScope, $scope, $mdDialog, autocompleteService, miscellaneousService, HolidayModel, Employee, $timeout) {


    var vm = this;
    vm.ids = [];
    vm.holidayList = [];
    var date = new Date();
    var dateFrom = new Date();
    var dateTo = new Date();
    var filtru = [];
    vm.filterSwitch = true;
    vm.monthSelection = [];
    var final = [];
    vm.dateList = [];
    vm.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    vm.selectedMonth = [];
    var holCopy = [];
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
        order: 'firstName',
        filter: '',
        limit: 10,
        page: 1
      },
      "limitOptions": [10, 15, 20],
      selected: []
    };
    var empArray;

    getHoliday();
    getEmployees();

    // Public methods
    // ------------------------------------------------------------------------
    vm.querySearch = querySearch;
    vm.showFormDialog = showFormDialog;
    vm.showFormJsonDialog = showFormJsonDialog;
    vm.deleteConfirm = deleteConfirm;
    vm.multipleDelete = multipleDelete;
    vm.selectedMonthDate = selectedMonthDate;
    vm.searchFilter = searchFilter;
    vm.resetFilters = resetFilters;
    vm.searchPeriodFilter = searchPeriodFilter;

    // Public methods declaration
    // ------------------------------------------------------------------------
    function showFormDialog(event, holiday, index) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'holidayForm.tmpl.html',
        controller: 'holidayModal as holidayM',
        targetEvent: event,
        clickOutsideToClose: true,
        data: {
          holiday: angular.copy(holiday),
          holidayIndex: index
        }
      });
    }

    function showFormJsonDialog(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'holidayJsonForm.tmpl.html',
        controller: 'holidayJsonModal as holidayJsonM',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function deleteConfirm(event, holiday, hold) {
      event.stopPropagation();

      var confirm = $mdDialog.confirm()
        .title('Delete the holiday ?')
        .targetEvent(event)
        .cancel('No')
        .ok('Yes');

      $mdDialog.show(confirm).then(function() {
        removeHoliday(hold);
      });
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.empList);
    }

    function multipleDelete() {
      for (var i = 0; i < vm.table.selected.length; i++) {
        vm.ids.push(vm.table.selected[i].id);
        vm.holidays = _.without(vm.holidays, _.findWhere(vm.holidays, {
          id: vm.table.selected[i].id
        }));
      }
      removeHoliday(vm.ids);
      vm.table.selected = [];
    }

    function selectedMonthDate(data, index) {
      if (data !== undefined) {
        vm.monthSelection[index] = data;
        return vm.selectedMonth;
      } else {
        return "Pick a month";
      }
    }

    function getEmployees() {
      Employee.getAll().then(
        function(data) {
          empArray = vm.empList = data;
          return autocompleteService.buildList(vm.empList, ['firstName', 'lastName']);
        },
        function(data) {
          $rootScope.showToast('Holiday update failed!');
        });
    }

    function searchFilter(index) {
      final = vm.holidays.map(function(holiday) {
        return holiday.period.map(function(per) {
          dateFrom = new Date(per.from);
          dateTo = new Date(per.to);
          if (vm.monthSelection[index] === vm.monthsList[dateFrom.getMonth()] || vm.monthSelection[index] === vm.monthsList[dateTo.getMonth()])
            filtru.push(holiday);
          return filtru;
        });
      });
      vm.holidays = filtru;
    }

    function resetFilters() {
      vm.holidays = holCopy;
      filtru = [];
      vm.dateList = [];
      vm.selectedMonth = undefined;
    }

    function searchPeriodFilter(index) {
      final = vm.holidays.map(function(holiday) {
        return holiday.period.map(function(per) {
          dateFrom = new Date(per.from);
          dateTo = new Date(per.to);
          if ((dateFrom.getTime() >= vm.dateList.from.getTime() && dateTo.getTime() <= vm.dateList.to.getTime()))
            filtru.push(holiday);
          return filtru;
        });
      });
      vm.holidays = filtru;
    }



    // Private methods declaration
    // ------------------------------------------------------------------------


    function getHoliday() {

      HolidayModel.getAll().then(
        function(data) {
            $scope.holidaysTable = [];
            var holidaysArr = data;
            empArray;

            holidaysArr.forEach(function (h, index) {
                $timeout(function () {
                    empArray.forEach(function (u, index) {

                        if(u.id === h.user_id){
                            var employee =  u.first_name + ' ' + u.last_name;
                            var startDate = h.start_date;
                            var endDate = h.end_date;
                            var days = h.days;
                            var holidayId= h.holiday_id;

                            var holidayObj = {
                                employee: employee,
                                startDate: startDate,
                                endDate: endDate,
                                days: days,
                                holidayId: holidayId
                            };

                            $scope.holidaysTable.push(holidayObj);
                        }
                    });
                }, 100)
            });

            vm.holidays =  $scope.holidaysTable;

          // holCopy = angular.copy(vm.holidays);
          //return autocompleteService.buildList(vm.holidays, ['employee']);
        },
        function(data) {});
    }

    function removeHoliday(id) {

      HolidayModel.remove({
        id: id
      }).then(
        function(res) {
          vm.holidays = _.without(vm.holidays, _.findWhere(vm.holidays, {
            id: id
          }));
          $rootScope.showToast('Holiday deleted');
          vm.table.selected = [];
        },
        function(err) {
          $rootScope.showToast('Error on deleting the holiday!');
        });
    }

    $scope.$on('holidaysListChanged', function(event, args) {
      var holiday = args[1];
      var holidayIndex = '';
      switch (args[0]) {
        case 'save':
          vm.holidays.push(holiday);
          break;

        case 'saveFromJson':
          vm.holidays = vm.holidays.concat(holiday);
          break;


        case 'update':
          holidayIndex = miscellaneousService.getItemIndex(vm.holidays, holiday.id);
          vm.holidays[holidayIndex] = angular.copy(holiday);
          break;

        default:
          getHoliday();
      }
    });
  }

}());
