
'use strict';
/* jshint globalstrict: true */
/* global angular,d3,crossfilter */

var app = angular.module('cemriApp');
var utilsFactory = app.factory('directiveUtils', ['cemriData', '$rootScope', function(cemriData, $rootScope){
  return {
    getChartsTransition: function (){
      var t = d3.transition()
        .duration(750);

      return t;
    },
    manageOnClick: function (filterList, elem, classOrig, type, key){
      var cleaned;
      var indexOfValue = filterList.indexOf(key);
      if (indexOfValue === -1){
        cleaned = cemriData.updateCemriFilter('add', type, key);
        if (cleaned){
          d3.selectAll(classOrig).attr('class', classOrig.substring(1));
        }
        else {
          elem.classed('filtered', true);
          elem.classed('nofiltered', false);
          d3.selectAll(classOrig + ':not(.filtered)').classed('nofiltered', true);
        }
      }
      else {
        cleaned = cemriData.updateCemriFilter('del', type, key);
        if (cleaned){
          d3.selectAll(classOrig).attr('class', classOrig.substring(1));
        }
        else {
          elem.classed('filtered', false);
          elem.classed('nofiltered', true);
        }
      }
    },
    arcTween: function (elem, arc, d, oncreate) {
      var current;
      if (oncreate){
        current = angular.copy(d);
        current.startAngle = 0;
        current.endAngle = 0;
      }
      else{
        current = elem.current;
      }
      var i = d3.interpolateObject(current, d);
      elem.current = i(0);
      return function(t) {
        return arc(i(t));
      };
    },
    arcTextTween: function (elem, arc, d) {
      var i = d3.interpolateObject(elem.current, d);
      elem.current = i(0);
      return function(t) {
        return "translate(" + arc.centroid(i(t)) + ")";
      };
    },
    getAll: function(data){
      return data.reduce(function(a, b) {
        return a + b.value;
      }, 0);
    }
  };
}]);

app.directive('d3VerticalBars', ['cemriData', 'directiveUtils', function(cemriData, directiveUtils) {
    return {
        restrict: 'E',
        scope: {
            type: '@',
            width: '@',
            height: '@'
        },
        link: function(scope, element, attrs) {
            d3.select(element[0])
                .append('svg')
                .attr('class', 'verticalBarsChart');

            //the graph is rendered on load and any time there is a change
            scope.$on('renderAll', function() {
              render(cemriData[scope.type]);
            });

            var margin = {
                    top: 10,
                    right: 30,
                    bottom: 20,
                    left: 30
                },
                width = scope.width - margin.left - margin.right,
                height = scope.height - margin.top - margin.bottom;

            var filterList = cemriData.getCermiFilterList(scope.type);

            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.4);

            var y = d3.scaleLinear()
                .range([height, 0]);

            var xAxis = d3.axisBottom(x);
            var yAxis = d3.axisLeft(y).ticks(5);

            var chart = d3.select('.verticalBarsChart')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var chartXAxis = chart.append('g')
                                .attr('transform', 'translate(0,' + height + ')')
                                .attr('class', 'x axis');

            var chartYAxis = chart.append('g')
                                .attr('class', 'y axis');

            var render = function(data) {
                data.sort(function(a, b){
                  if(a.key < b.key) return -1;
                  if(a.key > b.key) return 1;
                });
                x.domain(data.map(function(d) {
                    return d.key;
                }));
                y.domain([0, d3.max(data, function(d) {
                    return d.value;
                })]);

                var verticalBar = chart.selectAll('.verticalBar')
                    .data(data);

                verticalBar.enter().append('rect')
                    .on('click', function (d) {
                      directiveUtils.manageOnClick(filterList, d3.select(this), '.verticalBar', scope.type, d.key);
                    })
                    .attr('class', 'verticalBar')
                    .attr('x', function(d) {
                        return x(d.key);
                    })
                    .attr('y', function(d) {
                        return y(0);
                    })
                    .attr('width', x.bandwidth())
                    .transition(directiveUtils.getChartsTransition())
                    .attr('y', function(d) {
                        return y(d.value);
                    })
                    .attr('height', function(d) {
                        return height - y(d.value);
                    });

                verticalBar
                  .transition(directiveUtils.getChartsTransition())
                  .attr('y', function(d) {
                      return y(d.value);
                  })
                  .attr('height', function(d) {
                      return height - y(d.value);
                  });

                chartXAxis
                    .transition(directiveUtils.getChartsTransition())
                    .call(xAxis);

                chartYAxis
                    .transition(directiveUtils.getChartsTransition())
                    .call(yAxis);
            };
        }
    };
}])

.directive('d3DonutChart', ['cemriData', 'directiveUtils', function(cemriData, directiveUtils) {
  return {
      restrict: 'E',
      scope: {
        type: '@',
        width: '@',
        height: '@'
      },
      link: function(scope, element, attrs) {
        d3.select(element[0])
            .append('svg')
            .attr('class', 'donutChart ' + scope.type);

        var divTooltip = d3.select('.container').append("div")
                .attr("class", "donut-tooltip")
                .style("opacity", 0);

        scope.$on('renderAll', function() {
          render(cemriData[scope.type]);
        });

        var margin = {
                top: 10,
                right: 30,
                bottom: 30,
                left: 30
            },
            width = scope.width - margin.left - margin.right,
            height = scope.height - margin.top - margin.bottom,
            radius = Math.min(width, height) / 2;

      var filterList = cemriData.getCermiFilterList(scope.type);

        var color = d3.scaleOrdinal()
          .range(['#02665e', '#34978f', '#f26d43', '#faad61', '#898989']);

        var arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        var pie = d3.pie()
            .value(function(d) { return d.value; });

        var chart = d3.select('.donutChart.' + scope.type)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + (width + margin.left + margin.right) / 2 + ',' + (height + margin.top + margin.bottom) / 2 + ')');

        var render = function(data) {
            var keys = data.map(function(a) {return a.key;});
            color.domain(keys);

            var donutChart = chart.selectAll('.donutArc')
                .data(pie(data));

                donutChart.enter()
                .append('path')
                .attr('class', 'donutArc')
                .each(function(d){
                  this.current = d;
                })
                .on('click', function (d) {
                  directiveUtils.manageOnClick(filterList, d3.select(this), '.donutArc', scope.type, d.data.key);
                })
                .on("mousemove", function(d) {
                    divTooltip.transition()
                        .duration(100)
                        .style("opacity", 0.9);
                    divTooltip.html(d.data.key + '<br>' + Math.floor(d.value / directiveUtils.getAll(data) * 100) + "%")
                        .style("left", d3.event.pageX + 10 + "px")
                        .style("top", d3.event.pageY- 25 + "px");
                    })
                .on("mouseout", function(d) {
                    divTooltip.transition()
                        .duration(100)
                        .style("opacity", 0);
                })
                .style('fill', function(d) {
                  return color(d.data.key);
                })
                .transition(directiveUtils.getChartsTransition())
                .attrTween('d', function(d){
                  return directiveUtils.arcTween(this, arc, d, true);
                });

            var donutChartText = chart.selectAll('.donutText')
                .data(pie(data));

            donutChartText.enter()
                .append('text')
                .each(function(d){
                  this.current = d;
                })
                .attr('class', 'donutText')
                .filter(function(d) {
                  return  Math.abs(d.endAngle - d.startAngle) > 1;
                })
                .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
                .attr("pointer-events", "none")
                .attr("text-anchor", "middle")
                .text(function(d) { return d.data.key; });

            donutChart
                .transition(directiveUtils.getChartsTransition())
                .attrTween('d', function(d){
                  return directiveUtils.arcTween(this, arc, d);
                });

            donutChartText
                .text(function(d){
                  return Math.abs(d.endAngle - d.startAngle) > 1 ? d.data.key : '';
                })
                .transition(directiveUtils.getChartsTransition())
                .attrTween('transform', function(d){
                  return directiveUtils.arcTextTween(this, arc, d);
                });
        };
      }
  };
}])

.directive('d3HorizontalBars', ['cemriData', 'directiveUtils', function(cemriData, directiveUtils) {
  return {
      restrict: 'E',
      scope: {
          type: '@',
          width: '@',
          height: '@'
      },
      link: function(scope, element, attrs) {
        d3.select(element[0])
            .append('svg')
            .attr('class', 'horizontalBarsChart');

        var divTooltip = d3.select('.container').append("div")
                .attr("class", "horizontalBar-tooltip")
                .style("opacity", 0);

        scope.$on('renderAll', function() {
          render(cemriData[scope.type]);
        });

        var margin = {
                top: 10,
                right: 30,
                bottom: 30,
                left: 50
            },
            width = scope.width - margin.left - margin.right,
            height = scope.height - margin.top - margin.bottom;

        var filterList = cemriData.getCermiFilterList(scope.type);

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleBand()
            .range([0, height])
            .padding(0.1);

        var xAxis = d3.axisBottom(x);

        var chart = d3.select('.horizontalBarsChart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var chartXAxis = chart.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')');


        var render = function(data) {
            data.sort(function(a, b){
              if(a.key < b.key) return 1;
              if(a.key > b.key) return -1;
            });

            x.domain([0, d3.max(data, function(d) {
                return d.value;
            })]);
            y.domain(data.map(function(d) {
                return d.key;
            }));

            var horizontalChart = chart.selectAll('.horizontalBar')
                .data(data);

            horizontalChart.enter().append('rect')
                .on('click', function (d) {
                  directiveUtils.manageOnClick(filterList, d3.select(this), '.horizontalBar', scope.type, d.key);
                })
                .attr('class', 'horizontalBar')
                .attr('x', 0)
                .attr('y', function(d) {
                    return y(d.key);
                })
                .attr('height', y.bandwidth())
                .on("mousemove", function(d) {
                    divTooltip.transition()
                        .duration(100)
                        .style("opacity", 0.9);
                    divTooltip.html(d.key + '<br>' + Math.floor(d.value / directiveUtils.getAll(data) * 100) + "%")
                        .style("left", d3.event.pageX + 10 + "px")
                        .style("top", d3.event.pageY- 25 + "px");
                    })
                .on("mouseout", function(d) {
                    divTooltip.transition()
                        .duration(100)
                        .style("opacity", 0);
                })
                .transition(directiveUtils.getChartsTransition())
                .attr('width', function(d) {
                    return x(d.value);
                });

            horizontalChart
              .transition(directiveUtils.getChartsTransition())
              .attr('width', function(d) {
                  return x(d.value);
              });

            var horizontalChartText = chart.selectAll('text.horizontalBarText')
                .data(data);

            horizontalChartText.enter()
              .append('text')
              .attr('class', 'horizontalBarText')
              .text(function(d) {
                  return x(d.value) > (width / 20) ? d.key: '';
              })
              .attr('x', 5)
              .attr('y', function(d) {
                  return y(d.key) + y.bandwidth() / 2;

              });

            horizontalChartText
              .text(function(d) {
                  return x(d.value) > (width / 20) ? d.key: '';
              });

            chartXAxis
              .transition(directiveUtils.getChartsTransition())
              .call(xAxis);
        };
      }
  };
}])

.directive('d3CemriMap', ['cemriData', 'cityLatLng', function(cemriData, cityLatLng) {
  return {
      restrict: 'E',
      scope: {
        width: '@',
        height: '@'
      },
      link: function(scope, element, attrs) {
        var projection = d3.geoMercator();
		    projection.center([27.55, 21.20]).scale(600);
		    var path = d3.geoPath().projection(projection);
        var size = 15;

        var margin = {top: 20, right: 100, bottom: 60, left: 50},
            width = scope.width - margin.left - margin.right,
            height = scope.height - margin.top - margin.bottom,
            map = d3.select(element[0])
                  .append('svg')
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom),
            gMap = map.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
            gMapBorders = gMap.append("g"),
            gCityMovements = gMap.append("g");

        scope.$on('renderAll', function() {
          render(cemriData.movements, cemriData.geoData);
        });

        var render = function(data, geojson) {
          gMapBorders.selectAll("path")
        		.data(geojson.geoJSON.features)
      		.enter().append("path")
    		    .attr("class", 'boundary')
    				.attr("d", path);


          gCityMovements.selectAll('.moveArrow').remove();
          var cityPoints = gCityMovements.selectAll(".moveArrow")
			       .data(data);

          cityPoints.enter()
            .append('path')
            .attr('class', 'moveArrow')
            .each(function (d){
               //for each two point trip find the map projection of the cities and the line angle between them
               var cityFrom = d.city1;
               var cityTo = d.city2;
               var cityFromLngLat = cityLatLng.coordinates[cityFrom];
               var cityToLngLat = cityLatLng.coordinates[cityTo];
               d.fromProjection = projection([cityFromLngLat.lng, cityFromLngLat.lat]);
               d.toProjection = projection([cityToLngLat.lng, cityToLngLat.lat]);
               var x = d.toProjection[0] - d.fromProjection[0];
               var y = d.toProjection[1] - d.fromProjection[1];
               d.dist = Math.sqrt(x * x + y * y);
               d.angle = Math.atan2(y, x) / Math.PI * 180;
            })
            .attr('d', function(d){
              //draw the arrow
               var arrow = 'M0,0 L' + [
                   d.dist - size, size / 3,
                   d.dist - size, size,
                   d.dist, 0,
                   d.dist - size, -size,
                   d.dist - size, -size / 3,
                 ] + 'z';
              return arrow;
            })
      			.attr('transform', function(d){
              return 'translate(' + [d.fromProjection[0], d.fromProjection[1]] + ') rotate(' + d.angle + ')';
            })
            .attr("fill", function(d){
              if (d.id === 'West Africa'){
                return '#02665e';
              }
              else if (d.id === 'Central Africa'){
                return '#34978f';
              }
              else if (d.id === 'Horn of Africa'){
                return '#34978f';
              }
              else if (d.id === 'Middle east'){
                return '#f26d43';
              }
            });
        };

      }
  };
}]);
