from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from invoices.models import Category, Wine, Invoice, InvoicePosition
from pretty_json_serializer import PrettyJSONSerializer

class WineResource(ModelResource):
    category = fields.ToOneField("api.api.CategoryResource", "category", null = True)
    
    class Meta:
        queryset = Wine.objects.all()
        serializer = PrettyJSONSerializer()
        
class CategoryResource(ModelResource):
    wines = fields.ToManyField(WineResource, "wine_set", full = True)

    class Meta:
        queryset = Category.objects.all()
        serializer = PrettyJSONSerializer()

class InvoicePositionResource(ModelResource):
    wine = fields.ToOneField(WineResource, "wine")
    invoice = fields.ToOneField("api.api.InvoiceResource", "invoice")
    
    class Meta:
        queryset = InvoicePosition.objects.all()
        authorization = Authorization()
        serializer = PrettyJSONSerializer()
        
class InvoiceResource(ModelResource):
    items = fields.ToManyField(InvoicePositionResource, "invoiceposition_set")
    
    class Meta:
        queryset = Invoice.objects.all()
        serializer = PrettyJSONSerializer()
        authorization = Authorization()
