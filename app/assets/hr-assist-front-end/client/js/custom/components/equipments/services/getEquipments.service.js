(function() {

	'use strict';

	function listEquipmentsFactory() {

		return {
			getByParam: function(info) {
				return $http
					.post(url, data)

			}
		};
	}

	listEquipmentsFactory.$inject = ['$http', '$resource'];

	angular
		.module('HRA')
		.factory('listDetailsEquipments', listEquipmentsFactory)

})();
