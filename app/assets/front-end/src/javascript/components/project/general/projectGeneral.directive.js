(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectGeneral', hraProjectGeneral);

  function hraProjectGeneral() {
    let directive = {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'toggleForm': '=',
        'querySearch': '=',
        'settings': '='
      },
      controller: 'projectGeneralCtrl',
      controllerAs: 'prjGeneral',
      templateUrl: rootTemplatePath + '/project/general/projectGeneral.view.html'
    };

    return directive;

  }

})();
