(() => {

  'use strict';

  angular
    .module('HRA')
    .filter('hraFilters', hraFilters);

  function hraFilters() {
    let filter = function(filteringList, filtersObject) {
      let filterField = '';
      parseFiltersObject(filtersObject);

      // We are iterating over an object that contains multiple arrays
      // Each array has multiple filter objects (with id and other properties)
      // Example: technologies ['technology1', 'technology2']
      // Example: industries ['industry1', 'industry2']
      function parseFiltersObject(object) {
        angular.forEach(object, parseFilters);
      }

      // For every filter in the array we are parsing the main filtering list
      function parseFilters(filtersList, key) {
        filterField = key;
        filtersList.map(parseFilteringList);
      }

      function parseFilteringList(filterObject) {
        filteringList = filteringList.filter(filteringListItem => {
          let nameList = [];
          // I'm in the filtering list item
          // I'm searching for the exact field that I'm trying to filter
          // Example: project.technologies
          // Example project.industries
          nameList = convertToNames(filteringListItem[filterField]);

          // filterObject.name : I suppose that we are filtering
          // using the filter name
          // I we need to use label in some cases we need to make this generic
          return checkIfIncludes(filterObject.name, nameList);
        });
      }

      // Again I suppose that we are using only the name property
      function convertToNames(list) {
        return list.map(item => item.name);
      }

      // A simple check to see if a specific element is in an array
      // Example: item is 'CSS'
      // Example: list is technologies array from a project ['CSS', 'HTML']
      function checkIfIncludes(item, list) {
        if (list.includes(item)) {
          return true;
        } else {
          return false;
        }
      }

      return filteringList;
    };

    return filter;
  }

})();
