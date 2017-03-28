(function() {

  'use strict';



  // skillsCreateModal controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('skillJsonM', skillJsonM);

  skillJsonM
    .$inject = ['$mdDialog', 'skillModel', '$http', '$rootScope'];

  function skillJsonM($mdDialog, skillModel, $http, $rootScope) {

    var url = "/js/custom/_common/data/skills.json";

    var vm = this;
    var raw = [];



    // public methods
    // ------------------------------------------------------------------------
    vm.saveFromJson = saveFromJson;
    vm.clearFields = clearFields;
    vm.closeDialog = closeDialog;



    // private methods
    // ------------------------------------------------------------------------
    function saveFromKnownFile() {
      $http.get(url).success(function(data, status, headers, config) {
        raw = data;
      }).error(function(data, status, headers, config) {});
    }
    saveFromKnownFile();



    // public methods declaration
    // ------------------------------------------------------------------------
    function saveFromJson(json) {
      json = angular.fromJson(json != undefined ? json : raw);
      skillModel.saveJsons(json).then(
        function(data) {
          $rootScope.$emit("json", data);
        },
        function(error) {});
    }

    function clearFields() {
      vm.json = '';
    }

    function closeDialog() {
      $mdDialog.cancel();
    }
  }

})();