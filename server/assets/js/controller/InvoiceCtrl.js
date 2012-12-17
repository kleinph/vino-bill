invoiceApp.controller("WineCtrl", function WineCtrl($scope, InvoiceService) {
	$scope.quantity = 0;
	
	$scope.updateItem = function(amount) {
		amount = amount === null ? 0 : amount;
		$scope.quantity = amount;
		InvoiceService.updateItem($scope.wine, $scope.quantity);
	};
	
	// reset event listener
	$scope.$on("reset", function() { $scope.quantity = 0; });
});

invoiceApp.controller("InvoiceCtrl", function InvoiceCtrl($scope, InvoiceService) {
	$scope.invoice = InvoiceService;
	
	var print = function() {
		InvoiceService.print(function(data, headers) {
			$scope.reset();
			$scope.$emit("alert", {
				type: "alert-success",
				text: "Auftrag wurde an Drucker gesendet."
			});
		}, function(data, headers) {
			// TODO test error handling
			$scope.$emit("alert", {
				type: "alert-error",
				modal: true,
				heading: "Es ist ein Fehler aufgetreten!",
				text: "Daten konnten nicht gedrukt werden. Wollen Sie es erneut versuchen?",
				positiveAction: print,
				negativeAction: $scope.reset,
			})
		});
	};
	
	$scope.submit = function() {
		$scope.isSubmitting = true;
		
		InvoiceService.submit(function(data, headers) {
			$scope.$emit("alert", {
				type: "alert-success",
				// TODO highlight invoice id
				text: "Die Rechnung " + $scope.invoice.id + " wurde erfolgreich erstellt! " +
				"Ausdruck wurde gestartet.",
				timeout: 30,
			});
			print();
		}, function(data, headers){
			$scope.$emit("alert", {
				type: "alert-error",
				modal: true,
				heading: "Es ist ein Fehler aufgetreten!",
				text: "Daten konnten nicht übermittelt werden. Wollen Sie es erneut versuchen?",
				positiveAction: $scope.submit,
				negativeAction: $scope.reset,
			});
		});
	};
	
	$scope.reset = function() {
		InvoiceService.reset();
		$scope.isSubmitting = false;
		$scope.$broadcast("reset");
		// collapse open accordeons
		$(".in.collapse").collapse("toggle");
	}
});