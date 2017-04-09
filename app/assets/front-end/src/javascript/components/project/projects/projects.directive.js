(function() {
  'use strict';
  // hraProjects directive
  // ------------------------------------------------------------------------
  angular.module('HRA').directive('hraProjects', hraProjects);

  function hraProjects() {
    return {
      restrict: 'EA',
      replace: true,
      controller: 'projectsCtrl as projects',
      templateUrl: rootTemplatePath + 'project/projects/projects.view.html'
    };
  }
  // projectsList controller
  // ------------------------------------------------------------------------
  angular.module('HRA').controller('projectsCtrl', projectsCtrl);
  projectsCtrl.$inject = ['$rootScope', '$scope', '$http', '$mdDialog', '$mdEditDialog', 'autocompleteService', 'miscellaneousService', 'ProjectModel', 'Technology', 'Customer', 'AppType', 'Industry', '$timeout'];

  function projectsCtrl($rootScope, $scope, $http, $mdDialog, $mdEditDialog, autocompleteService, miscellaneousService, ProjectModel, Technology, Customer, AppType, Industry, $timeout) {

    var vm = this;
    vm.selected = [];
    vm.limitOptions = [5, 10, 15];
    vm.showFilters = false;
    vm.countries = [];
    vm.applicationTypes = [];
    vm.industries = [];
    vm.timeLeft = timeLeft;
    var today = new Date();
    vm.today = today;
    vm.ids = [];
    vm.createSkill = [];
    vm.filteredDate = [];
    var startDateFilter = [];
    var dateFilter = [];
    var dateForFilter = new Date();
    vm.startDatefilter = startDatefilter;
    vm.years = '';
    vm.app = '';
    vm.industry = '';
    vm.customer = '';
    vm.technology = '';
    vm.resetFilters = resetFilters;
    //vm.yearsFilter = yearsFilter;
    vm.filteredYears = [];
    vm.apps = [];
    vm.industries = [];
    vm.customers = [];
    vm.technologies = [];
    vm.techs = [];
    vm.projects = [];
    vm.arrayTechnology = [];
    vm.projectCopy = [];
    vm.projCpy = [];
    vm.arrayCustomers = [];
    vm.arrayIndustries = [];
    vm.arrayAppType = [];
    vm.table = {
      options: {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
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
    getProjects();
    getTechs();
    getIndustrie();
    getApps();
    getCustomers();
    // Public methods
    // -------------------------------------------------------------------------------
    vm.querySearch = querySearch;
    vm.showFormDialog = showFormDialog;
    vm.showFormJsonDialog = showFormJsonDialog;
    vm.deleteConfirm = deleteConfirm;
    vm.removeMultipleProjects = removeMultipleProjects;
    vm.toggleFilters = toggleFilters;
    //  vm.addFromApi = addFromApi;
    vm.querySearchTechonology = querySearchTechonology;
    vm.selectedTechonologyChange = selectedTechonologyChange;
    vm.removeSearchTechnology = removeSearchTechnology;
    vm.querySearchCustomers = querySearchCustomers;
    vm.selectedCustomersChange = selectedCustomersChange;
    vm.removeSearchCustomers = removeSearchCustomers;
    vm.querySearchIndustry = querySearchIndustry;
    vm.selectedIndustryChange = selectedIndustryChange;
    vm.removeSearchIndustry = removeSearchIndustry;
    vm.querySearchAppType = querySearchAppType;
    vm.selectedAppTypeChange = selectedAppTypeChange;
    vm.removeSearchAppType = removeSearchAppType;
    vm.getHeader = getHeader;
    vm.getArray = getArray;
    // Public methods declarations
    // --------------------------------------------------------------------------------
    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function getHeader() {
      return ["Name", "Description", "Start Date", "Deadline", "Type", "Industry", "Customers", "Technologies", "Employees"];
    }

    function getArray() {
      var temporary = [];
      for (var i = 0; i < vm.projects.length; i++) {
        var appType = [];
        var industries = [];
        var customers = [];
        var employees = [];
        if (vm.projects[i].applicationTypes) {
          for (var j = 0; j < vm.projects[i].applicationTypes.length; j++) appType.push(vm.projects[i].applicationTypes[j].name);
        }
        if (vm.projects[i].industries) {
          for (var l = 0; l < vm.projects[i].industries.length; l++) industries.push(vm.projects[i].industries[l].name);
        }
        if (vm.projects[i].customers) {
          for (var e = 0; e < vm.projects[i].customers.length; e++) customers.push(vm.projects[i].customers[e].name);
        }
        if (vm.projects[i].employees) {
          for (var p = 0; p < vm.projects[i].employees.length; p++) employees.push(vm.projects[i].employees[p].firstName + " " + vm.projects[i].employees[p].lastName);
        }
        temporary.push({
          name: vm.projects[i].name,
          description: vm.projects[i].description,
          startDate: vm.projects[i].startDate.slice(0, 10),
          deadline: vm.projects[i].deadline.slice(0, 10),
          applicationTypes: appType.join(),
          industries: industries.join(),
          customers: customers.join(),
          technologies: vm.projects[i].technologies.join(),
          employees: employees.join()
        });
      }
      return temporary;
    }

    function startDatefilter(index) {
      dateFilter = vm.projects.map(function(item) {
        dateForFilter = new Date(item.startDate);
        if (dateForFilter.getTime() == vm.filteredDate.startDate.getTime()) startDateFilter.push(item);
        return startDateFilter;
      });
      vm.projects = startDateFilter;
    }

    function resetFilters() {
      //getProjects();
      vm.projects = vm.projectCopy;
      vm.searchTechonology = '';
      vm.arrayTechnology = [];
      vm.searchCustomers = '';
      vm.arrayCustomers = [];
      vm.searchIndustry = '';
      vm.arrayIndustries = [];
      vm.searchAppType = '';
      vm.arrayAppType = [];
      vm.filteredDate.startDate = '';
    }

    function timeLeft() {
      var days = vm.projects.map(function(project) {
        var oneDay = 24 * 60 * 60 * 1000;
        var daysLeft = 0;
        var deadline = new Date(project.deadline);
        var startDate = new Date(project.startDate);
        var currentDay = Date.parse(today);
        var deadlineProject = Date.parse(project.deadline);
        // daysLeft = Math.round(Math.abs((deadline.getTime() - today.getTime())/(oneDay)));
        daysLeft = deadlineProject - currentDay;
        project.daysLeft = Math.ceil(daysLeft / oneDay);
        return daysLeft;
      });
    }

    function removeMultipleProjects() {
      for (var i = 0; i < vm.table.selected.length; i++) {
        vm.ids.push(vm.table.selected[i].id);
        vm.projects = _.without(vm.projects, _.findWhere(vm.projects, {
          id: vm.table.selected[i].id
        }));
      }
      ProjectModel.remove({
        id: vm.ids
      }).then(function(res) {
        $rootScope.showToast('Projects deleted successfuly!');
        vm.table.selected = [];
      }, function(err) {
        $rootScope.showToast('Projects deleted failed!');
      });
    }

    function showFormDialog(event, projects, project, index, action) {
      event.stopPropagation();
      if (!project) {
        project = new ProjectModel();
      }
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'projectForm.tmpl.html',
        controller: 'projectModal as projectM',
        targetEvent: event,
        clickOutsideToClose: true,
        data: {
          projects: projects,
          project: project,
          projectIndex: index
        }
      });
    }

    function showFormJsonDialog(event) {
      event.stopPropagation();
      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'projectJsonForm.tmpl.html',
        controller: 'projectJsonModal as projectJsonM',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    // function addFunctions() {
    //     customerModel.getFromApi().then(function(res) {
    //         $rootScope.showToast("Customers loaded!");
    //     }, function(err) {
    //         $rootScope.showToast("Error on loading customers");
    //     });
    //     Industries.getFromApi().then(function(res) {
    //         $rootScope.showToast("Industries loaded!");
    //     }, function(err) {
    //         $rootScope.showToast("Error on loading industries");
    //     });
    //     appType.getFromApi().then(function(res) {
    //         $rootScope.showToast("Application types loaded!");
    //     }, function(err) {
    //         $rootScope.showToast("Error on loading application types");
    //     });
    // }

    // function addFromApi() {
    //     addFunctions();
    //     $timeout(function() {
    //         getApps();
    //         getIndustrie();
    //         getCustomers();
    //         getTechoFromApi();
    //     }, 4000); // De ce e cu timeout ?
    //     $timeout(function() {
    //         ProjectModel.getFromApi(vm.appType, vm.industryes, vm.customers, vm.newSkillFromApi).then(function(res) {
    //             ProjectModel.saveApi(res);
    //             $rootScope.showToast("Projects loaded!");
    //         }, function(err) {
    //             $rootScope.showToast("Error on loading projects");
    //         });
    //     }, 6000); // De ce e cu timeout ?
    // }

    function deleteConfirm(event, project, index) {
      event.stopPropagation();
      var confirm = $mdDialog.confirm().title('Delete ' + ' project ?').targetEvent(event).cancel('No').ok('Yes');
      $mdDialog.show(confirm).then(function() {
        removeProject(project, index);
      });
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.projects);
    }
    // Private methods declaration
    // ------------------------------------------------------------------------
    function getApps() {
      AppType.getAll().then(function(data) {
        vm.appType = data;
        return autocompleteService.buildList(vm.appType, ['name']);
      }, function(err) {})
    }

    function getIndustrie() {
      Industry.getAll().then(function(data) {
        vm.industryes = data;
        return autocompleteService.buildList(vm.industryes, ['name']);
      }, function(err) {});
    }

    function getCustomers() {
      Customer.getAll().then(function(data) {
        vm.customers = data;
        return autocompleteService.buildList(vm.customers, ['name']);
      }, function(err) {});
    }

    function getTechs() {
      Technology.getAll().then(function(res) {
        vm.skillList = res;
        vm.techs = res;
        autocompleteService.buildList(vm.skillList, ['name']);
      }, function(res) {
        $rootScope.showToast('Error on loading data! Please refresh!');
      });
    }

    function getProjects() {
      ProjectModel.getAll().then(function(data) {
        vm.projects = data;
        vm.projectCopy = angular.copy(vm.projects);
        timeLeft();
        return autocompleteService.buildList(vm.projects, ['name']);
      }, function(data) {});
    }

    function getTechoFromApi() {
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
        Technology.saveJsons(vm.finalTechArr).then(function(data) {
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

    function removeProject(project, $index) {
      var projectToRemove = {
        id: project.id
      };
      ProjectModel.remove(projectToRemove).then(function(data) {
        var projectIndex = miscellaneousService.getItemIndex(vm.projects, project.id);
        vm.projects.splice(projectIndex, 1);
        $rootScope.showToast('Project deleted successfully!');
      }, function(data) {
        $rootScope.showToast('Failed to delete project');
      });
    }
    $scope.$on('projectsListChanged', function(event, args) {
      var project = args[1];
      var projectIndex = '';
      switch (args[0]) {
        case 'save':
          if (!vm.projects) {
            vm.projects = [];
          }
          vm.projects.push(project);
          timeLeft();
          break;
        case 'update':
          projectIndex = miscellaneousService.getItemIndex(vm.projects, project.id);
          vm.projects[projectIndex] = angular.copy(project);
          timeLeft();
          break;
        default:
          getProjects();
      }
    });
    // Filters
    // -------------------------------------------------------------------------
    //technology filter
    function querySearchTechonology(query) {
      return autocompleteService.querySearch(query, vm.skillList);
    }

    function selectedTechonologyChange(items, list) {
      if (items !== undefined) {
        vm.arrayTechnology.push(items);
        searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
      }
    }

    function removeSearchTechnology(index) {
      vm.arrayTechnology.splice(index, 1);
      searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
    }
    //customer filter
    function querySearchCustomers(query) {
      return autocompleteService.querySearch(query, vm.customers);
    }

    function selectedCustomersChange(items, list) {
      if (items !== undefined) {
        vm.arrayCustomers.push(items);
        searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
      }
    }

    function removeSearchCustomers(index) {
      vm.arrayCustomers.splice(index, 1);
      searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
    }
    //industry filter
    function querySearchIndustry(query) {
      return autocompleteService.querySearch(query, vm.industryes);
    }

    function selectedIndustryChange(items, list) {
      if (items !== undefined) {
        vm.arrayIndustries.push(items);
        searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
      }
    }

    function removeSearchIndustry(index) {
      vm.arrayIndustries.splice(index, 1);
      searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
    }
    //app type filter
    function querySearchAppType(query) {
      return autocompleteService.querySearch(query, vm.appType);
    }

    function selectedAppTypeChange(items, list) {
      if (items !== undefined) {
        vm.arrayAppType.push(items);
        searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
      }
    }

    function removeSearchAppType(index) {
      vm.arrayAppType.splice(index, 1);
      searchWhenRemove(vm.arrayTechnology, vm.arrayCustomers, vm.arrayIndustries, vm.arrayAppType);
    }

    function searchWhenRemove(technologyInfo, customersInfo, industryInfo, appTypeInfo) {
      var projCpy = vm.projectCopy;
      //technology search
      if (technologyInfo.length > 0) {
        var resFinal = _.filter(technologyInfo, function(items) {
          var result = _.filter(projCpy, function(item) {
            if (item.technologies.length > 0) {
              var final = _.filter(item.technologies, function(technologies) {
                if (technologies === items) {
                  return item;
                }
              })
              if (final.length > 0) {
                return final;
              }
            }
          })
          projCpy = result;
          vm.projects = result;
        })
      } else {
        vm.projects = projCpy;
      }
      //customersearch
      if (customersInfo.length > 0) {
        var resFinal = _.filter(customersInfo, function(items) {
          var result = _.filter(projCpy, function(item) {
            if (item.customers.length > 0) {
              var final = _.filter(item.customers, function(customer) {
                if (customer.name === items) {
                  return item;
                }
              })
              if (final.length > 0) {
                return final;
              }
            }
          })
          projCpy = result;
          vm.projects = result;
        })
      } else {
        vm.projects = projCpy;
      }
      //industry search
      if (industryInfo.length > 0) {
        var resFinal = _.filter(industryInfo, function(items) {
          var result = _.filter(projCpy, function(item) {
            if (item.industries.length > 0) {
              var final = _.filter(item.industries, function(industry) {
                if (industry.name === items) {
                  return item;
                }
              })
              if (final.length > 0) {
                return final;
              }
            }
          })
          projCpy = result;
          vm.projects = result;
        })
      } else {
        vm.projects = projCpy;
      }
      //app type search
      if (appTypeInfo.length > 0) {
        var resFinal = _.filter(appTypeInfo, function(items) {
          var result = _.filter(projCpy, function(item) {
            if (item.applicationTypes.length > 0) {
              var final = _.filter(item.applicationTypes, function(apptype) {
                if (apptype.name === items) {
                  return item;
                }
              })
              if (final.length > 0) {
                return final;
              }
            }
          })
          projCpy = result;
          vm.projects = result;
        })
      } else {
        vm.projects = projCpy;
      }
    }
  }
}());
