(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @hraUserEducation
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .directive('hraUserEducation', hraUserEducation);

  function hraUserEducation() {
    let directive = {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      controller: 'userEducationController',
      controllerAs: 'userEducation',
      templateUrl: rootTemplatePath + '/employee/education/userEducation.view.html'
    };
    return directive;
  }

}());
