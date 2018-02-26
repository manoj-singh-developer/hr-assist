(function(_) {

  'use strict';

  angular
    .module('HRA')
    .directive('hraComponents', hraComponents);

  function hraComponents() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'componentsCtrl',
      controllerAs: 'components',
      templateUrl: rootTemplatePath + '/component/components/components.view.html'
    };

    return directive;
  }

})();
