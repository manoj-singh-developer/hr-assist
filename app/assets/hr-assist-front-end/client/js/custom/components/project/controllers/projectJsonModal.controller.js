 // ------------------------------------------------------------------------
 angular
   .module('HRA')
   .controller('projectJsonModal', projectJsonModal);

 projectJsonModal
   .$inject = ['$mdDialog', '$rootScope', 'ProjectModel'];

 function projectJsonModal($mdDialog, $rootScope, ProjectModel) {

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

       ProjectModel.savefromJson(json).then(
         function(data) {
           $rootScope.$broadcast('projectsListChanged', ['saveFromJson', data]);
           $rootScope.showToast('Successfully added projects from json!');
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
