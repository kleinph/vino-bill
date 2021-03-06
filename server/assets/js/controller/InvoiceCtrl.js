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
			$scope.$emit("alert", {
				type: "alert-error",
				modal: true,
				heading: "Es ist ein Fehler aufgetreten!",
				text: "Kundenbeleg konnte nicht gedrukt werden. Wollen Sie es erneut versuchen?",
				positiveAction: print,
				negativeAction: $scope.reset,
			})
		});
	};
	
	$scope.submit = function(doPrint) {
		$scope.isSubmitting = true;
		$(".in.collapse").collapse("toggle");
		$("html, body").animate({ scrollTop: 0 }, "slow");
		
		InvoiceService.submit(function(data, headers) {
			$scope.$emit("alert", {
				type: "alert-success",
				text: "Daten wurden erfolgreich gespeichert!<br>Kundenbeleg wird generiert.",
				timeout: 30,
			});
			if (doPrint) {
				print();
			} else {
				$scope.reset();
			}
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
		// scroll to top
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
});
