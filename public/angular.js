var app = angular.module("DrinkApp", ["ngRoute"]);

app.controller('RouteController', ['$http', '$scope', '$route', '$routeParams', '$location',
function($http, $scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}]);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $routeProvider.
    when('/', {
      templateUrl: 'templates/bar.html',
      controller: 'BarController',
      controllerAs: 'barCtrl'
    }).
    when('/clubs', {
      templateUrl: 'templates/clubs.html',
      controller: 'ClubController',
      controllerAs: 'clubCtrl'
    })
}]);


var latitude;
var longitude;
// var googlekey = 'AIzaSyBAuDke1dC1ZniEqPJ_Rv7wfbo3zJbED2w', "AIzaSyAtuHwPlG6AvcHUugdhp99dT1FCAEWSSWs"

var yelps = [];
var auth = {
    consumerKey: "-7RT9CltQThTiOwIYunmzA",
    consumerSecret: "NwMK4NInbjL13e5gY2VUWD7nGBw",
    accessToken: "ZP1lbNJ-TVxJuvwHD2YzLZHUX4i5LZKn",
    accessTokenSecret: "MaDSeYpCt4cPeWsbKD6yzqopwtY",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1"
    }
};

app.controller("BarController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

  ctrl.color = function () {
    var colorArray =  [ '#C2F0E9', '#D2C2F0',  '#E0F0C2',  '#F0C2C9',  '#F0DFC2',  '#C2C3F0', '#E1C2F0',  '#D1F0C2',  '#C1C1E3',  '#C1E0E3',  '#E3ACAC', '#E3ACD4',  '#ACE3C0',  '#ACE3D5',  '#E3C2AC',  '#E3ACCB', '#D2C2F0',  '#E0F0C2',  '#F0C2C9',  '#F0DFC2']
    var num = Math.floor((Math.random() * colorArray.length));
    return colorArray[num]
  }

  this.metersToMiles = function (m) {
    var miles = (m * 0.00062137).toFixed(2);
    return miles
  }

  var callBars = function () {
    var terms = "bars"
    console.log("CALLING BARS");
    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };
    parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['ll', latitude + ", " + longitude]);
    parameters.push(['limit', 20]);
    parameters.push(['sort', 1]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

    // send the request to yelp
    $.ajax({
      'url': message.action,
      'data': parameterMap,
      'cache': true,
      'dataType': 'jsonp',
      'jsonpCallback': 'cb'
    }).success(function(data, textStats, XMLHttpRequest) {
        $scope.$apply(function () {
          $('.loading-container').empty();
          $scope.barCtrl.bars = data.businesses;
          console.log(data.businesses);

        });
    })
  } // end of callBars function


  // Root will automatically post all bars near you
  $http.get("/").success(function () {
    function geo_success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callBars();
    }

    function geo_error(error) {
     alert('ERROR(' + error.code + '): ' + error.message);
    };

    var geo_options = {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    };

    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
  })
}])





app.controller("ClubController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

  ctrl.color = function () {
    var colorArray =  [ '#C2F0E9', '#D2C2F0',  '#E0F0C2',  '#F0C2C9',  '#F0DFC2',  '#C2C3F0', '#E1C2F0',  '#D1F0C2',  '#C1C1E3',  '#C1E0E3',  '#E3ACAC', '#E3ACD4',  '#ACE3C0',  '#ACE3D5',  '#E3C2AC',  '#E3ACCB', '#D2C2F0',  '#E0F0C2',  '#F0C2C9',  '#F0DFC2']
    var num = Math.floor((Math.random() * colorArray.length));
    return colorArray[num]
  }


  this.metersToMiles = function (m) {
    var miles = (m * 0.00062137).toFixed(3);
    return miles
  }

  var callClubs = function () {
    var terms = "clubs"
    console.log("CALLING CLUBS");
    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };
    parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['ll', latitude + ", " + longitude]);
    parameters.push(['limit', 20]);
    parameters.push(['sort', 1]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

    // send the request to yelp
    $.ajax({
      'url': message.action,
      'data': parameterMap,
      'cache': true,
      'dataType': 'jsonp',
      'jsonpCallback': 'cb'
    }).success(function(data, textStats, XMLHttpRequest) {
        $scope.$apply(function () {
          $scope.clubCtrl.clubs = data.businesses;
          $('.loading-container').empty();
          console.log(data.businesses);

        });
    })
  } // end of callBars function


  // Root will automatically post all bars near you
  $http.get("/").success(function () {
    function geo_success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callClubs();
    }

    function geo_error(error) {
     alert('ERROR(' + error.code + '): ' + error.message);
    };

    var geo_options = {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    };

    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
  })
}])
