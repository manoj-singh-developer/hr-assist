(function() {

  'use strict';


  // equipmentsAddFromJson controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('equipmentsAddFromJson', equipmentsAddFromJson);

  equipmentsAddFromJson.$inject = ['Equipments', '$scope', '$rootScope', 'Callback', '$mdDialog'];

  function equipmentsAddFromJson(Equipments, $scope, $rootScope, Callback, $mdDialog) {
    var self = this;

    // Public methods
    // ------------------------------------------------------------------------
    self.saveFromJson = saveFromJson;
    self.clearFields = clearFields;
    self.closeDialog = closeDialog;



    // Public methods declaration
    // ------------------------------------------------------------------------
    function saveFromJson(info) {
      var json = angular.fromJson(info);
      Equipments.saveJson(json).then(function(data) {
        $mdDialog.cancel();
        Callback.success('Your equipments from Json was added with success!');
        $rootScope.$emit('addlist', data);
      }, function(err) {});
    }

    function clearFields() {
      self.json = '';
    }

    function closeDialog() {
      $mdDialog.cancel();
    }

    return ($scope.addJson = self);
  }
})();