(function() {

  'use strict';

  angular
    .module('HRA')
    .factory('ProjectModel', ProjectModel);

  ProjectModel
    .$inject = ['Employee', '$q', '$resource', 'customerModel', 'Industries', 'appType', 'getIdsService', 'apiUrl'];

  function ProjectModel(Employee, $q, $resource, customerModel, Industries, appType, getIdsService, apiUrl) {

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
        getAllProjects().$promise.then(function(data) {
          raw = data.items;
          Employee.getAll().then(function(data) {
            angular.forEach(raw, function(item, index) {
              employees = data;
              if (item.employees === undefined) {
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

    Project.getTecho = function() {
      var raw = [];
      var processed = [];

      function promise(resolve, reject) {
        getProjectsFromApi().$promise.then(function(data) {
          raw = data;
          angular.forEach(raw, function(item, index) {
            processed.push(item.technologies);
          });
          return resolve(processed);
        }, function(error) {
          return reject('Something gone wrong to get technologies!');
        });
      }
      return $q(promise);
    };

    getCustomers();
    Project.getFromApi = function(app, ind, cust, technologies) {
      var raw = [];
      var processed = [];
      var numb = [];
      var indAccumulator = [];
      var appAccumulator = [];
      var technologiesAccumulator = [];
      var temp1 = [];
      var temp2 = [];
      var temp3 = [];
      var temp4 = []; // Used to technologies
      customers = cust;
      industries = ind;
      applicationTypes = app;

      function promise(resolve, reject) {
        getProjectsFromApi().$promise.then(function(data) {
          getCustomers();
          raw = data;
          angular.forEach(raw, function(itm, indexx) {
            angular.forEach(customers, function(item, index) {
              for (var q = 0; q < itm.customers.length; q++)
                if (item.name === itm.customers[q]) temp1.push(item.id);
            });
            numb[indexx] = temp1;
            temp1 = [];
            angular.forEach(industries, function(item, index) {
              for (var w = 0; w < itm.industries.length; w++)
                if (item.name === itm.industries[w]) temp2.push(item.id);
            });
            indAccumulator[indexx] = temp2;
            temp2 = [];
            angular.forEach(applicationTypes, function(item, index) {
              for (var p = 0; p < itm.applicationTypes.length; p++)
                if (item.name === itm.applicationTypes[p]) temp3.push(item.id);
            });
            appAccumulator[indexx] = temp3;
            temp3 = [];
            // Save technologies
            angular.forEach(technologies, function(item, index) {
              for (var techIndex = 0; techIndex < itm.technologies.length; techIndex++) {
                var ceva = [];
                if (item.name === itm.technologies[techIndex]) {
                  temp4.push(parseInt(item.id));
                }
              }
            });
            technologiesAccumulator[indexx] = temp4;
            temp4 = [];
          });

          angular.forEach(raw, function(item, index) {

            processed.push(Project.create({
              name: item.name,
              //description: item.description,
              industries: indAccumulator[index],
              customers: numb[index],
              technologies: technologiesAccumulator[index],
              projectUrl: item.projectUrl,
              mainActivities: item.mainActivities,
              applicationTypes: appAccumulator[index]
            }));
          });
          return resolve(processed);
        }, function(error) {
          return reject('Something gone wrong!');
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
    // Private methods
    // ------------------------------------------------------------------------
    function getAllProjects() {
      url = apiUrl + "/projects";
       return $resource(url, {
         'query': {
           method: 'GET',
           isArray: false
         }
       }).get();
      // return $resource(url).query();
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

    return Project;
  }

}());
