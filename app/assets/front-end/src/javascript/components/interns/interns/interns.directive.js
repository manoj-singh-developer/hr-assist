(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraInterns', hraInterns);

  function hraInterns() {
    let directive = {
      restrict: 'E',
      scope: {},
      controller: 'internsCtrl',
      controllerAs: 'interns',
      templateUrl: rootTemplatePath + '/interns/interns/interns.view.html'
    };

    return directive;
  }

})();
