invoiceApp.service("InvoiceService", function(Category, Invoice, PrintService) {
	var self = this;
	var itemsLookup = {};
	this.items = [];
	this.rebate = 0;
	this.customer = "";
	
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
	
	// retrive data from REST api
	Category.query({}, function(data) {
		self.categories = data.objects;
	}, function(data){
		self.categories = [];
	});
	
	this.updateItem = function(wine, quantity) {
		idx = itemsLookup[wine.id];
		
		if (quantity === 0) {
			self.items.splice(idx, 1);
			delete itemsLookup[wine.id];
		} else {
			if (isNaN(idx)) {
				itemsLookup[wine.id] = self.items.length;
				self.items.push(new item(wine, quantity));
			} else {
				self.items[idx].quantity = quantity;
			}
		}
	};
	
	this.sum = function() {
		var sum = 0;
		
		for (var i in self.items) {
			sum += self.items[i].sum();
		}
		return sum;
	};
	
	this.rebateInEuro = function() {
		return self.sum() * (self.rebate / 100);
	};
	
	this.total = function() {
		return self.sum() - self.rebateInEuro();
	};
	
	this.submit = function(success, error) {
		var items = [];
		
		for (var i in self.items) {
			items.push({
				quantity: self.items[i].quantity,
				wine: self.items[i].wine.resource_uri
			});
		}
		
		Invoice.create({}, {
			items: items,
			date: new Date(),
			rebate: self.rebate,
			customer: self.customer
		}, function(data, headers) {
			self.id = headers("Location").split("/").pop();
			success(data, headers);
		}, function(data, headers) {
			error(data, headers);
		});
	};
	
	this.print = function(success, error) {
		PrintService.print({id: self.id}, {}, function(data, headers) {
			success(data, headers);
		}, function(data, headers) {
			error(data, headers);
		});
	};
	
	this.reset = function() {
		itemsLookup = {};
		self.items = [];
		self.rebate = 0;
		self.customer = "";
		self.id = "";
	};
});