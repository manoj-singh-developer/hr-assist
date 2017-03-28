// autocomplete service
// ------------------------------------------------------------------------
angular
  .module('HRA')
  .service('getIdsService', getIdsService);

getIdsService
  .$inject = [];

function getIdsService() {

  // Public methods
  // ------------------------------------------------------------------------
  return {
    getIds: getIds
  };



  // Public methods declaration
  // ------------------------------------------------------------------------
  function getIds(list) {
    if (list.length > 0) {
      list = list.map(function (item) {
        return parseInt(item.id);
      });
    } else {
      list = [];
    }
    return list;
  }

}
