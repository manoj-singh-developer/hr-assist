(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraAppTypes', hraAppTypes);

  function hraAppTypes() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'appTypesCtrl',
      controllerAs: 'appTypes',
      templateUrl: rootTemplatePath + '/appType/appTypes/appTypes.view.html'
    };

    return directive;
  }

})();
