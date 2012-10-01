from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from invoices.models import Category, Wine, Invoice, InvoicePosition
from pretty_json_serializer import PrettyJSONSerializer

class WineResource(ModelResource):
    category = fields.ToOneField("api.api.CategoryResource", "category", full = True, null = True)
    
    class Meta:
        queryset = Wine.objects.all()
        serializer = PrettyJSONSerializer()
        
class CategoryResource(ModelResource):
    wines = fields.ToManyField(WineResource, "wine_set")

    class Meta:
        queryset = Category.objects.all()
        
class InvoiceResource(ModelResource):
    class Meta:
        queryset = Invoice.objects.all()
        authorization = Authorization()
        
class InvoicePositionResource(ModelResource):
    class Meta:
        queryset = InvoicePosition.objects.all()
        authorization = Authorization()
