from django.conf.urls import patterns, url, include
from tastypie.api import Api
from api import CategoryResource, WineResource, InvoiceResource, InvoicePositionResource

api_v1 = Api(api_name = "v1")
api_v1.register(CategoryResource())
api_v1.register(WineResource())
api_v1.register(InvoiceResource())
api_v1.register(InvoicePositionResource())

urlpatterns = patterns("",
    url(r"^", include(api_v1.urls)),
)
