(function() {

  'use strict';

  // extraFormCtrl Controller
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .controller('extraFormCtrl', extraFormCtrl);

  extraFormCtrl
    .$inject = ['$scope', 'ExtraModel', '$mdToast', '$mdDialog', '$rootScope', 'data'];

  function extraFormCtrl($scope, ExtraModel, $mdToast, $mdDialog, $rootScope, data) {


    var vm = this;
    var extraType = data.extraType;
    vm.extratype = data.extraType;
    vm.extra = data.extra || {};
    vm.extra1 = {};


    // Public methods
    // ------------------------------------------------------------------------
    vm.saveButton = saveButton;
    vm.closeButton = closeButton;
    vm.clearButton = clearButton;



    // Public methods declaration
    // ------------------------------------------------------------------------
    function saveButton() {
      if (data.id) {
        vm.extra = updateExtra();
      } else {
        vm.extra = addExtra();
      }

    }

    function closeButton() {
      $mdDialog.cancel();
    }

    function clearButton() {
      vm.extra = {};
    }



    // Private methods
    // ------------------------------------------------------------------------
    function addExtra() {
      vm.extra1 = vm.extra;
      console.log(vm.extra1)
      ExtraModel.save(vm.extra, extraType).then(
        function(data) {
          onSaveSuccess('save', vm.extra1);
          $rootScope.showToast('Extra added');
        },
        function(error) {
          $rootScope.showToast('Error on adding a new extra');
          onSaveError(error);
        });
    }

    function updateExtra() {
      ExtraModel.update(vm.extra, extraType).then(
        function(data) {
          $rootScope.$emit('upSkill', data);
          $rootScope.showToast('Skill updated');
          $mdDialog.cancel();
        },
        function(error) {
          $rootScope.showToast('Error on updating skill');
        });
    }

    function onSaveSuccess(action, project) {
      // vm.btnIsDisabled = false;
      // vm.serverErrors = false;
      $scope.extraform.$setUntouched();
      $rootScope.$broadcast('event:extraListChanged', [action, project]);
    }

    function onSaveError(message) {
      vm.btnIsDisabled = false;
      vm.serverErrors = true;
      vm.serverErrorsArray = message;
    }

  }
}());
