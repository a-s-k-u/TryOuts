var app = angular.module('tryOutApp', ['ui.router']);

//deals with all calls made to app server.
app.factory('webServiceCall',['$http', function($http){
    var o = {
        parties: [],
        party: {}
    };

    o.getAll = function () {
        return $http.get('/parties').success(function (data) {
            angular.copy(data, o.parties);
        });
    };
    o.get = function (id) {
        return $http.get('/party/' + id).success(function (data) {
            angular.copy(data[0], o.party);
        });
    };
   
    return o;
}]);

//deals with UI updates
app.controller('HomeCtrl', [
'$scope',
'webServiceCall',
function ($scope, webServiceCall) {
    $scope.parties = webServiceCall.parties;
}]);

//deals with UI updates
app.controller('DetailsCtrl', [
'$scope',
'$stateParams',
'webServiceCall',
function ($scope,$stateParams, webServiceCall) {
    $scope.party = webServiceCall.party;
}]);

//configures which html piece to load and determines state.
app.config([
'$stateProvider',
'$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
          url: '/index',
          templateUrl: '/home.html',
          controller: 'HomeCtrl',
          resolve: {
              postPromise: ['webServiceCall', function (webServiceCall) {
                  return webServiceCall.getAll();
              }]
          }
      });
    $stateProvider.state('parties', {
          url: '/parties/{id}',
          templateUrl: '/selectedParty.html',
          controller: 'DetailsCtrl',
          resolve: {
              postPromise: ['$stateParams', 'webServiceCall', function ($stateParams, webServiceCall) {
                  return webServiceCall.get($stateParams.id);
              }]
          }
      });

    $urlRouterProvider.otherwise('home');
}]);

app.config(['$httpProvider', function ($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);
