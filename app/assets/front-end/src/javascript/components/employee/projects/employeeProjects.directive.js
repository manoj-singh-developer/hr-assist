(function() {

  'use strict';


  angular
    .module('HRA')
    .directive('hraUserProjects', hraUserProjects);

  function hraUserProjects() {
    let directive = {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'toggleForm': '=',
        'querySearch': '=',
        'settings': '='
      },
      controller: 'userProjectsCtrl',
      controllerAs: 'userProjects',
      templateUrl: rootTemplatePath + '/employee/projects/employeeProjects.view.html',
    };

    return directive;
  }

}());
