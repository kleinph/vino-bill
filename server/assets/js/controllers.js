function WineListCtrl($scope, $http) {
	$http.get("http://localhost:8080/api/v1/wine/").success(function(data) {
		$scope.wines = data.objects;
	});

	// $scope.wines = [
	//	{name: "Welschriesling 2011", price: 12, volume: 120},
	//	{name: "Federwolke 2011", price: 5, volume: 120}
	// ];
}
