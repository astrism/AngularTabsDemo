'use strict';

var airpair = angular.module('airpairApp', ['ui.state']);
var TAB_ADDED = 'TAB_ADDED';
var CLOSE_CURRENT = 'CLOSE_CURRENT';

airpair.config(function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, send to /main
	$urlRouterProvider.otherwise('/main');
	//
	// Now set up the states
	/* Route 1 */
	$stateProvider.state('main', {
		url: '/main',
		templateUrl: 'views/main.html',
		controller: function($scope, $location) {

			//manage tabs list when a tab is navigated to
			function onTabAdded(e, args) {
				var newTab;

				// iterate through existing tabs, should probably break when found
				angular.forEach($scope.tabs, function(value, key) {
					if(value.name === args.name) {
						newTab = value;
					}
				});

				//assign if not found
				if(!newTab) {
					newTab = {
						name: args.name,
						location: $location.path()
					};
					$scope.tabs.push(newTab);
				}

				//select the new tab
				$scope.currentTab = newTab;
			}

			function onCurrentTabClosed(e, args) {
				var index = $scope.tabs.indexOf($scope.currentTab);
				$scope.tabs.splice(index, 1);
				if($scope.tabs.length > 0) {
					var newIndex = index > 0 ? index - 1 : 0;
					$scope.currentTab = $scope.tabs[newIndex];
					$location.path($scope.currentTab.location);
				} else {
					$location.path('/main');
				}
			}

			$scope.setCurrentTab = function setCurrentTab(tab) {
				//assign as long as it exists
				if($scope.tabs.indexOf(tab) !== -1) {
					$scope.currentTab = tab;
				}
			};

			$scope.$on(TAB_ADDED, onTabAdded);
			$scope.$on(CLOSE_CURRENT, onCurrentTabClosed);
			$scope.tabs = [];
			$scope.currentTab = null;
		}
	});

	$stateProvider.state('main.group', {
		url: '/group/:groupId',
		templateUrl: 'views/tabs/group.html',
		controller: function($scope, $stateParams) {
			$scope.groupId = $stateParams.groupId;
			$scope.$emit(TAB_ADDED, {
				name: 'Group: ' + $stateParams.groupId
			});
		}
	});

	$stateProvider.state('main.groups', {
		url: '/groups',
		templateUrl: 'views/tabs/groups.html',
		controller: function($scope, $stateParams) {
			$scope.groupId = $stateParams.groupId;
			$scope.$emit(TAB_ADDED, {
				name: 'Groups'
			});
		}
	});
});

airpair.directive('closetab', function(){
	return {
		restrict: 'E',
		template: '<a ng-click="close()" class="pull-right">X</a>',
		replace: true,
		controller: function tabController($scope, $element) {
			$scope.close = function() {
				$scope.$emit(CLOSE_CURRENT);
			};
		}
	};
});