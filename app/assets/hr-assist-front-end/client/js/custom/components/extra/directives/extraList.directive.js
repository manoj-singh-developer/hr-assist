(function() {

  'use strict';

  // hraExtraList directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraExtraList', hraExtraList);

  function hraExtraList() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        'extra': '='
      },
      controller: 'extraAllListsController',
      controllerAs: 'extraAllLists',
      templateUrl: rootTemplatePath + '/components/extra/views/extraList.view.html'
    };
  }

}());
