(function () {

	'use strict';

	//hraTechnology Project directive
	//------------------------------------------------------------------

	angular
		.module('HRA')
		.directive('hraTechnologyProject', hraTechnologyProject);

	function hraTechnologyProject() {
		return {
			restrict: 'EA',
			scope: {},
			controller: 'projectTechnologyController',
			controllerAs: 'projectTechnology',
			templateUrl: rootTemplatePath + '/components/project/views/projectTechnology.view.html'
		};
	}

	//hraTechnology Projects Controller
	//--------------------------------------------------------------------

	angular
		.module('HRA')
		.controller('projectTechnologyController', projectTechnologyController);

	projectTechnologyController.$inject = ['skillModel', 'autocompleteService', '$rootScope', '$scope'];

	function projectTechnologyController(skillModel, autocompleteService, $rootScope, $scope) {

		var vm = this;
		vm.disableITechnologyCard = true;

		// Public methods
		//--------------------------------------------------------------

		vm.removeTechnology = removeTechnology;
		vm.addTechnology = addTechnology;
		vm.technologySearch = technologySearch;
		vm.saveProject = saveProject;



		//Private methods
		//---------------------------------------------------------------

		var getProjects = $rootScope.$on('projectIsLoadedEvent', function (event, project) {
			vm.project = project;
		});

		$scope.$on('$destroy', function () {
			getProjects();
		});

		getTechnologies();

		// Private methods declarations
		//-------------------------------------------------------------------

		function getTechnologies() {
			skillModel.getAll().then(
				function (res) {
					vm.skillList = res;
					autocompleteService.buildList(vm.skillList, ['name']);
				},
				function (res) {
					$rootScope.showToast('Error on loading data! Please refresh!');
				});
		}



		// Public methods declarations
		//-----------------------------------------------------------------

		function saveProject(project) {
			$rootScope.$emit("callSaveMethodCardsProjects", project);
			vm.disableITechnologyCard = true;
		}

		function removeTechnology(item, project, index) {
			console.log(index)
			vm.project.technologies.splice(index, 1);
		}

		function addTechnology(item, project) {
			var technologyIndex = '';

			if (item) {
				vm.project.technologies.push(item);
				vm.searchTech = "";
			}
			return;

		}

		function technologySearch(query) {
			return autocompleteService.querySearch(query, vm.skillList);
		}

	}

} ());