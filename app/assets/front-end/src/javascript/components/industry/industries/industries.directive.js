(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraIndustries', hraIndustries);

  function hraIndustries() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'industriesCtrl',
      controllerAs: 'industries',
      templateUrl: rootTemplatePath + '/industry/industries/industries.view.html'
    };

    return directive;
  }

})();
