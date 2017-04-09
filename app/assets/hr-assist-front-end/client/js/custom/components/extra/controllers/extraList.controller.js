(function() {

  'use strict';

  // employeesList controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('extraListController', extraListController);


  extraListController.$inject = ['$rootScope', '$scope', '$mdDialog', 'autocompleteService', 'miscellaneousService', 'ExtraModel', '$templateCache', 'customerModel', 'appType', 'ProjectModel', 'Technology', '$timeout'];

  function extraListController($rootScope, $scope, $mdDialog, autocompleteService, miscellaneousService, ExtraModel, $templateCache, customerModel, appType, ProjectModel, Technology, $timeout) {

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
        order: 'name',
        filter: '',
        limit: 6,
        page: 1
      },
      "limitOptions": [6, 15, 20],
      selected: []
    };

    vm.api = true;
    vm.createSkill = [];
    vm.skillList = [];
    vm.appType = [];
    vm.industryes = [];
    vm.customers = [];


    vm.showFormDialog = showFormDialog;
    vm.saveIndustry = saveIndustry;
    vm.deleteConfirm = deleteConfirm;
    vm.showFormJsonDialog = showFormJsonDialog;


    getAllExtra();

    $scope.$on('event:extraListChanged', function(event, args) {
      var extra = args[1];
      var extraIndex = '';
      switch (args[0]) {
        case 'save':
          if (!vm.extraList) {
            vm.extraList = [];
          }
          vm.extraList.push(extra);
          break;
        case 'update':
          extraIndex = miscellaneousService.getItemIndex(vm.extraList, extra.id);
          vm.extraList[extraIndex] = angular.copy(extra);
          break;
        case 'saveFromJson':
          vm.extraList = vm.extraList.concat(extra);
          break;
        default:
          getAllExtra();
      }
    });


    function showFormDialog(event, data, id) {
      var dialogTitle;

      if (event.currentTarget.name === 'add-industry') {
        $timeout(function() {
          dialogTitle = "Add Industry";
          $rootScope.$emit('title', dialogTitle);
        }, 200);
      } else if (event.currentTarget.name === 'edit-industry') {
        $timeout(function() {
          dialogTitle = 'Edit Industry';
          $rootScope.$emit('title', dialogTitle);
        }, 200);
      }

      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/extra/views/extraForm.view.html',
        controller: 'extraFormCtrl',
        controllerAs: 'extraForm',
        clickOutsideToClose: true,
        data: {
          extra: data,
          extraType: vm.extra.type,
          id: id
        }
      });
    }

    // Get the extra informations using the extraType attribute
    // Redirect the request to the correct api url
    function getAllExtra() {
      if (vm.extra.api !== undefined) {
        vm.api = false;
      }

      switch (vm.extra.type) {
        case 'industries':
          getIndustries('industries');
          break;
        case 'customers':
          getCustomers('customers');
          break;
        case 'appTypes':
          getAppTypes('appTypes');
          break;
        default:
          break;
      }
    }

    function getIndustries(extraType) {
      ExtraModel.getAllExtra(extraType).then(function(data) {
        vm.extraList = data;
      }, function() {
        console.log('GET Industrie Failed');
      });
    }

    function getCustomers(extraType) {
      ExtraModel.getAllExtra(extraType).then(function(data) {
        vm.extraList = data;
      }, function() {
        console.log('GET Customers Failed');
      });
    }

    function getAppTypes(extraType) {
      ExtraModel.getAllExtra(extraType).then(function(data) {
        vm.extraList = data;
      }, function() {
        console.log('GET App Types Failed');
      });
    }


    // SAVE
    function saveIndustry(data, extraType) {
      ExtraModel.save(data, extraType).then(function(data) {
        vm.extraList = data;
      }, function(data) {
        console.log('GET Industrie Failed');
      });
    }

    function deleteConfirm(event, type, index, removeFromIndex) {
      event.stopPropagation();
      var confirm = $mdDialog.confirm().title('Delete the ' + type + ' ' + vm.extra.type + '?').targetEvent(event).cancel('No').ok('Yes');
      $mdDialog.show(confirm).then(function() {
        removeType(index, vm.extra.type, removeFromIndex);
      });
    }

    function removeType(index, extraType, removeFromIndex) {
      var extraToRemove = {
        id: index
      };
      ExtraModel.remove(extraToRemove, extraType).then(function(success) {
        var extraIndex = miscellaneousService.getItemIndex(vm.extraList, index);
        vm.extraList.splice(extraIndex, 1);
      }, function(error) {
        $rootScope.showToast('Failed to delete ' + extraType);
      });
    }

    //TODO: Implement Add industry from JSON
    function showFormJsonDialog(event) {
      event.stopPropagation();
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'extraJsonForm.tmpl.html',
        controller: 'extraJsonModal as extraJsonM',
        targetEvent: event,
        clickOutsideToClose: true,
        data: {
          extraType: vm.extra.type
        }
      });
    }
  }
}());
