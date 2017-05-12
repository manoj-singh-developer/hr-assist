(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectsFilters', hraProjectsFilters);

  function hraProjectsFilters() {
    let directive = {
      restrict: 'E',
      templateUrl: rootTemplatePath + 'project/filters/projectsFilters.view.html'
    };

    return directive;
  }

})();
