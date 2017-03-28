(function() {

	'use strict';

	// extraForm Directive
	// ------------------------------------------------------------------------
	angular
		.module('HRA')
		.directive('hraExtraForm', formDirective);

	formDirective
		.$inject = [];

	function formDirective() {
		return {
			restrict: 'EA',
			controller: 'extraFormCtrl',
			controllerAs: 'extraForm',
			templateUrl: rootTemplatePath + '/components/extra/views/extraForm.view.html'
		};
	}

}());
