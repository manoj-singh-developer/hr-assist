(function() {

  'use strict';



  // hraExtraListIndustries directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('hraExtraListIndustries', hraExtraListIndustries);

  function hraExtraListIndustries() {
    return {
      restrict: 'EA',
      scope: {},
      bindToController: {
        extra: '='
      },
      controller: 'extraListController',
      controllerAs: 'extraList',
      templateUrl: rootTemplatePath + '/components/extra/views/extraList.industries.view.html'
    };
  }

}());
