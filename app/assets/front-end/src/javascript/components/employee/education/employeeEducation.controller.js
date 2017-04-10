(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeEducationController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeEducationController', employeeEducationController);

  employeeEducationController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'skillModel', 'Employee', 'autocompleteService', 'miscellaneousService'];





  function employeeEducationController($rootScope, $scope, $stateParams, skillModel, Employee, autocompleteService, miscellaneousService) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.disabledEducations = true;
    vm.educationIncrement = [];
    vm.educationDates = [];
    vm.educationList = [];
    vm.copyCat = [];





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
      updateEducation();
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });




    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.changeEducationView = changeEducationView;
    vm.removeEducation = removeEducation;
    vm.addNewEducation = addNewEducation;
    vm.saveEmployee = saveEmployee;
    vm.cancelAdd = cancelAdd;
    vm.toggleCard = toggleCard;





    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function toggleCard(event, action) {

      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    function addNewEducation() {
      vm.educationIncrement.push({});
    }

    function changeEducationView() {
      vm.disabledEducations = false;
    }

    function removeEducation(index) {
      vm.educationIncrement.splice(index, 1);
      vm.educationList.length = 0;
      vm.educationDates.length = 0;
      for (var i = 0; i < vm.educationIncrement.length; i++) {
        vm.educationList[i] = vm.educationIncrement[i] ? ({
          school: vm.educationIncrement[i].school,
          diploma: vm.educationIncrement[i].diploma,
          field: vm.educationIncrement[i].field
        }) : '';
        vm.educationDates[i] = vm.educationIncrement[i] ? ({
          from: new Date(vm.educationIncrement[i].from),
          to: new Date(vm.educationIncrement[i].to)
        }) : '';
      }
    }

    function saveEmployee(employee) {
      fill(employee);
      vm.disabledEducations = true;
      vm.copyCat = angular.copy(vm.educationIncrement);
      $rootScope.$emit("callSaveMethodCards", employee);
    }

    function cancelAdd() {
      vm.disabledEducations = true;
      for (var i = vm.copyCat.length; i < vm.educationIncrement.length; i++) {
        vm.educationList[i] = "";
        vm.educationDates[i] = "";
      }
      vm.educationIncrement = _.initial(vm.educationIncrement, vm.educationIncrement.length - vm.copyCat.length);
    }





    // ----------------------------------------------------------------------
    // Private methods declaration
    // ----------------------------------------------------------------------

    function updateEducation() {
      if (vm.employee.education !== null && vm.employee.education !== undefined && vm.employee.education !== '') {
        if (vm.employee.education.length > 0) {
          for (var x = 0; x < vm.employee.education.length; x++) {
            vm.educationIncrement.push(angular.fromJson(vm.employee.education[x]));
          }
        } else if (vm.employee.education.length === 0) {
          return;
        } else {
          vm.educationIncrement.push(angular.fromJson(vm.employee.education));
        }
        vm.copyCat = angular.copy(vm.educationIncrement);
        for (var i = 0; i < vm.educationIncrement.length; i++) {
          vm.educationList[i] = vm.educationIncrement[i] ? ({
            school: vm.educationIncrement[i].school,
            diploma: vm.educationIncrement[i].diploma,
            field: vm.educationIncrement[i].field
          }) : '';
          vm.educationDates[i] = vm.educationIncrement[i] ? ({
            from: new Date(vm.educationIncrement[i].from),
            to: new Date(vm.educationIncrement[i].to)
          }) : '';
        }
      }
    }

    function fill(employee) {
      for (var i = 0; i < vm.educationIncrement.length; i++)
        vm.educationIncrement[i] = {
          school: vm.educationList[i].school,
          diploma: vm.educationList[i].diploma,
          field: vm.educationList[i].field,
          from: vm.educationDates[i].from,
          to: vm.educationDates[i].to
        };
      vm.employee.education = angular.toJson(vm.educationIncrement);
      vm.employee.equipments = vm.employee.equipments;

      employee = vm.employee;
      return employee;
    }

  }

}());
