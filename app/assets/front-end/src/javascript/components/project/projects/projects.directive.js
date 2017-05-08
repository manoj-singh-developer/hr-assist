(function() {
  'use strict';

  angular.module('HRA').directive('hraProjects', hraProjects);

  function hraProjects() {
    return {
      restrict: 'EA',
      replace: true,
      controller: 'projectsCtrl',
      controllerAs: 'projects',
      templateUrl: rootTemplatePath + 'project/projects/projects.view.html'
    };
  }

}());
