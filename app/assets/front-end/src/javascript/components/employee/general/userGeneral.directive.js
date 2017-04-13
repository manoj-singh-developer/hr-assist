(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraUserGeneral', hraUserGeneral);

  function hraUserGeneral() {
    let directive = {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'toggleForm': '=',
        'querySearch': '=',
        'settings': '='
      },
      controller: 'userGeneralCtrl',
      controllerAs: 'userGeneral',
      templateUrl: rootTemplatePath + '/employee/general/userGeneral.view.html'
    };

    return directive;
  }

})();
