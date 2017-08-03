(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraCandidatesFilters', hraCandidatesFilters);

  function hraCandidatesFilters() {
    let directive = {
      restrict: 'E',
      templateUrl: rootTemplatePath + 'candidates/filters/candidatesFilters.view.html'
    };

    return directive;
  }

})();
