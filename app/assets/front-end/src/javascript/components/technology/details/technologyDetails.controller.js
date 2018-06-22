((_) => {

  'use strict';

  angular
    .module('HRA')
    .controller('technologyDetailsCtrl', technologyDetailsCtrl);

  technologyDetailsCtrl
    .$inject = ['$scope', '$rootScope', '$stateParams', 'Technology'];

  function technologyDetailsCtrl($scope, $rootScope, $stateParams, Technology) {

    var vm = this;
    var technologyId = $stateParams.id;
    vm.technology = null;
    vm.skillLvlTxt = [];
    vm.usersTech;
    vm.projectsTech;

    vm.getLvlTxt = getLvlTxt;
    _getTechnologyById(technologyId);
    _getEmployees(technologyId);
    _getProjects(technologyId);


    function _getTechnologyById(id) {
      Technology.getById(id).then(data => vm.technology = data);
    }

    function _getEmployees(id) {
      Technology.getEmployees(id)
        .then((data) => {
          let techUsers = data;

          for(let i = 0; i < techUsers.length; i++){

            let promise = new Promise((resolve) => {
              resolve (getLvlTxt(techUsers[i].technology_level));
            });


            vm.skillLvlTxt = [];
            promise
              .then((response) => {
                vm.skillLvlTxt.push(response);
                for(var j = 0; j < techUsers.length; j++){
                  techUsers[j].technology_level = _.assign(vm.skillLvlTxt[j], techUsers[j].technology_level);
                }

                vm.usersTech = techUsers;
              });
          }

        })
        .catch((error) => {
          console.log(error);
        })
    }

    function _getProjects(id) {
      Technology.getProjects(id)
        .then((data) => {
          vm.projectsTech = data;
        })
        .catch((error) => {
          console.log(error);
        })
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
