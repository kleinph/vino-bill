invoiceApp.controller("CategoryListCtrl", function CategoryListCtrl($scope, $rootScope, Category) {
	/*
	 * app wide reset function
	 */
	$rootScope.reset = function() {
		$rootScope.$broadcast("reset");
	};
	
	Category.query({}, function(data) {
		$scope.categories = data.objects;
	}, function(data){
		$scope.categories = [];
	});
});

invoiceApp.controller("WineCtrl", function WineCtrl($scope, $rootScope) {
	$scope.quantity = 0;
	
	// reset listener
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

invoiceApp.controller("InvoiceCtrl", function InvoiceCtrl($scope, Invoice, PrintService) {
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
		$scope.invoice = {
			rebate: 0,
			customer: "",
			items: []
		};
		$scope.isSubmitting = false;
		// collapse an open accordion
		$(".in.collapse").collapse("toggle");
	};
	reset();
	
	// event listener
	$scope.$on("reset", reset);
	$scope.$on("update-item", function(event, data) {
		updateItem(data.wine, data.quantity);
	});
	
	var print = function(id) {
		PrintService.print({id: id}, {}, function(data, headers) {
			$scope.reset();
			$(".alert-success").fadeIn();
		}, function(data, headers) {
			$scope.isSubmitting = false;
		});
	};
	
	$scope.submit = function() {
		$scope.invoice.date = new Date();
		$scope.isSubmitting = true;
		
		for (var i in $scope.items) {
			$scope.invoice.items.push({
				quantity: $scope.items[i].quantity,
				wine: $scope.items[i].wine.resource_uri
			});
		}
		
		Invoice.create({}, $scope.invoice, function(data, headers) {
			id = headers("Location").split("/").pop();
			print(id);
		}, function(data, headers) {
			// TODO error handling
			$scope.isSubmitting = false;
			$(".alert-error").fadeIn();
		});
	};
	
	$scope.sum = function() {
		var sum = 0;
		
		for (var i in $scope.items) {
			sum += $scope.items[i].sum();
		}
		return sum;
	};
	
	$scope.rebateInEuro = function() {
		return $scope.sum() * ($scope.invoice.rebate / 100);
	};
	
	$scope.total = function() {
		return $scope.sum() - $scope.rebateInEuro();
	};
});
