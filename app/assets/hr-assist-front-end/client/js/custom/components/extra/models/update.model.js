(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('updateModel', updateModel);

  updateModel
    .$inject = ['$q', '$resource', 'skillModel', 'Equipments', 'apiUrl'];

    function updateModel($q, $resource, skillModel, Equipments, apiUrl) {
    	return $resource(apiUrl+'/:path/:id', null,
		{
    		'update': { method:'PUT' }
		});
    }
}());