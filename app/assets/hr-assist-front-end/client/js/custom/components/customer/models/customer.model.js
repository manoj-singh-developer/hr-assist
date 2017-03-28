(function() {

  'use strict';

  // customer Model
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .factory('customerModel', customerModel);

  customerModel
    .$inject = ['$resource', '$q', 'apiUrl'];

  function customerModel($resource, $q, apiUrl) {


    // Constructor
    // ------------------------------------------------------------------------
    function customerModel() {

    }
    var url = '';

    // angular.extend(Equipments.prototype, {
    //   getFullName: function() {
    //     return this.name + ' ' + this.description;
    //   }
    // });



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    customerModel.create = function(data) {
      return angular.extend(new customerModel(), data);
    };

    customerModel.getAllCustomers = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getAllCustomers().$promise.then(
          function(data) {
            raw = data;
            angular.forEach(raw, function(item, index) {
              processed.push(customerModel.create(item));
            });
            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    customerModel.save = function(data) {
      function promise(resolve, reject) {
        saveCustomer(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    customerModel.getFromApi = function() {
      var raw = [];
      var processed = [];
      // getAllIndustries();

      function promise(resolve, reject) {
        getIndustryFromApi().$promise.then(
          function(data) {
            raw = data.customers;
            //console.log(raw);
            angular.forEach(raw, function(item, index) {
              processed.push({
                name: item
              });
            });
            //removeIndustry();
            saveCustomer(processed);
            //console.log(processed);
            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    // Private methods
    // ------------------------------------------------------------------------

    function getAllCustomers() {
      url = apiUrl + "/customer";
      return $resource(url).query();
    }

    function saveCustomer(data) {
      url = apiUrl + "/customer";
      return $resource(url, data, {
        'save': {
          method: 'POST',
          isArray: true
        }
      }).save(data);
    }

    function getIndustryFromApi() {
      url = 'https://assist-software.net/api/technologiesandapplicationtypes';
      return $resource(url).get();
    }

    function removeCustomer(customer) {
      url = apiUrl + "/customer";
      return $resource(url).delete(customer);
    }


    return customerModel;
  }
}());
