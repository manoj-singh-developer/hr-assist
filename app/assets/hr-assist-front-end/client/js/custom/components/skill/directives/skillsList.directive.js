(function () {

  'use strict';



  // viewSkills Directive
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .directive('viewSkills', viewDirective);

  viewDirective
    .$inject = [];

  function viewDirective() {
    return {
      restrict: 'EA',
      controller: 'viewController',
      templateUrl: rootTemplatePath + '/components/skill/views/skillList.view.html'
    };
  }



  // skillForm Controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('viewController', skillsCtrl);

  skillsCtrl
    .$inject = ['$scope', 'skillModel', '$mdToast', '$mdDialog', '$rootScope', 'autocompleteService', '$q', '$timeout', 'ProjectModel'];

  function skillsCtrl($scope, skillModel, $mdToast, $mdDialog, $rootScope, autocompleteService, $q, $timeout, ProjectModel) {

    var vm = this;
    vm.skillList = [];
    vm.viewList = [];
    vm.viewObject = [];
    vm.ids = [];
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



    // public methods
    // ------------------------------------------------------------------------
    vm.showAddForm = showAddForm;
    vm.showEditForm = showEditForm;
    vm.deleteConfirm = deleteConfirm;
    vm.querySearch = querySearch;
    vm.showJsonForm = showJsonForm;
    vm.multipleDelete = multipleDelete;
    vm.showApiForm = showApiForm;



    // public methods declaration
    // ------------------------------------------------------------------------
    function showAddForm(data, skill) {
      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/skill/views/skillForm.view.html',
        controller: 'skillForm',
        clickOutsideToClose: true,
        data: {
          skill: skill
        }
      });
    }

    function showJsonForm(event) {
      event.stopPropagation();

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'skillJson.tmpl.html',
        controller: 'skillJsonM as skillM',
        targetEvent: event,
        clickOutsideToClose: true,
      });
    }

    function deleteConfirm(skillName, id) {
      event.stopPropagation();

      var confirm = $mdDialog.confirm()
        .title('Delete the ' + skillName + ' skill ?')
        .targetEvent(event)
        .cancel('No')
        .ok('Yes');

      $mdDialog.show(confirm).then(
        function () {
          removeSkill(id);
        });
    }

    function showEditForm(id) {
      var editedSkill = vm.skillList.filter(function (item) {
        return item.id === id;
      })[0] || {};

      $mdDialog.show({
        templateUrl: rootTemplatePath + '/components/skill/views/skillForm.view.html',
        controller: 'skillForm',
        clickOutsideToClose: true,
        data: {
          skill: angular.copy(editedSkill),
        }
      });
    }

    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.skillList);
    }

    function showApiForm() {
      vm.temporary = [];
      var totalArray = [];
      vm.skillsApi = _.flatten(vm.skillsApi);
      vm.finalSkills = _.union(vm.skillsApi, vm.skillsList);

      for (var j = 0; j < vm.finalSkills.length; j++) {
        vm.temporary.push({
          name: vm.finalSkills[j].toLowerCase(),
          label: vm.finalSkills[j]
        });
      }

      var onlyInA = vm.temporary.filter(function (current) {
        return vm.skillList.filter(function (current_b) {
          return current_b.label == current.label && current_b.display == current.display
        }).length == 0
      });

      var onlyInB = vm.skillList.filter(function (current) {
        return vm.temporary.filter(function (current_a) {
          return current_a.label == current.label && current_a.display == current.display
        }).length == 0
      });

      totalArray = onlyInA.concat(onlyInB);
      if (totalArray.length !== 0)
        skillModel.saveJsons(totalArray).then(
          function (res) {
            vm.skillList = vm.skillList.concat(res);
          },
          function (err) {
            $rootScope.showToast('Error on adding a new skill!');
          });
    }



    // private methods
    // ------------------------------------------------------------------------
    function removeSkill(id) {

      skillModel.remove({
        id: id
      }).then(
        function (res) {
          vm.skillList = _.without(vm.skillList, _.findWhere(vm.skillList, {
            id: id
          }));
          $rootScope.showToast('Skill deleted');
        },
        function (err) {
          $rootScope.showToast('Error on deleting the skill!');
        });
    }

    function _getSkills() {
      skillModel.getAll().then(
        function (res) {
          vm.skillList = res;
          getProjects();
          return autocompleteService.buildList(vm.skillList, ['name']);
        },
        function (res) {
          $rootScope.showToast('Error on loading data! Please refresh!');
        });
    }

    function getProjects() {
      ProjectModel.getAll().then(
        function (data) {
          vm.projects = data;
          vm.skillsApi = [];
          vm.finalSkills = [];
          vm.temporary = [];
          for (var i = 0; i < vm.projects.length; i++) {
            vm.skillsApi.push(vm.projects[i].technologies);
          }


        },
        function (data) { });
    }

    function multipleDelete() {
      for (var i = 0; i < vm.table.selected.length; i++) {
        vm.ids.push(vm.table.selected[i].id);
        vm.skillList = _.without(vm.skillList, _.findWhere(vm.skillList, {
          id: vm.table.selected[i].id
        }));
      }
      removeSkill(vm.ids);
      vm.table.selected = [];
    }

    function init() {
      _getSkills();
    }

    $rootScope.$on('newSkill', function (event, data) {
      vm.skillList.push(data);
    });

    $rootScope.$on('json', function (event, data) {
      for (var i = 0; i < data.length; i++)
        vm.skillList.push(data[i]);
    });

    $rootScope.$on('upSkill', function (event, data) {
      _getSkills();
      vm.table.selected = [];
    });
    init();

    return ($scope.sk = vm);
  }
})();