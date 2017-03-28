(function() {

	'use strict';

	// allEquipmentsController controller
	// ------------------------------------------------------------------------
	angular
		.module('HRA')
		.controller('allEquipmentsController', allEquipmentsController);

	allEquipmentsController.$inject = ['autocompleteService', '$scope', '$mdDialog', '$rootScope', 'Equipments', 'Callback', '$mdToast'];

	function allEquipmentsController(autocompleteService, $scope, $mdDialog, $rootScope, Equipments, Callback, $mdToast) {
		var self = this;

		var listEquipments = [];
		var allName = [];
		self.ids = [];
		self.selected = [];
		self.selectedPag = [];
		self.table = {
			options: {
				rowSelection: true,
				multiSelect: true,
				autoSelect: true,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: true,
				limitSelect: true,
				pageSelect: true
			},
			query: {
				order: 'name',
				filter: '',
				limit: 10,
				page: 1
			},
			"limitOptions": [10, 15, 20],
			selected: []
		};

		getEquipments();



		// Public methods
		// ------------------------------------------------------------------------

		self.showAddForm = showAddForm;
		self.remove = remove;
		self.editRow = editRow;
		self.querySearch = querySearch;
		self.multipleDelete = multipleDelete;
		self.getPagination = getPagination;
		self.addFromJson = addFromJson;



		// Public methods declaration
		// ------------------------------------------------------------------------
		function getEquipments() {
			Equipments.list()
				.then(function(res) {
					self.equipmentsList = res;
					return autocompleteService.buildList(self.equipmentsList, ['name']);
				}, function(err) {
					Callback.error();
				});
		};

		function showAddForm(data) {
			$mdDialog
				.show({
					templateUrl: rootTemplatePath + '/components/equipments/views/equipmentsAdd.html',
					controller: 'equipmentsAdd',
					clickOutsideToClose: true,
					data: {}
				});
		}

		$rootScope.$on('eqAdd', function(event, data) {
			self.equipmentsList.push(data);
		});

		$rootScope.$on('eqReplace', function(event, data) {
			getEquipments();
		});

		$rootScope.$on('addlist', function(event, data) {
			self.equipmentsList = self.equipmentsList.concat(data);
		});

		function remove(id, ev, name) {
			var confirm = $mdDialog.confirm()
				.title('Would you like to delete ' + name + ' equipment?')
				.ariaLabel('Lucky day')
				.targetEvent(ev)
				.ok('Yes')
				.cancel('No');

			$mdDialog.show(confirm).then(function() {
				Equipments.remove({
						id: id
					})
					.then(function(res) {
						self.equipmentsList = _.without(self.equipmentsList, _.findWhere(self.equipmentsList, {
							id: id
						}));
						Callback.success('Your equipments was deleted');
					}, function(err) {
						Callback.error("Failed to delete this equipment!");
					});
			});
		};

		function editRow(id) {
			var myRow = self.equipmentsList.filter(function(item) {
				return item.id === id;
			})[0] || {};

			$mdDialog.show({
				templateUrl: rootTemplatePath + '/components/equipments/views/equipmentsAdd.html',
				controller: 'equipmentsAdd',
				clickOutsideToClose: true,
				data: {
					form: angular.copy(myRow),
				}
			});
		}

		function querySearch(query) {
			return autocompleteService.querySearch(query, self.equipmentsList);
		}

		function multipleDelete() {
			for (var i = 0; i < self.table.selected.length; i++) {
				self.ids.push(self.table.selected[i].id);
				self.equipmentsList = _.without(self.equipmentsList, _.findWhere(self.equipmentsList, {
					id: self.table.selected[i].id
				}));
			}
			Equipments.remove({
					id: self.ids
				})
				.then(function(res) {
					Callback.success("All equipments was deleted");
					self.table.selected = [];
				}, function(err) {
					Callback.error("Failed to delete !");
				});
		}

		self.query = {
			order: 'name',
			limit: 5,
			page: 1
		}

		function success(pagination) {
			self.pagination = pagination;
		}

		function getPagination() {
			self.promise = self.equipmentsList(self.query, success).$promise;
		};

		function addFromJson(event) {
			event.stopPropagation();

			$mdDialog.show({
				parent: angular.element(document.body),
				templateUrl: rootTemplatePath + '/components/equipments/views/equipmentsFromJson.html',
				controller: 'equipmentsAddFromJson',
				targetEvent: event,
				clickOutsideToClose: true,
			});
		}

		return ($scope.listEq = self);
	}
}());
