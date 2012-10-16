var invoiceApp = angular.module("invoiceApp", ["invoiceServices"]);

invoiceApp.controller("CategoryListCtrl", function CategoryListCtrl($scope, $rootScope, Category) {
	/*
	 * app wide reset function
	 */
	$rootScope.reset = function() {
		$rootScope.$broadcast("reset");
	};
	
	Category.query({},
		function(data) {
			$scope.categories = data.objects;
		},
		function(data){
			$scope.categories = [];
		}
	);
});

invoiceApp.controller("WineCtrl", function WineCtrl($scope, $rootScope, Wine) {
	$scope.quantity = 0;
	
	$scope.$on("reset", function() { $scope.quantity = 0; });
		
	$scope.increase = function() {
		$scope.quantity++;
		$scope.updateItems();
	};
	
	$scope.decrease = function() {
		$scope.quantity--;
		$scope.updateItems();
	};
	
	$scope.updateItems = function() {
		$rootScope.$broadcast("update-item", {wine: $scope.wine, quantity: $scope.quantity});
	};
});

invoiceApp.controller("InvoiceCtrl", function InvoiceCtrl($scope, Invoice) {
	/*
	 * lookup table for the indices of the invoice items
	 * a little bit ugly, but the best solution as far as I know
	 */
	var itemsLookup = {};
	
	/*
	 * constructor function for new invoice items
	 */
	function item(wine, quantity) {
		this.wine = wine;
		this.quantity = quantity;
		this.sum = function() {
			if (wine) return this.wine.price * this.quantity;
			return 0;
		};
	};
	
	var updateItem = function(wine, quantity) {
		var idx = itemsLookup[wine.id];
		
		if (quantity === 0) {
			delete $scope.items.splice(idx, 1);
			delete itemsLookup[wine.id];
		} else {
			if (isNaN(idx)) {
				itemsLookup[wine.id] = $scope.items.length;
				$scope.items.push(new item(wine, quantity));
			} else {
				$scope.items[idx].quantity = quantity;
			}
		}
	};
	
	var reset = function() {
		itemsLookup = {};
		$scope.items = [];
		$scope.rebate = 0;
		$scope.customerData = "";
		
		// TODO try to collapse the open accordion
		// $(".collapse").collapse("hide");
	};
	reset();
	
	$scope.$on("reset", reset);
	$scope.$on("update-item", function(event, data) {
		updateItem(data.wine, data.quantity);
	});
	
	$scope.submit = function() {
		var items = [];
		
		for each (var item in $scope.items) {
			items.push({
				quantity: item.quantity,
				wine: item.wine.resource_uri
			});
		}
		
		Invoice.create({},
			{
				date: new Date(),
				customer: $scope.customerData,
				rebate: $scope.rebate,
				items: items
			},
			function(data, headers) {
				$scope.reset();
			},
			function(data, headers) {
				// TODO error handling
			}
		);
	};
	
	$scope.sum = function() {
		var sum = 0;
		
		for each (var item in $scope.items) {
			sum += item.sum();
		}
		return sum;
	};
	
	$scope.rebateInEuro = function() {
		return $scope.sum() * ($scope.rebate / 100);
	};
	
	$scope.total = function() {
		return $scope.sum() - $scope.rebateInEuro();
	};
});
