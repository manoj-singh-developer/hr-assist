((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('employeeSkillsController', employeeSkillsController);

  function employeeSkillsController($rootScope, autocompleteService, User, $stateParams, $scope) {

    let vm = this;
    let technologiesToAdd = [];
    let technologiesToRemove = [];
    vm.user = {};
    vm.technologies = [];
    vm.userTechnologies = [];
    vm.displayOrHide = false;
    vm.skillLvlTxt = [];
    vm.replaceInputs = [1];
    vm.showDelete = false;

    vm.queryTechnologySearch = queryTechnologySearch;
    vm.addNewTechnologie = addNewTechnologie;
    vm.saveTechnologies = saveTechnologies;
    vm._getUserTech = _getUserTech;
    vm.getLvlTxt = getLvlTxt;
    vm.deleteTechQuery = deleteTechQuery;
    vm.deleteTechnologies = deleteTechnologies;

    _getUserTech();

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.technologies = data.technologies;

      autocompleteService.buildList(vm.technologies, ['name']);
    });


    function addNewTechnologie() {
      vm.replaceInputs.push({});
    }

    function queryTechnologySearch(query){
      return autocompleteService.querySearch(query, vm.technologies);
    }

    function saveTechnologies() {
      let techName = [];
      let techTypes = [];
      let techLvl = [];
      let userID = $stateParams.id;

      let techNameArr = $.map(vm.searchText, (value, index) => {
        return [value];
      });

      let techTypesArr = $.map(vm.selectedSkillTypes, (value, index) => {
        return [value];
      });

      let techLvlArr = $.map(vm.selectedSkillLevel, (value, index) => {
        return [value];
      })

      for(var i = 0; i < techNameArr.length; i++) {
        techName.push(techNameArr[i]);
      }

      for(var x = 0; x < techTypesArr.length; x++) {
        techTypes.push(techTypesArr[x]);
      }

      for(var y = 0; y < techLvlArr.length; y++) {
        techLvl.push(techLvlArr[y]);
      }

      let objToSave = {
        names: techName,
        types: techTypes,
        levels: techLvl,
        user_id: userID
      };



      User.addUserTechnologies(objToSave)
        .then((response) => {
          vm.displayOrHide = false;
          vm.technologiesToAdd = [1];
          _getUserTech();

          vm.searchText = '';
          vm.selectedSkillTypes = '';
          vm.selectedSkillLevel = '';
      })
      .catch((error) => {
        console.log(error);
      })
    }

    function deleteTechQuery(technology) {

      let techId = technology.id;
      let userId = $stateParams.id;

      let delObj = {
        technology_ids: technology.id,
        user_id: userId
      };

      let toRemove = _.findWhere(vm.userTechnologies, { id: technology.id });
      vm.userTechnologies = _.without(vm.userTechnologies, toRemove);
      technologiesToAdd = _.without(technologiesToAdd, toRemove);
      technologiesToRemove.push(technology);

      if(technologiesToRemove.length > 0) {
        vm.showDelete = true;
      }
    }

    function deleteTechnologies() {
      User.deleteUserTechnologies(technologiesToRemove)
        .then((response) => {
          vm.showDelete = false;
          vm.displayOrHide = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function _getUserTech(){
      User.getTechnologies()
        .then((response) => {
          vm.userTechnologies = response;

          for(var j = 0; j< vm.userTechnologies.length; j++){
            vm.skillLvlTxt.push(getLvlTxt(vm.userTechnologies[j].level));

            vm.userTechnologies[j].level = _.assign(vm.skillLvlTxt[j], vm.userTechnologies[j].level);
          }

        })
        .catch((error) => {
          console.log(error);
        });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    };

    vm.cancelSave = () => {
      vm.displayOrHide = false;
      vm.showDelete = false;
      technologiesToRemove = [];
      vm.userTechnologies = [];
      _getUserTech();
    };

    function getLvlTxt(data) {
      switch (data) {
        case 1:
          return "Junior";
          break;
        case 2:
          return "Junior";
          break;
        case 3:
          return "Junior-Mid";
          break;
        case 4:
          return "Junior-Mid";
          break;
        case 5:
          return "Mid";
          break;
        case 6:
          return "Mid";
          break;
        case 7:
          return "Mid-Senior";
          break;
        case 8:
          return "Mid-Senior";
          break;
        case 9:
          return "Senior";
          break;
        case 10:
          return "Senior";
          break;
        default:
          return "Please select your experience level";
      }
    }

  }

})(_);
