invoiceApp.controller("AlertCtrl", function AlertCtrl($scope, $rootScope, $timeout) {
	$scope.alerts = {};
	var count = 0;
	
	var onNewAlert = function(event, data) {
		data.id = "alert-" + ++count;
		
		$scope.alerts[data.id] = data;
		
		// show alert (with fancy animation)
		$timeout(function() {
			$("#" + data.id).fadeIn();
		});
		// start timer on non modal dialogs
		if (!data.modal) {
			var timeout = isNaN(data.timeout) ? 60 : data.timeout;
			$timeout(function() { $scope.onClose(data.id); }, timeout * 1000);
		}
	};
	
	$scope.onPositiveAction = function(id) {
		$scope.alerts[id].positiveAction();
		$scope.onClose(id);
	};
	
	$scope.onNegativeAction = function(id) {
		$scope.alerts[id].negativeAction();
		$scope.onClose(id);
	};
	
	$scope.onClose = function(id) {
		$("#" + id).fadeOut();
		delete $scope.alerts[id];
	};
	
	// event listener
	$rootScope.$on("alert", onNewAlert);
});