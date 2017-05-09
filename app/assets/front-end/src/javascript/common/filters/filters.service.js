(() => {

  'use strict';

  angular
    .module('HRA')
    .service('filterService', filterService);

  function filterService($filter) {

    let api = {
      filter,
      getTypes

    };

    function filter(list, listCopy, filters, filteringType) {
      if (filteringType === 'add') {
        list = $filter('hraFilters')(list, filters);
      } else if (filteringType === 'remove' || !filteringType) {
        list = $filter('hraFilters')(listCopy, filters);
      }
      return list;
    }

    function getTypes() {
      let settings = {
        add: 'add',
        remove: 'remove'
      };
      return settings;
    }

    return api;

  }

})();
