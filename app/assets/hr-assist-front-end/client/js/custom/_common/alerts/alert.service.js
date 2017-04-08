(() => {

  'use strict';

  angular
    .module('HRA')
    .service('alertService', alertService);

  alertService
    .$inject = ['$mdToast'];

  function alertService($mdToast) {
    let api = {
      log
    };

    function log(alert) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(alert)
        .position("top left")
        .hideDelay(3500)
      );
    }

    return api;
  }

})();
