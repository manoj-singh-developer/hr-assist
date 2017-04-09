(function() {

  'use strict';

  // trainings controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('trainingsCtrl', trainingsCtrl);

  trainingsCtrl
    .$inject = ['$rootScope', '$scope', '$mdDialog', 'autocompleteService', 'TrainingModel']

  function trainingsCtrl($rootScope, $scope, $mdDialog, autocompleteService, TrainingModel) {

    // Variables
    // ------------------------------------------------------------------------

    var vm = this;
    vm.table = {
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
        order: 'firstName',
        filter: '',
        limit: 10,
        page: 1
      },
      "limitOptions": [10, 15, 20],
      selected: []
    };



    // Public methods
    // ------------------------------------------------------------------------




    // Public methods declaration
    // ------------------------------------------------------------------------


    // Private methods declaration
    // ------------------------------------------------------------------------

  }
}());
