(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeDetailsController
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('employeeDetailsController', employeeDetailsController);

  employeeDetailsController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'Employee', 'skillModel', 'ProjectModel', 'HolidayModel'];





  function employeeDetailsController($rootScope, $scope, $stateParams, Employee, skillModel, ProjectModel, HolidayModel) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    var employeeId = $stateParams.id;
    vm.employeeResources = {};
    vm.formTitle = 'Employee Profile';
    //vm.saveEmployee = saveEmployee;





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------



    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    getEmployeeResources();
    $rootScope.$on('event:toggleCard', scrollToCard);





    // ----------------------------------------------------------------------
    // PUBLIC METHODS
    // ----------------------------------------------------------------------





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function scrollToCard(event, card, action) {

      if (action === 'open') {
        card.addClass('is-opened');
      }

      if (action === 'close') {
        card.removeClass('is-opened');

        angular.element('html, body').animate({
          scrollTop: card.offset().top - 100
        }, 500);
      }

    }


    // ----------------------------------------------------------------------
    //  START LOADING EMPLOYEE RESOURCES

    function getEmployeeResources() {

      Employee.getById(employeeId, vm.candidate)
        .then(getEmployeeById)
        // .then(getAllSkills)
        // .then(getAllProjects)
        // .then(getAllEmployees)
        // .then(getAllHolidays)
        .catch(handleErrorChain);

    }


    function getEmployeeById(employee) {

      console.log('CONTROLLER: Load employee by id');

      vm.employee = employee;
      vm.progress = getProfileProgress(vm.employee);

      // return skillModel.getAll();

      resourcesAreLoaded();

    }


    function getAllSkills(skills) {

      console.log('CONTROLLER: Load all skills');
      vm.employeeResources.skills = skills;

      return ProjectModel.getAll();

    }


    function getAllProjects(projects) {

      console.log('CONTROLLER: Load all projects');
      vm.employeeResources.projects = projects;

      return Employee.getAll();

    }


    function getAllEmployees(employees) {

      console.log('CONTROLLER: Load all employees');
      vm.employeeResources.employees = employees;

      return HolidayModel.getAll();

    }


    function getAllHolidays(holidays) {

      console.log('CONTROLLER: Load all holidays');
      vm.employeeResources.holidays = holidays;

      resourcesAreLoaded();

    }

    function resourcesAreLoaded() {
      // Sa scap de primele doua si sa ramana doar ultima
      $rootScope.$emit("employeeIsLoadedEvent", vm.employee, vm.candidate, vm.progress);

      $rootScope.$emit("event:employeeIsLoaded", vm.employee, vm.candidate, vm.progress);

      $rootScope.$emit("event:employeeResourcesLoaded", vm.employeeResources, vm.employee, vm.candidate, vm.progress);
    }


    function getProfileProgress(data) {

      console.log('CONTROLLER: Get profile progress');
      var allPropertiesLength = Object.keys(data).length;
      var completedPropertiesLength = '';
      var completedProperties = [];
      var profileProgress = 0;

      angular.forEach(data, function(value) {
        if (value) {
          completedProperties.push(value);
        }
      });

      completedPropertiesLength = completedProperties.length;
      profileProgress = completedPropertiesLength / allPropertiesLength * 100;
      return Math.round(profileProgress);

    }


    function handleErrorChain(error) {

      console.log('Error: ', error);

    }

    //  END LOADING EMPLOYEE RESOURCES
    // ----------------------------------------------------------------------





    var update = $rootScope.$on('callSaveMethodCards', function(event, employee) {
      // Update profile progress bar
      // Progress function ar putea fi pusa la comun poate
      vm.progress = getProfileProgress(employee);
      $rootScope.$emit("event:updateProgress", vm.progress);

      var currentEmployee = angular.copy(employee);
      if (!employee.id) {
        Employee.create(currentEmployee);
        return Employee.save(currentEmployee, vm.candidate).then(
          function(data) {

            $rootScope.showToast('Employee created successfuly!');
            // addUsedEquipment();
            Employee.getById(data.id, vm.candidate).then(function(data) {
              onSaveSuccess('save', Employee.create(data));
            }, function() {
              // De facut si la eroare
            });

            vm.employee = {};
          },
          function(error) {
            $rootScope.showToast('Employee creation failed!');
            onSaveError(error);
          });
      } else {
        return Employee.update(currentEmployee, vm.candidate).then(
          function() {
            $rootScope.showToast('Employee updated successfuly!');
            Employee.getById(currentEmployee.id, vm.candidate).then(function(data) {
              onSaveSuccess('update', data);

            }, function() {

              // De facut si la eroare
            });
          },
          function(error) {
            $rootScope.showToast('Employee update failed!', error);
            onSaveError();
          });
      }
    });

    // merge dar probabil nu este cea mai buna varianta(pentru a face doar
    //un update
    $scope.$on('$destroy', function() {
      update();
    });

    function onSaveSuccess(action, employee) {
      vm.btnIsDisabled = false;
      vm.serverErrors = false;
      $rootScope.$broadcast('employeesListChanged', [action, employee]);
      $rootScope.$emit("event:employeeDetailsUpdated", employee);
    }

    function onSaveError(message) {
      vm.btnIsDisabled = false;
      vm.serverErrors = true;
      vm.serverErrorsArray = message;
    }

  }

}());
