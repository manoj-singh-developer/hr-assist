/*jshint esversion: 6 */

const rootTemplatePath = './views/custom/';

(function() {

  'use strict';

  // ------------------------------------------------------------------------
  // @HRA MODULE
  // ------------------------------------------------------------------------

  angular.module('HRA', [
    'ngMaterial',
    'ngMessages',
    'ngFileUpload',
    'md.data.table',
    'ui.router',
    'ngResource',
    'ngSelectable',
    'ngSanitize',
    'ngCsv',
    'datePicker',
    'angular-loading-bar',
    'permission',
    'permission.ui'
  ]);

  angular.module('HRA').config(setConfig);
  angular.module('HRA').run(setRoles);





  if (location.hostname === 'localhost') {
    angular.module('HRA').constant('apiUrl', 'http://192.168.200.115:3000/api/v1');
  } else {
    angular.module('HRA').constant('apiUrl', 'http://192.168.200.115:3000/api/v1');
  }





  // ------------------------------------------------------------------------
  // @HRAssistConfig
  // ------------------------------------------------------------------------

  setConfig
    .$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function setConfig($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('AuthInterceptor');

    $stateProvider
    // @DASHBOARD
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: rootTemplatePath + 'components/dashboard/views/dashboard.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-dashboard'
        }
      })
      // @EMPLOYEES
      .state('employeesParent', {
        url: '/employees',
        templateUrl: rootTemplatePath + 'components/employee/views/employeesParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('employeesParent.list', {
        url: '/list',
        template: '<hra-employees md-whiteframe="6"></hra-employees>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-employees'
        }
      })
      .state('employeesParent.details', {
        url: '/:id',
        template: '<hra-employee-details></hra-employee-details>',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-employee-details'
        }
      })
      .state('employeesParent.cv', {
        url: '/:id/cv',
        template: '<hra-employee-cv></hra-employee-cv>',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-employee-cv'
        }
      })
      .state('employeesParent.holiday', {
        url: '/:id/holiday/:holidayIndex',
        template: '<hra-employee-holiday-preview></hra-employee-holiday-preview>',
        data: {
          permissions: {
            only: ['ADMIN', 'EMPLOYEE'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-employee-holidays'
        }
      })
      // @HOLIDAYS
      .state('holidayParent', {
        url: '/holidays',
        templateUrl: rootTemplatePath + 'components/holiday/views/holidayParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('holidayParent.list', {
        url: '/list',
        template: '<hra-holidays></hra-holidays>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-holidays'
        }
      })
      .state('holidayParent.details', {
        url: '/:id',
        template: '<hra-holiday-details></hra-holiday-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-holidays-details'
        }
      })
      // @PROJECTS
      .state('projectsParent', {
        url: '/projects',
        templateUrl: rootTemplatePath + 'components/project/views/projectsParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('projectsParent.list', {
        url: '/list',
        template: '<hra-projects md-whiteframe="6"></hra-projects>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-projects'
        }
      })
      .state('projectsParent.details', {
        url: '/:id',
        template: '<hra-project-details></hra-project-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-project-details'
        }
      })
      // @SKILLS
      .state('skillsParent', {
        url: '/skills',
        templateUrl: rootTemplatePath + 'components/skill/views/skillsParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('skillsParent.list', {
        url: '/list',
        templateUrl: rootTemplatePath + 'components/skill/views/skill.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-skills'
        }
      })
      .state('skillsParent.details', {
        url: '/:id',
        template: '<hra-skill-details></hra-skill-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-skills-details'
        }
      })
      // @EQUIPMENTS
      .state('equipmentsParent', {
        url: '/equipments',
        templateUrl: rootTemplatePath + 'components/equipments/views/equipmentParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('equipmentsParent.list', {
        url: '/list',
        template: '<hra-equipments md-whiteframe="6"></hra-equipments>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-equipments'
        }
      })
      .state('equipmentsParent.details', {
        url: '/:id',
        template: '<hra-equipment-details></hra-equipment-detail>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-equipment-details'
        }
      })
      // @CANDIDATES
      .state('candidateParent', {
        url: '/candidate',
        templateUrl: rootTemplatePath + 'components/employee/views/employeesParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('candidateParent.list', {
        url: '/list',
        template: '<hra-employees md-whiteframe="6" candidate=true></hra-employees>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-candidates'
        }
      })
      .state('candidateParent.details', {
        url: '/:id',
        template: '<hra-employee-details candidate=true></hra-employee-details>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-candidate-details'
        }
      })
      .state('candidateParent.cv', {
        url: '/:id/cv',
        template: '<hra-employee-cv candidate=true></hra-employee-cv>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-candidate-cv'
        }
      })
      // EXTRA
      .state('extraParent', {
        url: '/extra',
        templateUrl: rootTemplatePath + 'components/extra/views/extraParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('extraParent.list', {
        url: '/list',
        template: '<hra-extra-list md-whiteframe="6"></hra-extra-list>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-extras'
        }
      })
      // @INDUSTRIES
      .state('industriesParent', {
        url: '/industries',
        templateUrl: rootTemplatePath + 'components/extra/views/industriesParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('industriesParent.list', {
        url: '/list',
        template: '<hra-extra-list-industries extra="{\'type\': \'industries\'}">' + '</hra-extra-list-industries>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-industries'
        }
      })
      // @CUSTOMERS
      .state('customersParent', {
        url: '/customers',
        templateUrl: rootTemplatePath + 'components/extra/views/customersParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('customersParent.list', {
        url: '/list',
        template: '<hra-extra-list-customers extra="{\'type\': \'customers\'}">' + '</hra-extra-list-customers>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-customers'
        }
      })
      // @APP TYPES
      .state('appTypesParent', {
        url: '/appTypes',
        templateUrl: rootTemplatePath + 'components/extra/views/appTypesParent.view.html',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          }
        }
      })
      .state('appTypesParent.list', {
        url: '/list',
        template: '<hra-extra-list-app-types extra="{\'type\': \'appTypes\'}">' + '</hra-extra-list-app-types>',
        data: {
          permissions: {
            only: ['ADMIN'],
            except: ['isAnonymous'],
            redirectTo: 'login'
          },
          cssClassNames: 'view-app-types'
        }
      })
      // @LOGIN
      .state('login', {
        url: '/login',
        templateUrl: rootTemplatePath + 'components/login/views/login.view.html',
        data: {
          permissions: {
            only: ['isAnonymous'],
            except: ['ADMIN', 'EMPLOYEE'],
            redirectTo: getCurrentState
          },
          cssClassNames: 'view-login'
        }
      })
      // @LOGOUT
      .state('logout', {
        url: '/logout',
        resolve: {
          removeRoles: removeToken
        },
        data: {
          cssClassNames: 'view-logout'
        }
      });

  }

  // ------------------------------------------------------------------------
  // @PERMISSIONS
  // ------------------------------------------------------------------------

  setRoles
    .$inject = ['PermPermissionStore', 'PermRoleStore'];

  function setRoles(PermPermissionStore, PermRoleStore) {

    PermRoleStore.defineManyRoles({
      'EMPLOYEE': ['seeOwnProfileOnly'],
      'ADMIN': ['seeEverything']
    });

    PermPermissionStore
      .definePermission('isLoggedIn', isLoggedIn);

    PermPermissionStore
      .definePermission('isAnonymous', isAnonymous);

    PermPermissionStore
      .definePermission('seeOwnProfileOnly', seeOwnProfileOnly);

    PermPermissionStore
      .definePermission('seeEverything', seeEverything);

  }


  // If user is looged in
  isLoggedIn
    .$inject = ['tokenService'];

  function isLoggedIn(tokenService) {

    var token = tokenService.getToken('user_token');

    if (token) {

      return true;

    } else {

      return false;

    }

  }


  // Permission for LOGGED OUT ONLY
  isAnonymous
    .$inject = ['tokenService'];

  function isAnonymous(tokenService) {

    var token = tokenService.getToken('user_token');

    if (!token) {

      return true;

    } else {

      return false;

    }

  }


  // Permission for EMPLOYEES ONLY
  seeOwnProfileOnly
    .$inject = ['tokenService', '$rootScope', 'transitionProperties'];

  function seeOwnProfileOnly(tokenService, $rootScope, transitionProperties) {

    var token = tokenService.getToken('user_token');
    var decodeToken = tokenService.decodeToken(token);

    var userIdApi = ''; // user id that comes from api
    var userIdTransition = ''; // user id from state params
    var isHisProfie = null;
    var isEmployee = null;

    if (decodeToken) {
      userIdApi = parseInt(decodeToken.user_id);
      userIdTransition = parseInt(transitionProperties.toParams.id);

      // [ userIdApi ] and [ userIdTransition ] should be the same
      // in order to PREVENT an Employee
      // to access other Employee profile
      // ONLY ADMIN can access all profiles
      isHisProfie = (userIdApi === userIdTransition);
      isEmployee = (decodeToken.role_id === 2);

      if (isHisProfie && isEmployee) {

        toggleMenuClassesFor('EMPLOYEE');
        $rootScope.isAdmin = false;

        return true;

      } else {

        return false;

      }

    } else {

      return false;

    }

  }


  // Permission for ADMIN ONLY
  seeEverything
    .$inject = ['tokenService', '$rootScope'];

  function seeEverything(tokenService, $rootScope) {

    var token = tokenService.getToken('user_token');
    var decodeToken = tokenService.decodeToken(token);

    if (decodeToken && decodeToken.role_id === 1) {

      toggleMenuClassesFor('ADMIN');
      $rootScope.isAdmin = true;
      return true;

    } else {

      return false;

    }

  }


  // Removing Token.
  removeToken
    .$inject = ['$timeout', '$state', 'PermRoleStore', 'tokenService'];

  function removeToken($timeout, $state, PermRoleStore, tokenService) {

    // Removing token / Set an empty one
    tokenService.setAuthToken();

    // Redirecting to login
    $timeout(function() {
      $state.go('login');
    }, 1);

  }

  // @PERMISSIONS @END PERMISSIONS
  // ------------------------------------------------------------------------


  // Toggle menu extra classes for ADMIN or EMPLOYEE
  function toggleMenuClassesFor(menuType) {

    var $body = angular.element(document.getElementsByTagName('body'));

    if (menuType === 'ADMIN') {

      $body.removeClass('pages-employee pages-admin');
      $body.addClass('pages-admin');

    } else if (menuType === 'EMPLOYEE') {

      $body.removeClass('pages-employee pages-admin');
      $body.addClass('pages-employee');


    }

  }


  getCurrentState
    .$inject = ['$state'];

  function getCurrentState($state) {

    if ($state.current.name) {
      return $state.current.name;
    } else {
      $state.current.name = 'logout';
      $state.go('logout');
      return null;
    }

  }


}());
