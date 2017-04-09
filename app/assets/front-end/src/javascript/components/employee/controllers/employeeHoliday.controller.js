(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeHolidayController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeHolidayController', employeeHolidayController);

  employeeHolidayController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'ProjectModel', 'Employee', 'HolidayModel', 'autocompleteService', 'miscellaneousService'];





  function employeeHolidayController($rootScope, $scope, $stateParams, ProjectModel, Employee, HolidayModel, autocompleteService, miscellaneousService) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------


    var vm = this;
    var replacementProject = null;
    var replacementEmployee = null;

    var interval = {
      'from': null,
      'to': null
    };

    vm.showForm = false;

    vm.currentHolidayDefault = {
      'employeeId': null,
      'employee': null,
      'teamLeader': null,
      'signingDate': null,
      'days': null,
      'intervals': [],
      'replacementProjects': [],
      'replacementEmployees': []
    };

    vm.currentHoliday = vm.currentHolidayDefault;





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    /* beautify preserve:start */
    vm.toggleCard               = toggleCard;

    vm.querySearchEmployee      = querySearchEmployee;
    vm.querySearchProject       = querySearchProject;


    vm.saveHoliday              = saveHoliday;
    vm.editHoliday              = editHoliday;
    vm.removeHoliday            = removeHoliday;
    vm.addEmptyInterval         = addEmptyInterval;
    vm.addEmptyReplacement      = addEmptyReplacement;

    vm.addTeamLeader            = addTeamLeader;
    vm.addReplacementProject    = addReplacementProject;
    vm.addReplacementEmployee   = addReplacementEmployee;

    vm.openForm                 = openForm;
    vm.closeForm                = closeForm;
    /* beautify preserve:end */





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    $rootScope.$on('event:employeeResourcesLoaded', function(event, employeeResources, employee) {

      vm.employee = employee;
      vm.currentHoliday.employee = employee;
      vm.currentHoliday.employeeId = employee.id;

      if (employeeResources.projects || employeeResources.employees || employeeResources.holidays) {
        setAllProjects(employeeResources.projects);
        setAllEmployees(employeeResources.employees);
        setEployeeHolidays(employeeResources.holidays);
      }
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


    function saveHoliday() {

      console.log('vm.currentHoliday: ', vm.currentHoliday);

      if (!vm.currentHoliday.id) {
        HolidayModel.save(vm.currentHoliday).then(
          function(data) {

            HolidayModel.getHolidayById(data.id).then(
              function(data) {

                vm.employee.holidays.push(data);

              },
              function(error) {

                console.log('ERROR: get holiday by id error: ', error);

              });
          },
          function(error) {

            onSaveError(error);

          });
      } else {
        HolidayModel.update(vm.currentHoliday)
          .then(
            function(data) {

              var holidayIndex = miscellaneousService
                .getItemIndex(vm.employee.holidays, data.id);

              vm.employee.holidays[holidayIndex] = data;

              // TODO: sa fac asta mai bine
              setEployeeHolidays(vm.employee.holidays);
              vm.showForm = false;

            },
            function(error) {

              console.log('ERROR: holiday update error ', error);

            });
      }

    }


    function addEmptyInterval() {

      vm.currentHoliday.intervals.push(angular.copy(interval));

    }


    function addEmptyReplacement() {

      vm.currentHoliday.replacementProjects.push(angular.copy(replacementProject));
      vm.currentHoliday.replacementEmployees.push(angular.copy(replacementEmployee));

    }


    function openForm() {

      vm.currentHoliday = vm.currentHolidayDefault;

      //  To have the initial interval field
      addEmptyInterval();

      // To have the initial project and employee replacement field
      addEmptyReplacement();

      vm.showForm = true;

    }


    function closeForm() {

      vm.showForm = false;

    }


    // TODO: sa fac mai curat aici daca se poate
    function editHoliday(holiday) {

      var teamLeader = '';
      vm.currentHoliday = holiday;

      if (holiday.teamLeader[0].id) {
        teamLeader = holiday.teamLeader[0].firstName + ' ' + holiday.teamLeader[0].lastName;
      }

      vm.currentHoliday.intervals = vm.currentHoliday.intervals.map(function(item) {

        item.from = new Date(item.from);
        item.to = new Date(item.to);

        return angular.fromJson(item);

      });

      if (holiday.signingDate) {
        holiday.signingDate = new Date(holiday.signingDate);
      }

      if (teamLeader) {
        vm.currentHoliday.teamLeader = teamLeader;
      }

      vm.showForm = true;

    }


    function querySearchEmployee(query) {

      return autocompleteService.querySearch(query, vm.allEmployees);

    }


    function querySearchProject(query) {

      return autocompleteService.querySearch(query, vm.allProjects);

    }


    function removeHoliday(holiday) {

      var holidayToRemove = {
        'id': holiday.id
      };

      HolidayModel.remove(holidayToRemove).then(
        function() {
          var holidayIndex = miscellaneousService
            .getItemIndex(vm.employee.holidays, holiday.id);
          vm.employee.holidays.splice(holidayIndex, 1);
        },
        function(error) {
          console.log('Failed to delete holiday: ', error);
        });

    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function setAllProjects(projects) {

      vm.allProjects = projects;
      return autocompleteService.buildList(vm.allProjects, ['name']);

    }


    function setAllEmployees(employees) {

      vm.allEmployees = employees;
      return autocompleteService.buildList(vm.allEmployees, ['firstName', 'lastName']);

    }


    // TODO: treaba cu conversia datelor ar trebui sa o fac intr-un
    // singur loc si sa o refolosesc.
    // e prea mult cod in momentul de fata;
    function setEployeeHolidays(holidays) {

      var index = 0;
      var arrayLength = 0;

      vm.employee.holidays = holidays.filter(function(item) {
        if (item.employeeId === vm.employee.id) {
          return item;
        }
      });

      arrayLength = vm.employee.holidays.length;

      if (vm.employee.holidays.length > 0) {
        for (index; index < arrayLength; index++) {
          vm.employee.holidays[index].intervals = vm.employee.holidays[index].intervals.map(convertIntervalToDate);
        }
      }



    }


    // TODO: De folosit functia asta prin mai multe locuri,
    // din baza de date imi vine un json, sau string chiar.
    // Mie imi trebuie sa convertesc in obiect
    // De vazut daca as putea sa salvez obiect si sa primesc tot obiect
    // TODO: de investigat
    function convertIntervalToDate(intervalString) {

      var item = angular.fromJson(intervalString);
      item.from = new Date(item.from);
      item.to = new Date(item.to);

      return item;

    }


    function addTeamLeader(item) {

      vm.currentHoliday.teamLeader = item;

    }


    function addReplacementProject(item, index) {

      vm.currentHoliday.replacementProjects[index] = item;

    }


    function addReplacementEmployee(item, index) {

      vm.currentHoliday.replacementEmployees[index] = item;

    }


    function onSaveSuccess(action, holiday) {

      $rootScope.$broadcast('holidaysListChanged', [action, holiday]);

    }


    function onSaveError(message) {

      vm.serverErrorsArray = message;

    }

  }

}());
