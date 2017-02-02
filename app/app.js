'use strict';

/* jshint globalstrict: true */
/* global angular,$,d3,crossfilter */

var app = angular.module('cemriApp', [])
            .constant('csvCemriUrl', 'data/journeyProfile.csv')
            .constant('geoJsoCemrinUrl', 'data/inmigrationMap.json');

app.factory('cemriData', function($rootScope, $http, $q, csvCemriUrl, cityLatLng,
      geoJsoCemrinUrl) {
    var cemriData,
        geoData = {},
        locationDimension,
        regOriginDimension,
        attemptsDimension,
        regOriginForMovementsDimension,
        locationDimensionGroup,
        regOriginDimensionGroup,
        attemptsDimensionGroup,
        movementsDimensionGroup,
        personByLocation = [],
        personByRegOrigin = [],
        personByAttempts = [],
        movementsPerRegion = [],
        cemriFilter = {
          'location': [],
          'regOrigin': [],
          'attempts': []
        };

    //function to manage the count of trips between two cities
    var calculateMovementCount = function(obj, city1, city2, op){
      if (city1 !== '' && city2 !== '' && !!cityLatLng.coordinates[city1] && !!cityLatLng.coordinates[city2]){
        if (obj[city1 + '#' + city2]){
          if (op === 'add'){
            obj[city1 + '#' + city2] += 1;
          }
          else{
            obj[city1 + '#' + city2] -= 1;
            if (obj[city1 + '#' + city2] === 0){
              delete obj[city1 + '#' + city2];
            }
          }
        }
        else{
          obj[city1 + '#' + city2] = 1;
        }
      }
    };
    var addingFunction = function(p, v) {
      var firstCity = v['1stcity'].trim(),
          secondCity = v['2ndcity'].trim(),
          thirdCity = v['3rdcity'].trim(),
          fourthCity = v['4thcity'].trim(),
          fifthCity = v['5thcity'].trim();

      calculateMovementCount(p, firstCity, secondCity, 'add');
      calculateMovementCount(p, secondCity, thirdCity, 'add');
      calculateMovementCount(p, thirdCity, fourthCity, 'add');
      calculateMovementCount(p, fourthCity, fifthCity, 'add');

      return p;
    };
    var deletingFunction = function(p, v) {
      var firstCity = v['1stcity'].trim(),
          secondCity = v['2ndcity'].trim(),
          thirdCity = v['3rdcity'].trim(),
          fourthCity = v['4thcity'].trim(),
          fifthCity = v['5thcity'].trim();

      calculateMovementCount(p, firstCity, secondCity);
      calculateMovementCount(p, secondCity, thirdCity);
      calculateMovementCount(p, thirdCity, fourthCity);
      calculateMovementCount(p, fourthCity, fifthCity);

      return p;
    };
    //expand the group in a list of city trips and the number of times used
    var fillMovementsPerRegionList = function(movementsPerRegion){
      movementsPerRegion.length = 0;
      var movementsPerRegionOrigin = movementsDimensionGroup.top(Infinity);
      for (var i = 0; i < movementsPerRegionOrigin.length; i++) {
        var record = movementsPerRegionOrigin[i];
        var regionOrigin = record.key;
        for (var movements in record.value) {
          var movementCities = movements.split('#');
          movementsPerRegion.push({id: regionOrigin, city1: movementCities[0], city2: movementCities[1], value: record.value[movements]});
        }
      }
    };
    //this function manages the action of adding or removing a filtrer through the chart
    //interface, modifing the crossfilter dimension and final results
    var updateCemriFilter = function (op, type, value){
      var cleaned = false; //used to remove all filter classes
      if (op === 'add'){
        //when all filters are applied desactivate all
        if (cemriFilter[type].length < theFactory[type].length - 1){
          cemriFilter[type].push(value);
        }
        else {
          cemriFilter[type].length = 0;
        }
      }
      else {
        var index = cemriFilter[type].indexOf(value);
        cemriFilter[type].splice(index, 1);
      }

      var theDimension;
      if (type === 'location'){
        theDimension = locationDimension;
      }
      else if (type === 'regOrigin') {
        theDimension = regOriginDimension;
      }
      else if (type === 'attempts') {
        theDimension = attemptsDimension;
      }

      if (cemriFilter[type].length){
        theDimension.filter(function(d) {
          return cemriFilter[type].indexOf(d) !== -1;
        });
      }
      else{
        theDimension.filterAll();
        cleaned = true;
      }

      personByLocation.length = 0;
      personByRegOrigin.length = 0;
      personByAttempts.length = 0;
      locationDimensionGroup.reduceCount().top(Infinity).forEach(function(e) {personByLocation.push(e);});
      regOriginDimensionGroup.reduceCount().top(Infinity).forEach(function(e) {personByRegOrigin.push(e);});
      attemptsDimensionGroup.reduceCount().top(Infinity).forEach(function(e) {personByAttempts.push(e);});
      fillMovementsPerRegionList(movementsPerRegion);

      $rootScope.$broadcast('renderAll');

      return cleaned;
    };
    var promiseCermriData = $http.get(csvCemriUrl);
    var promiseGeoJSON = $http.get(geoJsoCemrinUrl);

    $q.all([promiseCermriData, promiseGeoJSON]).then(function(result) {
        $("#loader").fadeOut("slow");
        $("#loader-wrapper").css({
            'background-color': 'transparent',
            'transition' : '2s ease-in-out',
            'z-index': -1000
        });
        cemriData = d3.csvParse(result[0].data);
        geoData.geoJSON = result[1].data;

        var crossData = crossfilter(cemriData);
        locationDimension = crossData.dimension(function(d) {
            return d.baladiya;
        });
        regOriginDimension = crossData.dimension(function(d) {
            return d.regOrigin;
        });
        attemptsDimension = crossData.dimension(function (d) {
            return d.attempts;
        });
        regOriginForMovementsDimension = crossData.dimension(function (d) {
            return d.regOrigin;
        });
        locationDimensionGroup = locationDimension.group();
        locationDimensionGroup.reduceCount().top(Infinity).forEach(function(e) {personByLocation.push(e);});
        regOriginDimensionGroup = regOriginDimension.group();
        regOriginDimensionGroup.reduceCount().top(Infinity).forEach(function(e) {personByRegOrigin.push(e);});
        attemptsDimensionGroup = attemptsDimension.group();
        attemptsDimensionGroup.reduceCount().top(Infinity).forEach(function(e) {personByAttempts.push(e);});
        movementsDimensionGroup = regOriginForMovementsDimension.group().reduce(
          addingFunction,
          deletingFunction,
          function() {
            return {
            };
          });
        fillMovementsPerRegionList(movementsPerRegion);

        $rootScope.$broadcast('renderAll');
    });

    var theFactory = {
        location: personByLocation,
        regOrigin: personByRegOrigin,
        attempts: personByAttempts,
        movements: movementsPerRegion,
        geoData: geoData,
        updateCemriFilter: function(op, type, value) {
            return updateCemriFilter (op, type, value);
        },
        getCermiFilter: function() {
          return cemriFilter;
        },
        getCermiFilterList: function(type) {
          return cemriFilter[type];
        }
    };

    return theFactory;
});
