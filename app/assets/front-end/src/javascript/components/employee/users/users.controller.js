((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('usersCtrl', usersCtrl);

  function usersCtrl($scope, $rootScope, $mdDialog, autocompleteService, User, Technology, Project, AppType, $q, filterService) {

    var vm = this;
    vm.ids = [];
    vm.selected = [];
    vm.users = [];
    vm.resources = {};
    vm.filterType = filterService.getTypes();

    vm.table = {
      options: {
        pageSelect: true
      },
      query: {
        order: 'last_name',
        filter: '',
        limit: 10,
        page: 1
      },
      "limitOptions": [10, 15, 20],
      selected: [],
      total: 0
    };
    vm.showFilters = false;
    vm.filters = {
      technologies: [],
      languages: [],
      projects: []
    };
    vm.search = {
      technologies: '',
      languages: '',
      projects: ''
    };

    _getResources();

    vm.showForm = showForm;
    vm.showFormJson = showFormJson;
    vm.remove = remove;
    vm.multipleRemove = multipleRemove;
    vm.querySearch = querySearch;
    vm.toggleFilters = toggleFilters;
    vm.filterUsers = filterUsers;
    vm.resetFilters = resetFilters;

    function showForm(device) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/device/form/deviceForm.view.html',
        controller: 'deviceFormCtrl',
        controllerAs: 'deviceForm',
        clickOutsideToClose: true,
        data: {
          device: angular.copy(device),
        }
      });
    }

    function showFormJson(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: rootTemplatePath + '/device/formJson/deviceFormJson.view.html',
        controller: 'deviceFormJsonCtrl',
        controllerAs: 'deviceFormJson',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function remove(employee, event) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + employee.first_name + " " + employee.last_name + ' employee?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(() => {
        User.remove(employee.id).then((data) => {
          if (data) {
            let toRemove = _.findWhere(vm.users, { id: employee.id });
            vm.users = _.without(vm.users, toRemove);
            _updateTablePagination(vm.users);
          }
        });
      });
    }

    function multipleRemove() {}

    function toggleFilters() {
      vm.showFilters = !vm.showFilters;
    }

    function filterUsers(filteringType) {
      vm.users = filterService.filter(
        vm.users,
        vm.usersCopy,
        vm.filters,
        filteringType);
      vm.table.total = vm.users.length;
    }

    function resetFilters() {
      angular.forEach(vm.filters, (item, key) => { vm.filters[key] = []; });
      filterUsers();
    }

    function querySearch(query, list) {
      if (query != "" && query != " ") {
        vm.table.total = autocompleteService.querySearch(query, list).length;
      } else {
        vm.table.total = list.length;
      }
      return autocompleteService.querySearch(query, list);
    }

    function _updateTablePagination(data) {
      vm.table.total = data.length;
    }

    function _getResources() {
      let promises = [];

      promises.push(Project.getAll());
      promises.push(Technology.getAll());
      promises.push(User.getAll());
      promises.push(User.getLanguages());
      promises.push(AppType.getAll());

      $q.all(promises).then((data) => {

        vm.resources.projects = data[0];
        vm.resources.technologies = data[1];
        vm.resources.users = data[2];
        vm.resources.languages = data[3];

        //will use this for filters
        vm.users = vm.resources.users;
        vm.usersCopy = angular.copy(vm.resources.users); //[1]
        vm.table.total = vm.resources.users.length;

        _buildAutocompleteLists();
      });
    }

    function _buildAutocompleteLists() {

      autocompleteService.buildList(vm.resources.projects, ['name']);
      autocompleteService.buildList(vm.resources.technologies, ['name']);
      autocompleteService.buildList(vm.resources.languages, ['long_name']);
      autocompleteService.buildList(vm.resources.users, ['first_name', 'last_name']);
    }

  }

})(_);
