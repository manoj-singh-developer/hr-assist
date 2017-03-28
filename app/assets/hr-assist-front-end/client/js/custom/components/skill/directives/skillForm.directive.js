(function() {

	'use strict';



	// skillsForm Directive
	// ------------------------------------------------------------------------
	angular
		.module('HRA')
		.directive('skillsForm', formDirective);

	formDirective
		.$inject = [];

	function formDirective() {
		return {
			restrict: 'EA',
			controller: 'skillForm',
			templateUrl: rootTemplatePath + '/components/skill/views/skillForm.view.html'
		};
	}



	// skillForm Controller
	// ------------------------------------------------------------------------
	angular
		.module('HRA')
		.controller('skillForm', skillForm);

	skillForm
		.$inject = ['$scope', 'skillModel', '$mdToast', '$mdDialog', '$rootScope', 'data'];

	function skillForm($scope, skillModel, $mdToast, $mdDialog, $rootScope, data) {

		var vm = this;
		vm.skill = data.skill || {};



		// public methods
		// ------------------------------------------------------------------------
		vm.saveButton = saveButton;
		vm.closeButton = closeButton;
		vm.clearButton = clearButton;



		// private methods
		// ------------------------------------------------------------------------

		var addSkill = function() {
			skillModel.save(vm.skill).then(
				function(res) {
					$rootScope.$emit('newSkill', res);
					$rootScope.showToast('A new skill has been added');
					$mdDialog.cancel();
				},
				function(err) {
					$rootScope.showToast('Error on adding a new skill!');
				});
		}

		var updateSkill = function() {
			skillModel.update(vm.skill).then(
				function(res) {
					$rootScope.$emit('upSkill', res);
					$rootScope.showToast('Skill updated');
					$mdDialog.cancel();
				},
				function(err) {
					$rootScope.showToast('Error on updating skill');
				});
		}



		// public methods declaration
		// ------------------------------------------------------------------------
		function saveButton() {
			vm.skill == data.skill ? updateSkill() : addSkill();
		}

		function closeButton() {
			$mdDialog.cancel();
		}

		function clearButton() {
			vm.skill = {};
		}


		return ($scope.as = vm);

	}
}());
