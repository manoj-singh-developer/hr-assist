((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('employeeTechnologiesController', employeeTechnologiesController);

  function employeeTechnologiesController($rootScope, autocompleteService, User, $stateParams, $timeout, $scope) {

    let vm = this;
    let technologiesToAdd = [];
    let technologiesToRemove = [];
    vm.user = {};
    vm.technologies = [];
    vm.userTechnologies = [];
    vm.showForm = false;
    vm.skillLvlTxt = [];
    vm.replaceInputs = [{}];

    vm.addNewTechnologie = addNewTechnologie;
    vm.saveTechnologies = saveTechnologies;
    vm.deleteTechQuery = deleteTechQuery;
    vm.toggleForm = toggleForm;
    vm.cancel = cancel;

    _getUserTech();
    _validateForm();

    $rootScope.$on("event:userResourcesLoaded", (event, data) => {
      vm.user = data.user;
      vm.technologies = data.technologies;

      autocompleteService.buildList(vm.technologies, ['name']);
    });


    function addNewTechnologie() {
      vm.replaceInputs.push({});
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

      if (technologiesToRemove.length) {
        $timeout(() => {
          $scope.addTechForm.$invalid = false;
        }, 100);
      }
    }

    function saveTechnologies() {
      let techName = [];
      let techTypes = [];
      let techLvl = [];
      let userID = $stateParams.id;
      let userTechArr = vm.userTechnologies;

      let techNameArr = $.map(vm.searchText, (value, index) => {
        return [value];
      });

      let techTypesArr = $.map(vm.selectedSkillTypes, (value, index) => {
        return [value];
      });

      let techLvlArr = $.map(vm.selectedSkillLevel, (value, index) => {
        return [value];
      })

      for (let i = 0; i < techNameArr.length; i++) {
        techName.push(techNameArr[i]);
      }

      for (let x = 0; x < techTypesArr.length; x++) {
        techTypes.push(techTypesArr[x]);
      }

      for (let y = 0; y < techLvlArr.length; y++) {
        techLvl.push(techLvlArr[y]);
      }

      let objToSave = {
        names: techName,
        types: techTypes,
        levels: techLvl,
        user_id: userID
      };

      for (let i = 0; i < userTechArr.length; i++) {
        if (userTechArr[i].name === objToSave.names[0]) {
          User.deleteUserTechnologies([userTechArr[i]]);
        }
      }

      if (objToSave.names.length) {
        User.addUserTechnologies(objToSave)
          .then((response) => {
            vm.technologiesToAdd = [{}];
            vm.searchText = '';
            vm.selectedSkillTypes = '';
            vm.selectedSkillLevel = '';

            $timeout(() => {
              _getUserTech();
            });
          })
          .catch((error) => {
            console.log(error);
          })
      }

      if (technologiesToRemove.length) {
        User.deleteUserTechnologies(technologiesToRemove)
          .then((response) => {
            $timeout(() => {
              $scope.addTechForm.$invalid = true;
            }, 100);
            technologiesToRemove = [];
            _getUserTech();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      toggleForm();
    }

    function toggleForm() {
      vm.showForm = !vm.showForm;
    }

    function cancel() {
      vm.displayOrHide = false;
      vm.showDelete = false;
      technologiesToRemove = [];
      vm.userTechnologies = [];
      vm.searchText = '';
      vm.selectedSkillTypes = '';
      vm.selectedSkillLevel = '';
      $timeout(() => {
        _getUserTech();
      });
      toggleForm();
    };

    function _getLvlTxt(data) {
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
          let userTechnologies = response;

          for (let j = 0; j < userTechnologies.length; j++) {

            let promise = new Promise((resolve) => {
              resolve(_getLvlTxt(userTechnologies[j].level));
            });

            vm.skillLvlTxt = [];
            promise
              .then((response) => {
                vm.skillLvlTxt.push(response);
                for (let i = 0; i < userTechnologies.length; i++) {
                  userTechnologies[i].level = _.assign(vm.skillLvlTxt[i], userTechnologies[i].level);
                }

                vm.userTechnologies = userTechnologies;
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function _validateForm() {
      console.log(vm.searchText );
      $timeout(() => {
        $scope.addTechForm.$invalid = !vm.searchText ? false : true;
      }, 100);
    }

  }

})(_);
