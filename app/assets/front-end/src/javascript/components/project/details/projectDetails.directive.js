(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectDetails', hraProjectDetails);

  function hraProjectDetails() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'projectDetailsCtrl',
      controllerAs: 'prjtDetails',
      templateUrl: rootTemplatePath + '/project/details/projectDetails.view.html'
    };

    return directive;
  }

})();
