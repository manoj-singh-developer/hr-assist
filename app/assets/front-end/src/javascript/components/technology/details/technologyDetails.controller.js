(() => {

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
    vm.usersTech;
    vm.projectsTech;

    _getTechnologyById(technologyId);
    _getEmployees(technologyId);
    _getProjects(technologyId);


    function _getTechnologyById(id) {
      Technology.getById(id).then(data => vm.technology = data);
    }

    function _getEmployees(id) {
      Technology.getEmployees(id)
        .then((data) => {
          vm.usersTech = data;
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

  }

})();
