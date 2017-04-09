(function(_) {

  'use strict';

  angular
    .module('HRA')
    .directive('hraTechnologies', hraTechnologies);

  function hraTechnologies() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'technologiesCtrl',
      controllerAs: 'technologies',
      templateUrl: rootTemplatePath + '/technology/technologies/technologies.view.html'
    };

    return directive;
  }

})();
