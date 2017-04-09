(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraTechnologiesDetails', hraTechnologiesDetails);

  function hraTechnologiesDetails() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'technologyDetailsCtrl',
      controllerAs: 'technologyDetails',
      templateUrl: rootTemplatePath + '/components/technology/details/technologyDetails.view.html'
    };

    return directive;
  }

})();
