// autocomplete service
// ------------------------------------------------------------------------
angular
  .module('HRA')
  .service('autocompleteService', autocompleteService);

autocompleteService
  .$inject = [];

function autocompleteService() {

  // Public methods
  // ------------------------------------------------------------------------
  return {
    querySearch: querySearch,
    buildList: buildList
  };



  // Public methods declaration
  // ------------------------------------------------------------------------
  function querySearch(query, list) {
    var results = query ? list.filter(createFilterFor(query)) : list;
    return results;
  }

  //  Build `components` list of key/value pairs
  function buildList(list, attributes) {
    var index = 0;
    var myList = [];

    if(list.length > 0) {
      myList = list;
      console.log("The list provided is empty");
    } 

    return myList.map(function(item) {
      item.autoCompleteVal = '';
      for (index = 0; index < attributes.length; index++) {
        if (index !== 0) {
          // item.autoCompleteVal = item.autoCompleteVal + ' ' + item[attributes[index]].toLowerCase(); crapa la valorile undefined   
          item.autoCompleteVal = item.autoCompleteVal + ' ' + item[attributes[index]];
        } else {
          // item.autoCompleteVal = item.autoCompleteVal + item[attributes[index]].toLowerCase(); crapa la valorile undefined   
          item.autoCompleteVal = item.autoCompleteVal + item[attributes[index]];
        }
      }

      return item;
    });
  }



  // Private methods declaration
  // ------------------------------------------------------------------------
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(item) {
      return (item.autoCompleteVal.indexOf(lowercaseQuery) === 0);
    };
  }

}
