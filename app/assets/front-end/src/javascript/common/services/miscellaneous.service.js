// TODO: is this really needed ?
(() => {

  'use strict';

  angular
    .module('HRA')
    .service('miscellaneousService', miscellaneousService);

  function miscellaneousService() {

    return {
      getItemIndex: getItemIndex
    };

    function getItemIndex(array, id) {
      var itemToRemoveIndex = array.map(function(item) {
        return item.id;
      }).indexOf(parseInt(id));

      return itemToRemoveIndex;
    }
  }

})();
