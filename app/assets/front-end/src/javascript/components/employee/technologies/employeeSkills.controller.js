(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @employeeSkillsController
  // ------------------------------------------------------------------------

  angular
    .module('HRA')
    .controller('employeeSkillsController', employeeSkillsController);

  employeeSkillsController
    .$inject = ['$rootScope', '$scope', '$stateParams', 'autocompleteService', 'miscellaneousService', 'User'];





  function employeeSkillsController($rootScope, $scope, $stateParams, autocompleteService, miscellaneousService, User) {


    // ----------------------------------------------------------------------
    // VARIABLES
    // ----------------------------------------------------------------------

    var vm = this;
    vm.disabledSkills = true;
    vm.skillLevel = [];
    vm.increment = [];
    vm.skillLevels = ["Junior", "Junior-Mid", "Mid", "Mid-Senior", "Senior"];
    vm.skillTypes = ["Main", "Secondary"];
    vm.searchSkill = [];
    vm.selectedSkillLevel = [];
    vm.skillType = [];
    vm.copyCat = [];
    vm.selectedSkillTypess = [];




    // ----------------------------------------------------------------------
    // INVOKING PRIVATE METHODS
    // ----------------------------------------------------------------------

    var getEmployee = $rootScope.$on('event:employeeIsLoaded', function(event, employee) {
      vm.employee = employee;
    });

    $rootScope.$on('event:employeeResourcesLoaded', function(event, employeeResources) {
      
      if (employeeResources.skills) {
        setAllSkills(employeeResources.skills);
      }
    });

    $scope.$on('$destroy', function() {
      getEmployee();
    });




    // ----------------------------------------------------------------------
    // EXPOSED PUBLIC METHODS
    // ----------------------------------------------------------------------

    vm.selectedSkill = selectedSkill;
    vm.addNewSkill = addNewSkill;
    vm.changeView = changeView;
    vm.querySearch = querySearch;
    vm.addSkill = addSkill;
    vm.removeSkill = removeSkill;
    vm.saveEmployee = saveEmployee;
    vm.selectedSkillType = selectedSkillType;
    vm.skillFilter = skillFilter;
    vm.cancelAdd = cancelAdd;
    vm.toggleCard = toggleCard;


_getUserTechnologies();


    // ----------------------------------------------------------------------
    // PUBLIC METHODS DECLARATION
    // ----------------------------------------------------------------------

    function _getUserTechnologies(){
        User.getTechnologies()
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    function toggleCard(event, action) {
      // debugger;
      var card = angular
        .element(event.currentTarget)
        .closest('.js-employee-card');

      $rootScope.$emit("event:toggleCard", card, action);

    }


    function querySearch(query) {
      return autocompleteService.querySearch(query, vm.allSkills);
    }

    function addSkill(item, employee, index) {
      var skillIndex = '';
      if (item) {
        skillIndex = miscellaneousService.getItemIndex(vm.allSkills, item.id);
        vm.allSkills.splice(skillIndex, 1);
        vm.increment[index] = item;
      } else {
        return;
      }
    }

    function removeSkill(index, item, employee) {
      vm.increment.splice(index, 1);
      vm.selectedSkillTypess.splice(index, 1);
      vm.selectedSkillLevel.splice(index, 1);
      vm.searchSkill.length = 0;
      for (var i = 0; i < vm.increment.length; i++) {
        vm.searchSkill[i] = vm.increment[i] ? vm.increment[i].label : '';
      }
    }

    function saveEmployee(employee) {
      fill(employee);
      vm.disabledSkills = true;
      vm.copyCat = angular.copy(vm.increment);
      $rootScope.$emit("callSaveMethodCards", employee);
      // getSkills();
      updateSkills();
    }

    function changeView() {
      vm.disabledSkills = false;
      updateSkills();
    }

    function addNewSkill() {
      vm.increment.push({});
      vm.selectedSkillTypess.push('Main');
    }

    function selectedSkill(data, employee, index) {
      if (data !== undefined) {
        vm.skillLevel[index] = data;
        return data;
      } else {
        return "Skill level";
      }
    }

    function selectedSkillType(data, employee, index) {
      if (data !== undefined) {
        vm.skillType[index] = data;
        return data;
      } else {
        return "Skill type";
      }
    }

    function skillFilter(item) {
      return vm.selectedSkillTypess === "Main";
    }

    function cancelAdd() {
      vm.disabledSkills = true;
      for (var i = vm.copyCat.length; i < vm.increment.length; i++) {
        vm.selectedSkillLevel[i] = "Please select your level";
        vm.selectedSkillTypess[i] = "Please select a type";
        vm.searchSkill[i] = "";
      }
      vm.increment = _.initial(vm.increment, vm.increment.length - vm.copyCat.length);
    }





    // ----------------------------------------------------------------------
    // PRIVATE METHODS DECLARATION
    // ----------------------------------------------------------------------

    function fill(employee) {
      vm.employee.skills = vm.increment;
      vm.employee.skillsLevel = vm.selectedSkillLevel;
      vm.employee.skillsType = vm.skillType;
      vm.employee.equipments = vm.employee.equipments;
      employee.skills = vm.employee.skills;
      employee.skillsLevel = vm.employee.skillsLevel;
      employee.skillsType = vm.employee.skillsType;
      employee = vm.employee;
      return employee;
    }

    function setAllSkills(skills) {
      vm.allSkills = skills;
      updateSkills();
      updateAutocompleteSkills(vm.allSkills);
      return autocompleteService.buildList(vm.allSkills, ['name']);
    }

    function updateAutocompleteSkills(allSkills) {
      var index = 0;
      var indexSkillToRemove = '';
      for (index; index < vm.employee.skills.length; index++) {
        indexSkillToRemove = miscellaneousService.getItemIndex(allSkills, vm.employee.skills[index].id);
        allSkills.splice(indexSkillToRemove, 1);
      }
    }

    function updateSkills() {
      vm.text = [];
      if (vm.employee.skills !== null && vm.employee.skills !== undefined && vm.employee.skills !== '' && vm.employee.skillsType !== null) {
        vm.increment = [];
        vm.increment = vm.employee.skills;
        vm.copyCat = angular.copy(vm.increment);
        for (var i = 0; i < vm.increment.length; i++) {
          vm.searchSkill[i] = vm.increment[i] ? vm.increment[i].label : '';
          vm.selectedSkillLevel[i] = vm.employee.skillsLevel[i] ? parseInt(vm.employee.skillsLevel[i], 10) : '';
          vm.selectedSkillTypess[i] = vm.employee.skillsType[i] ? vm.employee.skillsType[i] : '';
          vm.text[i] = getleveltext(vm.selectedSkillLevel[i].toString());
        }
      } else {}
    }

    function getleveltext(data) {
      switch (data) {
        case '1':
          return "Junior";
          break;
        case '2':
          return "Junior";
          break;
        case '3':
          return "Junior-Mid";
          break;
        case '4':
          return "Junior-Mid";
          break;
        case '5':
          return "Mid";
          break;
        case '6':
          return "Mid";
          break;
        case '7':
          return "Mid-Senior";
          break;
        case '8':
          return "Mid-Senior";
          break;
        case '9':
          return "Senior";
          break;
        case '10':
          return "Senior";
          break;
        default:
          return "Please select your experience level";
      }
    }

  }

}());
