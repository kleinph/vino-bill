from invoices.models import Invoice, InvoicePosition, Wine, Category
from django.contrib import admin
from django import forms

class InvoicePositionInline(admin.TabularInline):
	model = InvoicePosition
	readonly_fields = ["sum"]
	
class InvoiceAdmin(admin.ModelAdmin):
    fieldsets = [
        ("Allgemein", {"fields" : [("date", "rebate"), "customer"]})
    ]
    inlines = [InvoicePositionInline]
    search_fields = ["customer"]
    date_hierarchy = "date"
    list_display = ("id", "date", "total")

class WineAdmin(admin.ModelAdmin):
    list_filter = ["category"]

admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(Wine, WineAdmin)
admin.site.register(Category)
