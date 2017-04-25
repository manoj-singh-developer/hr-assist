((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('employeeSkillsController', employeeSkillsController);

  employeeSkillsController
    .$inject = ['$rootScope', 'autocompleteService', 'User', '$stateParams'];


  function employeeSkillsController($rootScope, autocompleteService, User, $stateParams) {

    let vm = this;
    let technologiesToAdd = [];
    vm.user = {};
    vm.technologies = [];
    vm.userTechnologies = [];
    vm.displayOrHide = false;
    vm.skillLvlTxt = [];


    vm.queryTechnologySearch = queryTechnologySearch;
    vm.addNewTechnologie = addNewTechnologie;
    vm.saveTechnologies = saveTechnologies;
    vm._getUserTech = _getUserTech;
    vm.getLvlTxt = getLvlTxt;
    vm.deleteTech = deleteTech;


    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.userTechnologies = data.userTechnologies;
      
      for(var j = 0; j< vm.userTechnologies.length; j++){
        vm.skillLvlTxt.push(getLvlTxt(vm.userTechnologies[j].level));

        vm.userTechnologies[j].level = _.assign(vm.skillLvlTxt[j], vm.userTechnologies[j].level);
      }


      vm.technologies = data.technologies;
      autocompleteService.buildList(vm.technologies, ['name']);
    });



    function addNewTechnologie() {
      
      if (!vm.technologiesToAdd) {
        vm.technologiesToAdd = [];
      }
      vm.technologiesToAdd.push({});
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


      if(objToSave.names.length < 1){
        vm.displayOrHide = false;
      } else {
         User.addUserTechnologies(objToSave)
        .then((response) => {
          vm.displayOrHide = false;
          _getUserTech();
        })
        .catch((error) => {
          console.log(error);
        })
      }
    }

    function deleteTech(technology) {
      let techId = technology.id;
      let userId = $stateParams.id;

      let delObj = {
        technology_ids: technology.id,
        user_id: userId
      }

      User.deleteUserTechnologies(delObj)
        .then((response) => {
         
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function _getUserTech(){
      User.getTechnologies()
        .then((response) => {
          vm.userTechnologies = response;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    vm.displayForm = () => {
      vm.displayOrHide = !vm.displayOrHide;
    }

    vm.cancelSave = () => {
      vm.displayOrHide = false;
    }

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
