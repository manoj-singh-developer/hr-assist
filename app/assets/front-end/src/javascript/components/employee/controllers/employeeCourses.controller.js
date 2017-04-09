(function() {

  'use strict';

  // ------------------------------------------------------------------------
  //   @employeeCourseController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeCourseController', employeeCourseController);

  employeeCourseController
    .$inject = ['$rootScope', '$scope', '$stateParams'];





  function employeeCourseController($rootScope, $scope, $stateParams) {

    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.disabledCourses = true;
    vm.courseIncrement = [];
    vm.courseDates = [];
    vm.courseList = [];
    vm.month = [];
    vm.copyCat = [];





    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('employeeIsLoadedEvent', function(event, employee) {
      vm.employee = employee;
      updateCourses();
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });





    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.addNewCourse = addNewCourse;
    vm.changeCourseView = changeCourseView;
    vm.saveEmployee = saveEmployee;
    vm.removeCourse = removeCourse;
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


    function addNewCourse() {
      vm.courseIncrement.push({});
    }

    function changeCourseView() {
      vm.disabledCourses = false;
    }

    function removeCourse(index) {
      vm.courseIncrement.splice(index, 1);
      vm.courseList.length = 0;
      vm.courseDates.length = 0;
      for (var i = 0; i < vm.courseIncrement.length; i++) {
        vm.courseList[i] = vm.courseIncrement[i] ? ({
          title: vm.courseIncrement[i].title,
          diploma: vm.courseIncrement[i].diploma,
          issue: vm.courseIncrement[i].issue
        }) : '';
        vm.courseDates[i] = vm.courseIncrement[i] ? ({
          from: new Date(vm.courseIncrement[i].from),
          to: new Date(vm.courseIncrement[i].to)
        }) : '';
      }

    }

    function saveEmployee(employee) {
      fill(employee);
      vm.disabledCourses = true;
      vm.copyCat = angular.copy(vm.courseIncrement);
      $rootScope.$emit("callSaveMethodCards", employee);
    }

    function cancelAdd() {
      vm.disabledCourses = true;
      for (var i = vm.copyCat.length; i < vm.courseIncrement.length; i++) {
        vm.courseList[i] = '';
        vm.courseDates[i] = new Date();
      }
      vm.courseIncrement = _.initial(vm.courseIncrement, vm.courseIncrement.length - vm.copyCat.length);
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function updateCourses() {
      vm.courseIncrement = [];
      vm.montPicker = [];

      if (vm.employee.coursesAndCertifications !== null && vm.employee.coursesAndCertifications !== undefined && vm.employee.coursesAndCertifications !== '') {
        if (vm.employee.coursesAndCertifications.length > 0) {
          for (var j = 0; j < vm.employee.coursesAndCertifications.length; j++) {
            vm.courseIncrement.push(angular.fromJson(vm.employee.coursesAndCertifications[j]));
          }
        } else if (vm.employee.coursesAndCertifications.length === 0) {
          return;
        } else {
          vm.courseIncrement.push(angular.fromJson(vm.employee.coursesAndCertifications));
        }
        vm.copyCat = angular.copy(vm.courseIncrement);
        for (var i = 0; i < vm.courseIncrement.length; i++) {
          vm.courseList[i] = vm.courseIncrement[i] ? ({
            title: vm.courseIncrement[i].title,
            diploma: vm.courseIncrement[i].diploma,
            issue: vm.courseIncrement[i].issue
          }) : '';

        }
        if (_.isString(vm.employee.coursesDate)) {
          vm.montPicker.push(vm.employee.coursesDate);
        } else {
          vm.montPicker = angular.fromJson(vm.employee.coursesDate);
        }
        for (var j in vm.montPicker) {
          vm.courseDates[j] = new Date(vm.montPicker[j]);
        }
      }
    }

    function fill(employee) {
      vm.month = [];
      for (var i = 0; i < vm.courseIncrement.length; i++)
        vm.courseIncrement[i] = {
          title: vm.courseList[i].title,
          diploma: vm.courseList[i].diploma,
          issue: vm.courseList[i].issue
        };

      for (var j in vm.courseDates) {
        vm.month.push(vm.courseDates[j]);
      }

      employee.coursesDate = angular.toJson(vm.month);

      vm.employee.coursesAndCertifications = angular.toJson(vm.courseIncrement);

      vm.employee.equipments = vm.employee.equipments;

      return employee;
    }

  }

}());
