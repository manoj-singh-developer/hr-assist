((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('employeeTechnologiesController', employeeTechnologiesController);

  function employeeTechnologiesController($rootScope, autocompleteService, User) {

    let vm = this;
    let technologiesToRemove = [];
    let userTechnologiesCopy = [];
    let objToSave = {};
    let objToUpdate = {};

    objToSave.technologies = [];
    objToUpdate.technologies = [];
    vm.user = {};
    vm.technologies = [];
    vm.userTechnologies = [];
    vm.showForm = false;
    vm.userNewTech = [{}];
    vm.disableSaveBtn = true;

    vm.addNewTechnologie = addNewTechnologie;
    vm.deleteTechQuery = deleteTechQuery;
    vm.save = save;
    vm.toggleForm = toggleForm;
    vm.cancel = cancel;
    vm.getLvlTxt = getLvlTxt;
    vm.excludeTechnology = excludeTechnology;

    _getUserTech();

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.technologies = data.technologies;
      autocompleteService.buildList(vm.technologies, ['name']);
    });

    function addNewTechnologie() {
      vm.userNewTech.push({});
    }

    function excludeTechnology(item) {
      vm.technologies = _.without(vm.technologies, item);
      _disableSaveBtn(false);
    }

    function deleteTechQuery(technology) {
      let toRemove = _.findWhere(vm.userTechnologies, { id: technology.id });
      vm.userTechnologies = _.without(vm.userTechnologies, toRemove);
      technologiesToRemove.push(technology);
      _disableSaveBtn(false);
    }

    function save() {

      if (vm.userNewTech) {
        for (let key in vm.userNewTech) {
          if (!vm.userNewTech[key].technology || vm.userNewTech[key].technology.length == 0) {
            delete vm.userNewTech[key];
          }
        }
      }

      _createObjectToSave();

      if (technologiesToRemove.length) {
        User.deleteUserTechnologies(technologiesToRemove)
          .then((response) => {
            technologiesToRemove = [];
            _getUserTech();
            $rootScope.$emit('technologiesUpdated', vm.userTechnologies);
          });
      }

      if (objToSave.names.length) {
        _saveTechnologies();
      }

      if (objToUpdate.technologies.length) {
        setTimeout(() => {
          _updateTechnologies();
        }, 300);
      }

      toggleForm();
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
      _disableSaveBtn(true);
    }

    function cancel() {
      vm.displayOrHide = false;
      vm.showDelete = false;
      technologiesToRemove = [];
      vm.searchText = '';
      vm.userTechnologies = userTechnologiesCopy.length > vm.userTechnologies.length ? userTechnologiesCopy : vm.userTechnologies;
      toggleForm();
    }

    function _createObjectToSave() {
      let newTechnologiesName = [];
      let newTechnologiesType = [];
      let newTechnologiesLvl = [];

      if (!vm.userNewTech.technology) {

        vm.userNewTech.forEach((element, index) => {
          newTechnologiesName.push(element.technology.name);
          newTechnologiesType.push(parseInt(element.type));
          newTechnologiesLvl.push(element.level);
        });

        objToSave = {
          names: newTechnologiesName,
          types: newTechnologiesType,
          levels: newTechnologiesLvl
        }

        for (let i = 0; i < objToSave.names.length; i++) {

          vm.userTechnologies.forEach((element, index) => {
            if (element.name === objToSave.names[i]) {

              //remove from object to save existing technologies
              objToSave.names.splice(i, 1);
              objToSave.types.splice(i, 1);
              objToSave.levels.splice(i, 1);

              // push into object to update existing technologies
              objToUpdate.technologies.push({
                name: vm.userNewTech[i].technology.name,
                id: vm.userNewTech[i].technology.id,
                level: vm.userNewTech[i].level,
                technology_type: parseInt(vm.userNewTech[i].type)
              });
            }

          });

        }

      }
    }

    function _saveTechnologies() {
      User.saveUserTechnologies(objToSave).then((response) => {
        vm.searchText = '';
        vm.userNewTech = [{}];
        objToSave = [];
        vm.userTechnologies = vm.userTechnologies.concat(response);
        $rootScope.$emit('technologiesUpdated', vm.userTechnologies);
      });
    }

    function _updateTechnologies() {
      User.updateUserTechnologies(objToUpdate).then((response) => {
        vm.searchText = '';
        vm.userNewTech = [{}];
        objToUpdate.technologies = [];
        vm.userTechnologies = response;
        $rootScope.$emit('technologiesUpdated', vm.userTechnologies);
      });
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

    function _getUserTech() {
      User.getTechnologies()
        .then((response) => {
          vm.userTechnologies = response;
          userTechnologiesCopy = response;
        });
    }

    function _disableSaveBtn(booleanValue) {
      vm.disableSaveBtn = !booleanValue ? booleanValue : true;
    }

  }

})(_);
