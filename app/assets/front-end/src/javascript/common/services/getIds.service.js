// TODO: is this really needed ?
(() => {

  'use strict';

  angular
    .module('HRA')
    .service('getIdsService', getIdsService);

  function getIdsService() {

    return {
      getIds: getIds
    };

    function getIds(list) {
      if (list.length > 0) {
        list = list.map(function(item) {
          return parseInt(item.id);
        });
      } else {
        list = [];
      }
      return list;
    }

  }

})();
