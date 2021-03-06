(function() {

  'use strict';

  angular
    .module('HRA')
    .directive('hraTablePagination', hraTablePagination);

  function hraTablePagination() {
    let directive = {
      restrict: 'E',
      scope: {},
      bindToController: {
        'settings': '='
      },
      controller: 'tablePaginationCtrl',
      controllerAs: 'tablePagination',
      templateUrl: './views/common/table/pagination/tablePagination.view.html'
    };

    return directive;
  }

})();
