(() => {

  'use strict';

  angular
    .module('HRA')
    .service('alertService', alertService);

  alertService
    .$inject = ['$mdToast'];

  function alertService($mdToast) {
    let api = {
      log,
      success,
      error
    };

    function log(alert) {
      _showAlert(alert);
    }

    function success(model, operation, message) {
      let alert = null;

      if (message) {
        alert = message;
      } else {
        alert = `${model}: ${operation} successful!`;
      }

      _showAlert(alert);
    }

    // TODO: add a different color for errors
    function error(model, operation, message) {
      let alert = null;

      if (message) {
        alert = message;
      } else {
        alert = `${model}: ${operation} failed!`;
      }

      _showAlert(alert);
    }

    function _showAlert(alert) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(alert)
        .position("top left")
        .hideDelay(3000)
      );
    }

    return api;
  }

})();
