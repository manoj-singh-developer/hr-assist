(function(_) {

  'use strict';

  angular
    .module('HRA')
    .directive('hraTechnologies', hraTechnologies);

  hraTechnologies
    .$inject = [];

  function hraTechnologies() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'technologiesCtrl',
      controllerAs: 'technologies',
      templateUrl: rootTemplatePath + '/components/technology/views/technologies.view.html'
    };

    return directive;
  }

})();
