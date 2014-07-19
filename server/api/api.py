from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from invoices.models import Category, Wine, Invoice, InvoicePosition
from pretty_json_serializer import PrettyJSONSerializer

class WineResource(ModelResource):
    category = fields.ToOneField("api.api.CategoryResource", "category", related_name = "wines", null = True)
    
    class Meta:
        queryset = Wine.objects.all()
        serializer = PrettyJSONSerializer()
        
class CategoryResource(ModelResource):
    wines = fields.ToManyField(WineResource, "wine_set", related_name = "category", full = True)

    class Meta:
        queryset = Category.objects.all()
        serializer = PrettyJSONSerializer()

class InvoicePositionResource(ModelResource):
    invoice = fields.ToOneField("api.api.InvoiceResource", "invoice", related_name = "items")
    wine = fields.ToOneField(WineResource, "wine")
    
    class Meta:
        queryset = InvoicePosition.objects.all()
        authorization = Authorization()
        serializer = PrettyJSONSerializer()
        
class InvoiceResource(ModelResource):
    pretty_id = fields.CharField(attribute = "_get_pretty_id", readonly = True)
    sum = fields.DecimalField(attribute = "_get_sum", readonly = True)
    rebate_amount = fields.DecimalField(attribute = "_get_rebate_amount", readonly = True)
    ust_amount = fields.DecimalField(attribute = "_get_ust_amount", readonly = True)
    total = fields.DecimalField(attribute = "_get_total", readonly = True)
    items = fields.ToManyField(InvoicePositionResource, "invoiceposition_set", related_name = "invoice")
    
    class Meta:
        queryset = Invoice.objects.all()
        serializer = PrettyJSONSerializer()
        authorization = Authorization()
