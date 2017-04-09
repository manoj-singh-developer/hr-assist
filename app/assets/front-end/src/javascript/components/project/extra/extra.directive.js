(function() {

	'use strict';


	// projectIndustry, Type, Customer directive
	//--------------------------------------------------------------
	angular
		.module('HRA')
		.directive('hraIndustryProject', hraIndustryProject);

	function hraIndustryProject() {
		return {
			restrict: 'EA',
			scope: {},
			controller: 'projectIndustryController',
			controllerAs: 'projectIndustry',
			templateUrl: rootTemplatePath + '/project/views/projectTypeIndustryCustomer.view.html',
		};
	}



	// projectIndustry, Type, Customer controller
	//--------------------------------------------------------------
	angular
		.module('HRA')
		.controller('projectIndustryController', projectIndustryController);

	projectIndustryController.$inject = ['$rootScope', '$scope', 'miscellaneousService', 'autocompleteService', 'AppType', 'Industry', 'Customer'];

	function projectIndustryController($rootScope, $scope, miscellaneousService, autocompleteService, AppType, Industry, Customer) {

		var vm = this;
		vm.applicationTypes = [];
		vm.industries = [];
		vm.disableIndustryCard = true;


		// Public methods
		//--------------------------------------------------------------

		vm.addApp = addApp;
		vm.appSearch = appSearch;
		vm.removeApp = removeApp;
		vm.removeIndustry = removeIndustry;
		vm.addIndustry = addIndustry;
		vm.industrySearch = industrySearch;
		vm.removeCustomer = removeCustomer;
		vm.addCustomer = addCustomer;
		vm.customerSearch = customerSearch;
		vm.saveProject = saveProject;

		//Private methods
		//---------------------------------------------------------------

		var getProjects = $rootScope.$on('projectIsLoadedEvent', function(event, project) {
			vm.project = project;
		});

		$scope.$on('$destroy', function() {
			getProjects();
		});

		getAppData();
		getIndustries();
		getCustomers();


		// Private methods declarations
		//-------------------------------------------------------------------------

		function getAppData() {
			AppType.getAll().then(
				function(data) {
					vm.applicationTypes = data;
				},
				function(data) {
					console.log("err", data);
				});
		}

		function getIndustries() {
			Industry.getAll().then(function(data) {
				vm.industries = data;
				autocompleteService.buildList(vm.industries, ['name']);
			}, function(error) {});
		}

		function getCustomers() {
			Customer.getAll().then(function(data) {
				vm.customers = data;
				autocompleteService.buildList(vm.customers, ['name']);
			}, function(error) {});
		}



		// Public methods declarations
		//-------------------------------------------------------------------

		function saveProject(project) {
			$rootScope.$emit("callSaveMethodCardsProjects", project);
			vm.disableIndustryCard = true;
		}

		//ApplicationType functions
		function appSearch(query) {
			return autocompleteService.querySearch(query, vm.applicationTypes);
		}

		function addApp(item, project) {
			console.log("sec", item);

			if (item) {
				vm.project.applicationTypes.push(item);
				vm.searchApp = "";
			}

			return;

		}

		function removeApp(index, item, project) {
			console.log(index);
			vm.project.applicationTypes.splice(index, 1);
		}

		//Industry functions
		function removeIndustry(item, project, index) {
			vm.project.industries.splice(index, 1);
		}

		function addIndustry(index, item, project) {

			if (item) {
				vm.project.industries.push(item);
				vm.searchIndustry = "";
			}

			return;
		}

		function industrySearch(query) {
			return autocompleteService.querySearch(query, vm.industries);
		}

		//Customer functions
		function removeCustomer(item, project, index) {
			console.log(index);
			vm.project.customers.splice(index, 1);
		}

		function addCustomer(item, project) {

			var customerIndex = '';

			if (item) {

				vm.project.customers.push(item);
				vm.searchCustomer = "";
			}

			return;
		}

		function customerSearch(query) {
			return autocompleteService.querySearch(query, vm.customers);
		}

	}

}());
