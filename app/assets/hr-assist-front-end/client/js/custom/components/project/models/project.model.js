(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('ProjectModel', ProjectModel);

  ProjectModel
    .$inject = ['Employee', '$q', '$resource', 'customerModel', 'Industry', 'appType', 'getIdsService', 'apiUrl'];

  function ProjectModel(Employee, $q, $resource, customerModel, Industry, appType, getIdsService, apiUrl) {

    // Constructor
    // ------------------------------------------------------------------------
    function Project(employees, manager, startDate, deadline, applicationTypes, industries, customers, technologies, mainActivities, projectUrl, description) {
      this.manager = manager || "";
      this.employees = employees || [];
      this.startDate = new Date();
      this.deadline = new Date();
      this.applicationTypes = applicationTypes || [];
      this.industries = industries || [];
      this.description = description || "";
      this.customers = customers || [];
      this.technologies = technologies || [];
      this.mainActivities = mainActivities || [];
      this.projectUrl = projectUrl || "";
    }

    var url = '';
    var employees;
    var customers = [];
    var industries = [];
    var applicationTypes = [];

    // Static methods asigned to class
    // ------------------------------------------------------------------------

    Project.create = function(data) {
      return angular.extend(new Project(), data);
    };

    Project.getAll = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getAllProjects().then(function(data) {
          raw = data.items;
          Employee.getAll().then(function(data) {
            angular.forEach(raw, function(item, index) {
              employees = data.items;
              if (item === '') {
                item.employees = [];
              }
              processed.push(Project.create(item));
              return resolve(processed);
            });
          }, function(data) {});
        }, function(error) {
          return reject('Something gone wrong to get projects!');
        });
      }
      return $q(promise);
    };

    Project.getProjectById = function(id) {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getProjectById(id).$promise.then(function(data) {
          return resolve(Project.create(data));
        }, function(error) {
          return reject('Something gone wrong to get project by id!');
        });
      }
      return $q(promise);
    };

    Project.save = function(data) {
      function promise(resolve, reject) {
        saveProject(data).$promise.then(function(data) {
          getProjectById(data.id).$promise.then(function(data) {
            return resolve(data);
          }, function(error) {
            return reject('Something gone wrong!');
          });
        }, function(error) {
          return reject(error);
        });
      }
      return $q(promise);
    };

    Project.savefromJson = function(data) {
      function promise(resolve, reject) {
        saveFromJson(data).$promise.then(function(data) {
          return resolve(data);
        }, function(err) {
          return reject(err);
        });
      }
      return $q(promise);
    };

    Project.saveApi = function(projectsToUpdate) {
      function promise(resolve, reject) {
        saveFromApi(projectsToUpdate).$promise.then(
          function(data) {

            return resolve(data);
          },
          function(err) {
            return reject(err);
          });
      }
      return $q(promise);
    };

    Project.remove = function(id) {
      function promise(resolve, reject) {
        removeProject(id).$promise.then(function(id) {
          return resolve('Project was deleted successfuly!');
        }, function(error) {
          return reject('Something gone wrong! ( ', error, ' )');
        });
      }
      return $q(promise);
    };
    Project.update = function(data) {
      function promise(resolve, reject) {
        updateProject(data).$promise.then(function(data) {
          resolve(data);
        }, function(error) {
          return reject(error);
        });
      }
      return $q(promise);
    };

    Project.getProjectSkill = function () {
        function promise(resolve, reject){
            getProjectsSkills()
                .then(function (response) {
                    var raw = response.items;
                    return resolve(raw);
                })
                .catch(function (error){
                    return reject;
                });
        }
        return $q(promise);
    };
    // Private methods
    // ------------------------------------------------------------------------
    function getAllProjects() {
      url = apiUrl + "/projects";

      var item = $resource(url).get();
      return item.$promise;
    }

    function getCustomers() {
      customerModel.getAllCustomers().then(function(data) {
        customers = data;
        getIndustries();
        getAppData();
      }, function(error) {});
    }

    function getIndustries() {
      Industries.getAllIndustries().then(function(data) {
        industries = data;
      }, function(error) {});
    }

    function getAppData() {
      appType.getAll().then(function(data) {
        applicationTypes = data;
      }, function(data) {
        console.log("err", data);
      });
    }

    function getProjectsFromApi() {
      url = 'https://assist-software.net/api/projects/getprojects';
      return $resource(url).query();
    }

    function getProjectById(id) {
      url = apiUrl + "/project/" + id;
      return $resource(url).get();
    }

    function saveProject(data) {
      if (data.employees) {
        data.employees = data.employees.map(function(item) {
          return parseInt(item.id);
        });
      }
      url = apiUrl + "/project";
      return $resource(url).save(data);
    }

    function saveFromJson(data) {
      url = apiUrl + "/project";
      return $resource(url, data, {
        'save': {
          method: 'POST',
          isArray: true
        }
      }).save(data);
    }

    function saveFromApi(data) {
      url = apiUrl + "/project";
      return $resource(url, {
        'save': {
          method: 'POST',
          isArray: true
        }
      }).save(data);
    }

    function updateProject(projectToUpdate) {
      url = apiUrl + "/project/" + projectToUpdate.id;

      // @!TODO: De folosit serviciul getIdsService la toate modelele
      projectToUpdate.technologies = getIdsService.getIds(projectToUpdate.technologies);

      if (projectToUpdate.industries) {
        projectToUpdate.industries = projectToUpdate.industries.map(function(item) {
          return parseInt(item.id);
        });
      } else {
        projectToUpdate.industries = [];
      }

      if (projectToUpdate.customers) {
        projectToUpdate.customers = projectToUpdate.customers.map(function(item) {
          return parseInt(item.id);
        });
      } else {
        projectToUpdate.customers = [];
      }

      if (projectToUpdate.applicationTypes) {
        projectToUpdate.applicationTypes = projectToUpdate.applicationTypes.map(function(item) {
          return parseInt(item.id);
        });
      } else {
        projectToUpdate.applicationTypes = [];
      }

      if (projectToUpdate.employees) {
        projectToUpdate.employees = projectToUpdate.employees.map(function(item) {
          return parseInt(item.id);
        });
      }

      return $resource(url, projectToUpdate, {
        'update': {
          method: 'PUT'
        }
      }).save();
    }

    function removeProject(projectToRemove) {
      url = apiUrl + "/projects";
      return $resource(url).delete(projectToRemove);
    }

    function getProjectsSkills() {
        url = apiUrl + '/projects?with[]=technologies';

        var item = $resource(url).get();
        return item.$promise;
    }

    return Project;
  }

}());
