(function() {

	'use strict';


	//hraGeneralInfoProject directive
	//---------------------------------------------------------------

	angular
		.module('HRA')
		.directive('hraGeneralInfoProject', hraGeneralInfoProject);

	function hraGeneralInfoProject() {
		return {
			restrict: 'EA',
			scope: {},
			controller: 'projectGeneralInfoController',
			controllerAs: 'projectGeneralInfo',
			templateUrl: rootTemplatePath + '/components/project/views/projectGeneralInfo.view.html',
		};

	}



	// projectGeneralInfo Controller
	//------------------------------------------------------------

	angular
		.module('HRA')
		.controller('projectGeneralInfoController', projectGeneralInfoController);

	projectGeneralInfoController.$inject = ['$rootScope', '$scope'];

	function projectGeneralInfoController($rootScope, $scope) {

		//get projects from details controller
		//--------------------------------------------------------------

		var vm = this;

		var getProjects = $rootScope.$on('projectIsLoadedEvent', function(event, project) {
			vm.project = project;
			vm.projectCpy = angular.copy(vm.project);
			vm.project.startDate = new Date(vm.project.startDate);
			vm.project.deadline = new Date(vm.project.deadline);

		});

		$scope.$on('$destroy', function() {
			getProjects();
		});



		// Public methods
		// ------------------------------------------------------------------------

		vm.saveProject = saveProject;
		vm.disabledgeneralInfo = true;
		vm.cancelAdd = cancelAdd;

		// Public methods declaration
		// ------------------------------------------------------------------------

		function saveProject(project) {
			$rootScope.$emit("callSaveMethodCardsProjects", project);
			vm.disabledgeneralInfo = true;
		}

		function cancelAdd() {
			vm.project.name = vm.projectCpy.name;
			vm.project.description = vm.projectCpy.description;
			vm.project.startDate = new Date(vm.projectCpy.startDate);
			vm.project.deadline = new Date(vm.projectCpy.deadline);
			vm.disabledgeneralInfo = true;
		}

	}

}());