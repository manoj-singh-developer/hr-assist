((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('industriesCtrl', industriesCtrl);

  industriesCtrl
    .$inject = ['$scope', '$rootScope', '$mdDialog', 'tableSettings', 'autocompleteService', 'Industry'];

  function industriesCtrl($scope, $rootScope, $mdDialog, tableSettings, autocompleteService, Industry) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.industrie = [];
    vm.tableSettings = tableSettings;


    _getIndustrie();


    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;


    $rootScope.$on('event:industryUpdate', () => {
      // TODO: need a beeter approach here,
      // there is no need for an extra request on update
      _getIndustrie();
    });

    $rootScope.$on('event:industryAdd', (event, data) => {
      vm.industries = vm.industries.concat(data);
    });

    function showForm(industry) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/industry/form/industryForm.view.html',
        controller: 'industryFormCtrl',
        controllerAs: 'industryForm',
        clickOutsideToClose: true,
        data: {
          industry: angular.copy(industry),
        }
      });
    }

    function showFormJson() {}

    function remove(industry, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + industry.name + ' industry ?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        Industry.remove(industry.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.industries, { id: industry.id });
            vm.industries = _.without(vm.industries, toRemove);
          }
        });
      });
    }

    function multipleRemove() {}

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.industries);
    }


    function _getIndustrie() {
      Industry.getAll().then((data) => {
        vm.industries = data;
        return autocompleteService.buildList(vm.industries, ['name']);
      });
    }

  }

})(_);
