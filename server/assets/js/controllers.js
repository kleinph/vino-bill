function WineListCtrl($scope, $http) {
	$http.get("http://localhost:8000/api/v1/category/").success(function(data) {
		$scope.categories = data.objects;
	});

	// $scope.wines = [
	//	{name: "Welschriesling 2011", price: 12, volume: 120},
	//	{name: "Federwolke 2011", price: 5, volume: 120}
	// ];
}
