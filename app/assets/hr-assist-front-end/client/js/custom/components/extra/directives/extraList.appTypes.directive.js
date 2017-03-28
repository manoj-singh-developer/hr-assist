(function() {

  'use strict';



  // hraExtraListAppTypes directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraExtraListAppTypes', hraExtraListAppTypes);

  function hraExtraListAppTypes() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        extra: '='
      },
      controller: 'extraListController',
      controllerAs: 'extraList',
      templateUrl: rootTemplatePath + '/components/extra/views/extraList.appTypes.view.html'
    };
  }

}());
