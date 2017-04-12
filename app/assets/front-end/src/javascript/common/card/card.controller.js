(() => {

  'use strict';

  angular
    .module('HRA')
    .controller('cardCtrl', cardCtrl);

  cardCtrl
    .$inject = ['autocompleteService'];

  function cardCtrl(autocompleteService) {

    // TODO: Add more generic card methods here in order to be kinda dry

    var vm = this;
    vm.settings = {};
    vm.settings.showForm = false;


    vm.toggleForm = toggleForm;
    vm.querySearch = querySearch;


    function toggleForm() {
      vm.technologiesEdit = vm.technologiesPreview;
      vm.settings.showForm = !vm.settings.showForm;
    }

    function querySearch(query, list) {
      return autocompleteService.querySearch(query, list);
    }

  }

})();
