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

invoiceApp.controller("WineCtrl", function WineCtrl($scope, $timeout, Wine) {
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

invoiceApp.controller("InvoiceCtrl", function InvoiceCtrl($scope, Invoice, InvoicePosition) {
	/*
	 * lookup table for the indices of the invoice items
	 * I know: a little bit ugly, but the best solution as far as I know
	 */
	var itemsLookup = {};
	
	/*
	 * function to initialize and reset the form data
	 * TODO reset also the data in the winelist
	 */
	$scope.reset = function() {
		$scope.items = [];
		itemsLookup = {};
		$scope.rebate = 0;
		$scope.customerData = "";
	};
	
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
	
	$scope.reset();
	
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
	
	$scope.updateItem = function(wine, quantity) {
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
