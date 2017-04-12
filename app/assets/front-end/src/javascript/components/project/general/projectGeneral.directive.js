(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectGeneral', hraProjectGeneral);

  function hraProjectGeneral() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'projectGeneralCtrl',
      controllerAs: 'prjGeneral',
      templateUrl: rootTemplatePath + '/project/general/projectGeneral.view.html'
    };

    return directive;

  }

})();
