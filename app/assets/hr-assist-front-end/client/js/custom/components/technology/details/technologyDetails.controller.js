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


    _getTechnologyById(technologyId);
    _getEmployees(technologyId);
    _getProjects(technologyId);


    function _getTechnologyById(id) {
      Technology.getById(id).then(data => vm.technology = data);
    }

    function _getEmployees() {
      // TODO: need a specific api url
    }

    function _getProjects() {
      // TODO: need a specific api url
    }

  }

})();
