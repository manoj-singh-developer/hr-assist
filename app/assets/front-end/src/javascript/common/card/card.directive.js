(() => {

  'use strict';

  angular
    .module('HRA')
    .directive('hraCard', hraCard);

  function hraCard() {
    let directive = {
      restrict: 'E',
      controller: 'cardCtrl',
      controllerAs: 'card'
    };

    return directive;
  }

})();
