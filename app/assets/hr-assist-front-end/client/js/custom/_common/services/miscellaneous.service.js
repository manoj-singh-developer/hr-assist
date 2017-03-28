// spliceArray service
// ------------------------------------------------------------------------
angular
  .module('HRA')
  .service('miscellaneousService', miscellaneousService);

miscellaneousService
  .$inject = [];

function miscellaneousService() {

  // Public methods
  // ------------------------------------------------------------------------
  return {
    getItemIndex: getItemIndex
  };



  // Public methods declaration
  // ------------------------------------------------------------------------
  function getItemIndex(array, id) {
    var itemToRemoveIndex = array.map(function(item) {
      return item.id;
    }).indexOf(parseInt(id));

    return itemToRemoveIndex;
  }
}
