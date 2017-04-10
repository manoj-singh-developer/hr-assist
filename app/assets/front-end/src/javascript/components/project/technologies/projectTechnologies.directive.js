(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectTechnologies', hraProjectTechnologies);

  function hraProjectTechnologies() {
    let directive = {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'toggleForm': '=',
        'querySearch': '=',
        'settings': '='
      },
      controller: 'projectTechnologiesCtrl',
      controllerAs: 'prjTechnologies',
      templateUrl: rootTemplatePath + '/project/technologies/projectTechnologies.view.html'
    };

    return directive;
  }

})();
