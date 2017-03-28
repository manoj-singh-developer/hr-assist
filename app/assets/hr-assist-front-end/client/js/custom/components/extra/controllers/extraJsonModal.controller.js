 (function() {

   'use strict';

   // employeesCreateModal controller
   // ------------------------------------------------------------------------
   angular
     .module('HRA')
     .controller('extraJsonModal', extraJsonModal);

   extraJsonModal
     .$inject = ['$mdDialog', '$rootScope', 'ExtraModel', 'data'];

   function extraJsonModal($mdDialog, $rootScope, ExtraModel, data) {

     var vm = this;



     // Public methods
     // ------------------------------------------------------------------------
     vm.saveFromJson = saveFromJson;
     vm.clearFields = clearFields;
     vm.closeDialog = closeDialog;



     // Public methods declaration
     // ------------------------------------------------------------------------
     function saveFromJson(json) {
       if (json) {
         json = angular.fromJson(json);

         ExtraModel.savefromJson(json, data.extraType).then(
           function(data) {
             $rootScope.$broadcast('employeesListChanged', ['saveFromJson', data]);
             $rootScope.showToast('Successfully added employees from json!');
           },
           function(error) {});
       } else {
         console.log('Empty json!');
       }
     }

     function clearFields() {
       vm.json = '';
     }

     function closeDialog() {
       $mdDialog.cancel();
     }

   }

 })();
