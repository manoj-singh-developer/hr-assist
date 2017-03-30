(function() {

  'use strict';


  // industriesModel
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .factory('Industries', industriesModel);

  industriesModel
    .$inject = ['$resource', '$q', 'apiUrl'];

  function industriesModel($resource, $q, apiUrl) {


    // Constructor
    // ------------------------------------------------------------------------
    function Industries() {

    }
    var url = '';

    // angular.extend(Equipments.prototype, {
    //   getFullName: function() {
    //     return this.name + ' ' + this.description;
    //   }
    // });



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Industries.create = function(data) {
      return angular.extend(new Industries(), data);
    };

    Industries.getAllIndustries = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getAllIndustries().then(
          function(data) {
            raw = data.items;
            angular.forEach(raw, function(item, index) {
              processed.push(Industries.create(item));
            });
            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    Industries.save = function(data) {
      function promise(resolve, reject) {
        saveIndustry(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }

      return $q(promise);
    };

    Industries.getFromApi = function() {
      var raw = [];
      var processed = [];
      // getAllIndustries();

      function promise(resolve, reject) {
        getIndustryFromApi().$promise.then(
          function(data) {
            //console.log("data ", data);
            raw = data.industries;
            //console.log(raw);
            angular.forEach(raw, function(item, index) {
              processed.push({
                name: item
              });
            });
            //removeIndustry();
            saveIndustry(processed);
            //console.log(processed);
            return resolve(processed);
          },
          function(error) {
            console.log(error.status);
            return reject('Something gone wrong!');
          });
      }

      return $q(promise);
    };

    // Private methods
    // ------------------------------------------------------------------------

    function getAllIndustries() {
      url = apiUrl + "/industries";

      var item = $resource(url).get();
      return item.$promise;
    }

    function saveIndustry(data) {
      url = apiUrl + "/industries";
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

    function removeIndustry(industry) {
      url = apiUrl + "/industries";
      return $resource(url).delete(industry);
    }


    return Industries;
  }
}());
