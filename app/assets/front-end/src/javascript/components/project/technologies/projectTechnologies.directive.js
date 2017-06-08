(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraProjectTechnologies', hraProjectTechnologies);

  function hraProjectTechnologies() {
    let directive = {
      restrict: 'A',
      require: 'hraCard',
      bindToController: {
        'querySearch': '='
      },
      controller: 'projectTechnologiesCtrl',
      controllerAs: 'prjTechnologies',
      templateUrl: rootTemplatePath + '/project/technologies/projectTechnologies.view.html'
    };

    return directive;
  }

})();
