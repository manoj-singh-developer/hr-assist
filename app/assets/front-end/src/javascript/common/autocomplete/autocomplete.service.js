(() => {

  'use strict';

  angular
    .module('HRA')
    .service('autocompleteService', autocompleteService);

  autocompleteService
    .$inject = [];

  function autocompleteService() {

    let api = {
      querySearch: querySearch,
      buildList: buildList
    };


    function querySearch(query, list) {
      if (query && list) {
        var results = query ? list.filter(createFilterFor(query)) : list;
        return results;
      } else {
        return [];
      }
    }

    //  Build `components` list of key/value pairs
    function buildList(list, attributes) {
      var index = 0;

      if (!list || !list.length) {
        return null;
      } else {
        return list.map(function(item) {
          item.autoCompleteVal = '';
          for (index = 0; index < attributes.length; index++) {
            if (index !== 0) {
              item.autoCompleteVal = item.autoCompleteVal + ' ' + item[attributes[index]].toLowerCase();
            } else {
              item.autoCompleteVal = item[attributes[index]].toLowerCase();
            }
          }
          return item;
        });
      }
    }


    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.autoCompleteVal.indexOf(lowercaseQuery) === 0);
      };
    }

    return api;

  }

})();
