(function() {

  'use strict';

  // employeesList controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('extraListController', extraListController);


  extraListController.$inject = ['$rootScope', '$scope', '$mdDialog', 'autocompleteService', 'miscellaneousService', 'ExtraModel', '$templateCache', 'customerModel', 'Industries', 'appType', 'ProjectModel', 'skillModel', '$timeout'];

  function extraListController($rootScope, $scope, $mdDialog, autocompleteService, miscellaneousService, ExtraModel, $templateCache, customerModel, Industries, appType, ProjectModel, skillModel, $timeout) {

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



    // Public methods
    // ------------------------------------------------------------------------
    vm.showFormDialog = showFormDialog;
    vm.saveIndustry = saveIndustry;
    vm.deleteConfirm = deleteConfirm;
    vm.showFormJsonDialog = showFormJsonDialog;
    vm.addExtraListFromAPI = addExtraListFromAPI;
    vm.addProjectsFromAPI = addProjectsFromAPI;
    vm.updateProjectsFromAPI = updateProjectsFromAPI;





    // Invoking private functions
    // ------------------------------------------------------------------------
    getAllExtra();
    getAllData();

    $scope.$on('event:extraListChanged', function(event, args) {
      var extra = args[1];
      var extraIndex = '';
      extra.id = vm.extraList.length+1;
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




    // Public methods declaration
    // ------------------------------------------------------------------------
    function showFormDialog(event, data, id) {
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

    function addExtraListFromAPI() {
      addFunctions();
    }

    function addProjectsFromAPI() {
      getAllData();
      $timeout(function() {
        ProjectModel.getFromApi(vm.appType, vm.industryes, vm.customers, vm.skillList).then(function(res) {
          ProjectModel.saveApi(res).then(function(data) {
            vm.disabledProjects = true;
            vm.disabledExtra = true;
            $rootScope.showToast("Projects loaded!");
            ProjectModel.getAll().then(
              function(data) {
                console.log("ERROR: ", data);
              },
              function(error) {
                console.log("ERROR: ", error);
              });
          });
        }, function(error) {
          console.log('ERROR: ', error);
        });
      }, 3000);
    }


    function updateProjectsFromAPI(projects) {
      ProjectModel
        .getAll()
        .then(function(projects) {
          projects.forEach(function(project) {
            ProjectModel
              .update(project)
              .then(
                function(data) {
                  console.log('SUCCESS: ', data);
                },
                function(error) {
                  console.log('ERROR: ', error);
                });
          });
        }, function(error) {
          console.log('ERROR: ', error);
        });

    }

    function getAllData() {
      appType.getAll().then(function(data) {
        vm.appType = data;
        return autocompleteService.buildList(vm.appType, ['name']);
      }, function(err) {});
      Industries.getAllIndustries().then(function(data) {
        vm.industryes = data;
        return autocompleteService.buildList(vm.industryes, ['name']);
      }, function(err) {});
      customerModel.getAllCustomers().then(function(data) {
        vm.customers = data;
        return autocompleteService.buildList(vm.customers, ['name']);
      }, function(err) {});
      skillModel.getAll().then(function(res) {
        vm.skillList = res;
        vm.techs = res;
        autocompleteService.buildList(vm.skillList, ['name']);
      }, function(res) {
        $rootScope.showToast('Error on loading data! Please refresh! ');
      });
    }




    // Private methods declaration
    // ------------------------------------------------------------------------
    // Get the extra informations using the extraType attribute
    // Redirect the request to the correct api url
    function getAllExtra() {
      if (vm.extra.api !== undefined) {
        vm.api = false;
      }

      switch (vm.extra.type) {
        case 'industries':
          getAllIndustries('industries');
          break;
        case 'customers':
          getAllCustomers('customers');
          break;
        case 'appTypes':
          getAllAppTypes('appTypes');
          break;
        default:
          break;
      }
    }

    function addFunctions() {
      customerModel.getFromApi().then(function(res) {
        $rootScope.showToast("Customers loaded!");
      }, function(err) {
        $rootScope.showToast("Error on loading customers");
      });
      Industries.getFromApi().then(function(res) {
        $rootScope.showToast("Industries loaded!");
      }, function(err) {
        $rootScope.showToast("Error on loading industries");
      });
      appType.getFromApi().then(function(res) {
        $rootScope.showToast("Application types loaded!");
      }, function(err) {
        $rootScope.showToast("Error on loading application types");
      });
      ProjectModel.getTecho().then(function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].length > 0) {
            for (var j = 0; j < data[i].length; j++) {
              vm.createSkill.push({
                name: data[i][j],
                label: data[i][j]
              });
            }
          }
        }
        vm.finalTechArr = removeDuplicates(vm.createSkill);
        skillModel.saveJsons(vm.finalTechArr).then(function(data) {
          vm.newSkillFromApi = data;
        });
      });
    }

    function removeDuplicates(arr) {
      var newTechArr = [];
      angular.forEach(arr, function(value, key) {
        var exists = false;
        angular.forEach(newTechArr, function(val2, key) {
          if (angular.equals(value.name, val2.name)) {
            exists = true;
          };
        });
        if (exists == false && value.name != "") {
          newTechArr.push(value);
        }
      });
      return newTechArr;
    }



    // GET
    function getAllIndustries(extraType) {
      ExtraModel.getAllExtra(extraType).then(function(data) {
        vm.extraList = data;
      }, function() {
        console.log('GET Industrie Failed');
      });
    }

    function getAllCustomers(extraType) {
      ExtraModel.getAllExtra(extraType).then(function(data) {
        vm.extraList = data;
      }, function() {
        console.log('GET Customers Failed');
      });
    }

    function getAllAppTypes(extraType) {
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
