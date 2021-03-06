// This service convert UTC timezone to yyyy/mm/dd date format
(() => {

  'use strict';

  angular
    .module('HRA')
    .service('dateService', dateService);

  function dateService() {

    return {
      format: format
    };

    function format(d) {
      let date = new Date(d)
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      let yyyy = date.getFullYear();
      if (dd < 10) { dd = '0' + dd }
      if (mm < 10) { mm = '0' + mm };
      return d = yyyy + '-' + mm + '-' + dd
    }

  }

})();
