(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectAppTypes', hraProjectAppTypes);

  function hraProjectAppTypes() {
    return {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'querySearch': '=',
        'settings': '='
      },
      controller: 'projectAppTypesCtrl',
      controllerAs: 'prjAppTypes',
      templateUrl: rootTemplatePath + 'project/appType/projectAppTypes.view.html',
    };
  }

}());
