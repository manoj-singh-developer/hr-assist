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
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      controller: 'employeeCourseController',
      controllerAs: 'employeeCourse',
      templateUrl: rootTemplatePath + '/employee/courses/employeeCourses.view.html'
    };
  }

}());
