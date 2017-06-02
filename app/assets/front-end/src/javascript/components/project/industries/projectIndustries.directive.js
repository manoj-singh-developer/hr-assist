(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectIndustries', hraProjectIndustries);

  function hraProjectIndustries() {
    return {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'querySearch': '=',
        'settings': '='
      },
      controller: 'projectIndustriesCtrl',
      controllerAs: 'prjIndustries',
      templateUrl: rootTemplatePath + 'project/industries/projectIndustries.view.html',
    };
  }

})();
