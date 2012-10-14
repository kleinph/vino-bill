angular.module("invoiceServices", ["ngResource"]).
	factory("Category", function($resource) {
		return $resource("/api/v1/category/:id", {},
			{query: {method: "GET", isArray: false}}
		);
	}
).factory("Wine", function($resource) {
		return $resource("/api/v1/wine/:id", {},
			{query: {method: "GET", isArray: false}}
		);
	}
).factory("Invoice", function($resource) {
		return $resource("api/v1/invoice/:id", {},
			{query: {method: "GET", isArray: false}}
		);
	}
);
