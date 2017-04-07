(function() {

	'use strict';



	// equipmentDetailsController controller
	// ------------------------------------------------------------------------
	equipmentDetailsController.$inject = ['$scope', '$rootScope', '$stateParams', '$mdToast', 'Equipments', 'Callback'];

	angular
		.module('HRA')
		.controller('equipmentDetailsController', equipmentDetailsController);

	function equipmentDetailsController($scope, $rootScope, $stateParams, $mdToast, Equipments, Callback) {

		var self = this;
		var id = parseInt($stateParams.id, 10);



		// Public methods declaration
		// ------------------------------------------------------------------------
		Equipments.getEquipmentsById(id)
			.then(function(data) {
			self.equipmentInfo = data;
			}, function(err) {
				Callback.error();
			});


		Equipments.getEquipmentsEmployeeById(id)
			.then(function(data) {
			self.equipmentEmployeeInfo = data;
			}, function(err) {
				Callback.error();
			});


		return ($scope.detailsCtrl = self);
	}

}());