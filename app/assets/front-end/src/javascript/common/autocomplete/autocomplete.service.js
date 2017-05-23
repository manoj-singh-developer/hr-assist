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
        return list;
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
              item.autoCompleteVal = item.autoCompleteVal + checkIfSpace(item.autoCompleteVal) + checkIfNull(item[attributes[index]]);
            } else {
              item.autoCompleteVal = checkIfNull(item[attributes[index]]);
            }
          }
          return item;
        });
      }
    }

    function checkIfNull(item){
      if(item){
        return item.toLowerCase();
      }else {
        return '';
      }
    }

    function checkIfSpace(item) {
      if(item){
        return ' ';
      } else {
        return '';
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
