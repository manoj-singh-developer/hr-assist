(function() {

  'use strict';

  // ------------------------------------------------------------------------
  //   @hraEmployeeCourse
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraEmployeeCourse', hraEmployeeCourse);

  function hraEmployeeCourse() {
    return {
      restrict: 'EA',
      scope: {},
      controller: 'employeeCourseController',
      controllerAs: 'employeeCourse',
      templateUrl: rootTemplatePath + '/employee/views/employeeCourses.view.html'
    };
  }

}());
