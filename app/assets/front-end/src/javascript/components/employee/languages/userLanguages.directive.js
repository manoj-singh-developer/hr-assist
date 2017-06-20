(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraUserLanguages', hraUserLanguages);

  function hraUserLanguages() {
    let directive = {
      restrict: 'A',
      scope: {},
      require: 'hraCard',
      bindToController: {
        'querySearch': '='
      },
      controller: 'userLanguagesCtrl',
      controllerAs: 'userLanguages',
      templateUrl: rootTemplatePath + '/employee/languages/userLanguages.view.html',
    };
  
    return  directive;
  }
  
})();
