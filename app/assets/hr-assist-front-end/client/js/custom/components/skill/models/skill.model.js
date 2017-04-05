(function() {

  'use strict';



  // skillModel
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .factory('skillModel', skillModel);

  skillModel
    .$inject = ['$resource', '$q', 'apiUrl', '$state', '$http'];

  function skillModel($resource, $q, apiUrl, $state, $http) {



    // Constructor
    // ------------------------------------------------------------------------
    function Skill() {}
    var url = '';



    //Private methods
    // ------------------------------------------------------------------------

    function getAllSkills() {
      url = apiUrl + "/technologies";

      var item = $resource(url).get();
      return item.$promise;
    }

    function getSkillById(id) {
      url = apiUrl + "/technologies/" + id;

      var item = $resource(url).get();
      return item.$promise;
    }

    function saveSkill(data) {
      url = apiUrl + "/technologies/new";
      return $resource(url).save(data);
    }

    function updateSkill(data) {
      url = apiUrl + "/technologies/" + data.id;

      return $http.put(url, data);
    }

    function saveJson(data) {
      url = apiUrl + "/technologies";
      return $resource(url,
        data, {
          'save': {
            method: 'POST',
            isArray: true
          }
        }).save(data);
    }

    function removeSkill(skillToRemove) {

        var techId = skillToRemove.id;
        url = apiUrl + "/technologies/" + techId;

        return $resource(url).delete();
    }

    function getUsersSkills(){
        url = apiUrl + '/users?with[]=technologies';

        var item = $resource(url).get();
        return item.$promise;
    }



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Skill.create = function(data) {
      return angular.extend(new Skill(), data);
    };

    Skill.getAll = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getAllSkills().then(
          function(data) {
            raw = data.items;
            angular.forEach(raw, function(item, index) {
              processed.push(Skill.create(item));
            });
            return resolve(processed);
          },
          function(error) {
            return reject('Something gone wrong!');
          });
      }
      return $q(promise);
    };

    Skill.getUsers = function () {
        var processed = [];
        function promise(resolve, reject){
            getUsersSkills()
                .then(function (response) {
                    var raw  = response.items;
                    angular.forEach(raw, function (item, index){
                        processed.push(item);
                    });
                    return resolve(processed)
                })
                .catch(function (error){
                    console.log(error);
                    return reject();
                })
        }

        return $q(promise);
    };

      Skill.getOneSkill = function (id) {
          var processed = [];
          function promise(resolve, reject){
              getSkillById(id)
                  .then(function (response) {
                      var raw  = response;
                      return resolve(raw)
                  })
                  .catch(function (error){
                      console.log(error);
                      return reject();
                  })
          }

          return $q(promise);
      };

    Skill.save = function(data) {
      function promise(resolve, reject) {
        saveSkill(data).$promise.then(
          function(data) {
            $state.reload();
            return resolve(data);
          },
          function(error) {
            return reject(error);
          });
      }
      return $q(promise);
    };

    Skill.saveJsons = function(data) {
      function promise(resolve, reject) {
        saveJson(data).$promise.then(
          function(data) {
            return resolve(data);
          },
          function(err) {
            return reject(err);
          });

      }
      return $q(promise);
    };

    Skill.update = function(data) {
      // data = data.map(function(item) {
      //   return item.id;
      // });

      function promise(resolve, reject) {
        updateSkill(data).then(
          function(data) {
            resolve('The skill has been updated!');
          },
          function(error) {
            return reject(error);
          });
      }
      return $q(promise);
    }

    Skill.remove = function(id) {
      function promise(resolve, reject) {
        removeSkill(id).$promise.then(
          function(id) {
            return resolve('The skill has been deleted!');
          },
          function(error) {
            return reject('Something gone wrong!')
          });
      }
      return $q(promise);
    }

    return Skill;
  }
}());
