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
    }).
    when('/sports', {
      templateUrl: 'templates/sports.html',
      controller: 'SportsController',
      controllerAs: 'sportCtrl'
    }).
    when('/gay', {
      templateUrl: 'templates/gay.html',
      controller: 'GayController',
      controllerAs: 'gayCtrl'
    }).
    when('/dive', {
      templateUrl: 'templates/dive.html',
      controller: 'DiveController',
      controllerAs: 'diveCtrl'
    }).
    when('/karaoke', {
      templateUrl: 'templates/karaoke.html',
      controller: 'KaraokeController',
      controllerAs: 'karaokeCtrl'
    })
}]);

///////////    GLOBAL VARIABLES    ///////////
var latitude;
var longitude;
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




////////////////////////////////////////////////////////////////////////////////
//////////////////////        BAR CONTROLLER       /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.controller("BarController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

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
        'action': 'https://api.yelp.com/v2/search',
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
  } // end of function


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

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  })
}])







////////////////////////////////////////////////////////////////////////////////
/////////////////////        CLUB CONTROLLER        ////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.controller("ClubController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

  this.metersToMiles = function (m) {
    var miles = (m * 0.00062137).toFixed(2);
    return miles
  }

  var callClubs = function () {
    var terms = "night clubs"
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
        'action': 'https://api.yelp.com/v2/search',
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
  } // end of function


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

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  })
}])








////////////////////////////////////////////////////////////////////////////////
////////////////////        SPORTS CONTROLLER        ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.controller("SportsController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

  this.metersToMiles = function (m) {
    var miles = (m * 0.00062137).toFixed(2);
    return miles
  }

  var callSports = function () {
    var terms = "sports bars"
    console.log("CALLING SPORTS");
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
        'action': 'https://api.yelp.com/v2/search',
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
          $scope.sportCtrl.bars = data.businesses;
          $('.loading-container').empty();
          console.log(data.businesses);

        });
    })
  } // end of function


  // Root will automatically post all bars near you
  $http.get("/").success(function () {
    function geo_success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callSports();
    }

    function geo_error(error) {
     alert('ERROR(' + error.code + '): ' + error.message);
    };

    var geo_options = {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    };

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  })
}])



////////////////////////////////////////////////////////////////////////////////
////////////////////        GAY CONTROLLER        ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.controller("GayController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

  this.metersToMiles = function (m) {
    var miles = (m * 0.00062137).toFixed(2);
    return miles
  }

  var callGay = function () {
    var terms = "gay bars"
    console.log("CALLING Gay");
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
        'action': 'https://api.yelp.com/v2/search',
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
          $scope.gayCtrl.bars = data.businesses;
          $('.loading-container').empty();
          console.log(data.businesses);

        });
    })
  } // end of function


  // Root will automatically post all bars near you
  $http.get("/").success(function () {
    function geo_success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callGay();
    }

    function geo_error(error) {
     alert('ERROR(' + error.code + '): ' + error.message);
    };

    var geo_options = {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    };

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  })
}])





////////////////////////////////////////////////////////////////////////////////
/////////////////////        DIVE CONTROLLER        ////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.controller("DiveController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

  this.metersToMiles = function (m) {
    var miles = (m * 0.00062137).toFixed(2);
    return miles
  }

  var callDive = function () {
    var terms = "dive bars"
    console.log("CALLING DIVE");
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
        'action': 'https://api.yelp.com/v2/search',
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
          $scope.diveCtrl.bars = data.businesses;
          $('.loading-container').empty();
          console.log(data.businesses);

        });
    })
  } // end of function


  // Root will automatically post all bars near you
  $http.get("/").success(function () {
    function geo_success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callDive();
    }

    function geo_error(error) {
     alert('ERROR(' + error.code + '): ' + error.message);
    };

    var geo_options = {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    };

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  })
}])






////////////////////////////////////////////////////////////////////////////////
/////////////////////        KARAOKE CONTROLLER        /////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.controller("KaraokeController", [ "$http", "$scope", function ($http, $scope) {
  ctrl = this

  this.metersToMiles = function (m) {
    var miles = (m * 0.00062137).toFixed(2);
    return miles
  }

  var callKaraoke = function () {
    var terms = "karaoke bars"
    console.log("CALLING KARAOKE");
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
        'action': 'https://api.yelp.com/v2/search',
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
          $scope.karaokeCtrl.bars = data.businesses;
          $('.loading-container').empty();
          console.log(data.businesses);

        });
    })
  } // end of function


  // Root will automatically post all bars near you
  $http.get("/").success(function () {
    function geo_success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callKaraoke();
    }

    function geo_error(error) {
     alert('ERROR(' + error.code + '): ' + error.message + " Please change your location settings on your device");
    };

    var geo_options = {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    };

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  })
}])
