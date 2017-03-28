(function() {

  'use strict';



  // equipmentsAddController controller
  // ------------------------------------------------------------------------
  equipmentsAddController
    .$inject = ['Equipments', '$mdDialog', '$scope', '$http', '$rootScope', 'data', 'Callback'];

  angular
    .module('HRA')
    .controller('equipmentsAdd', equipmentsAddController);

  function equipmentsAddController(Equipments, $mdDialog, $scope, $http, $rootScope, data, Callback) {

    var self = this;
    self.form = data.form || {};
    self.rating = 0;



    // Public methods
    // ------------------------------------------------------------------------
    self.addEquipment = addEquipment;
    self.clear = clear;
    self.close = close;



    // Public methods declaration
    // ------------------------------------------------------------------------
    function addEquipment(id) {
      if (data.form !== undefined && data.form.id) {
        Equipments.update(self.form)
          .then(function(res) {
            Callback.success("Your equipment was updated with success!");
            $mdDialog.cancel();
            $rootScope.$emit('eqReplace', res);
          }, function(err) {
            Callback.error("Failed to update");
          });
      } else {
        Equipments.save(self.form)
          .then(function(res) {
            Callback.success('Your equipment was added with success!');
            self.form = {};
            $rootScope.$emit('eqAdd', res);
          }, function(err) {
            Callback.error("Failed to save");
          });
      }
    };

    function clear() {
      self.form = {};
    }

    function close() {
      $mdDialog.cancel();
    }

    return ($scope.addForm = self);
  }

})();
