var invoiceApp = angular.module("invoiceApp", ["invoiceServices"]);

invoiceApp.controller("CategoryListCtrl", function CategoryListCtrl($scope, Category) {
	Category.query({},
		function(data) {
			$scope.categories = data.objects;
		},
		function(data){
			$scope.categories = [];
		}
	);
});

invoiceApp.controller("WineCtrl", function WineListCtrl($scope, $timeout, Wine) {
	$scope.quantity = 0;
	
	$scope.increase = function() {
		$scope.quantity++;
		$scope.updateItems();
	};
	
	$scope.decrease = function() {
		$scope.quantity--;
		$scope.updateItems();
	};
	
	$scope.updateItems = function() {
		// FIXME ugly hack for "inter-controller-communication"
		angular.element($("#invoice")).scope().updateItem($scope.wine, $scope.quantity);
	};
});

invoiceApp.controller("InvoiceCtrl", function InvoiceCtrl($scope) {
	$scope.items = {};
	$scope.itemCount = 0;
	$scope.rebate = 0;
	$scope.customerData = "";
	
	/*
	 * constructor function for new invoice items
	 */
	function item(wine, quantity) {
		this.pos = ++$scope.itemCount;
		this.wine = wine,
		this.count = quantity,
		this.sum = function() {
			if (wine) return this.wine.price * this.count;
			return 0;
		}
	};
	
	/*
	 * helper function to update the indices after item removal
	 */
	function updateIndices(startIndex) {
		for (id in $scope.items) {
			if ($scope.items[id].pos > startIndex) {
				--$scope.items[id].pos;
			}
		}
	};
	
	$scope.updateItem = function(wine, quantity) {
		if (quantity === 0) {
			updateIndices($scope.items[wine.id].pos);
			delete $scope.items[wine.id];
			$scope.itemCount--;
		} else {
			if (!$scope.items[wine.id]) {
				$scope.items[wine.id] = new item(wine, quantity);
			} else {
				$scope.items[wine.id].count = quantity;
			}
		}
	};
	
	$scope.sum = function() {
		if ($scope.itemCount <= 0) {
			return 0;
		}
		
		var sum = 0;
		
		for (id in $scope.items) {
			sum += $scope.items[id].sum();
		}
		return sum;
	};
	
	$scope.rebateInEuro = function() {
		return $scope.sum() * ($scope.rebate / 100);
	}
	
	$scope.total = function() {
		return $scope.sum() - $scope.rebateInEuro();
	};
});
