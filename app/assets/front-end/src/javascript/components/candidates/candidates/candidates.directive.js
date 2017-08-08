(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraCandidates', hraCandidates);

  function hraCandidates() {
    return {
      restrict: 'EA',
      scope:{},
      controller: 'candidatesCtrl',
      controllerAs: 'candidates',
      templateUrl: rootTemplatePath + 'candidates/candidates/candidates.view.html'
    };
  }

}());
