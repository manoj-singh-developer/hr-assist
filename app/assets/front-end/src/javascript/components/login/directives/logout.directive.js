(function () {
	'use strict';



// logout directive
// ------------------------------------------------------------------------
angular
	.module('HRA')
	.directive('hralogout', hralogout);

	function hralogout() {
		return {
			restrict: 'EA',
			scope: {},
			controller: 'logoutController',
			controllerAs: 'logoutCtrl',
			template: '<hralogin></hralogin>'
		};
	}



// logout controller
// ------------------------------------------------------------------------
angular
	.module('HRA')
	.controller('logoutController', logoutController);

	logoutController.$inject = ['tokenService'];

	function logoutController(tokenService) {
		tokenService.setTokens();
	}
})();
