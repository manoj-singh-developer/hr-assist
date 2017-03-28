(function() {

  'use strict';



  // skillModel
  // ------------------------------------------------------------------------
  angular
    .module('HRA')
    .factory('skillModel', skillModel);

  skillModel
    .$inject = ['$resource', '$q', 'apiUrl'];

  function skillModel($resource, $q, apiUrl) {



    // Constructor
    // ------------------------------------------------------------------------
    function Skill() {}
    var url = '';



    //Private methods
    // ------------------------------------------------------------------------

    function getAllSkills() {
      url = apiUrl + "/technologies";
      return $resource(url).query();
    }

    function getSkillById(id) {
      url = apiUrl + "/skill/" + id;
      return $resource(url).get();
    }

    function saveSkill(data) {
      url = apiUrl + "/skill";
      return $resource(url).save(data);
    }

    function updateSkill(skillToUpdate) {
      url = apiUrl + "/skill/" + skillToUpdate.id;
      return $resource(url,
        skillToUpdate, {
          'update': {
            method: 'PUT'
          }

        }).save();
    }

    function saveJson(data) {
      url = apiUrl + "/skill";
      return $resource(url,
        data, {
          'save': {
            method: 'POST',
            isArray: true
          }
        }).save(data);
    }

    function removeSkill(skillToRemove) {
      url = apiUrl + "/skill";
      return $resource(url).delete(skillToRemove);
    }



    // Static methods asigned to class
    // ------------------------------------------------------------------------
    Skill.create = function(data) {
      return angular.extend(new Skill(), data);
    }

    Skill.getAll = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getAllSkills().$promise.then(
          function(data) {
            raw = data;
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

    Skill.save = function(data) {
      function promise(resolve, reject) {
        saveSkill(data).$promise.then(
          function(data) {
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
      data.owners = data.owners.map(function(item) {
        return item.id;
      });

      function promise(resolve, reject) {
        updateSkill(data).$promise.then(
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
