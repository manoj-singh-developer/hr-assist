(() => {

  'use strict';

  let tableSettings = {
    options: {
      rowSelection: true,
      multiSelect: true,
      autoSelect: false,
      decapitate: false,
      largeEditDialog: false,
      boundaryLinks: true,
      limitSelect: true,
      pageSelect: true
    },
    query: {
      order: 'name',
      filter: '',
      limit: 10,
      page: 1
    },
    "limitOptions": [10, 15, 20],
    selected: []
  };

  angular
    .module('HRA')
    .value('tableSettings', tableSettings);

})();
