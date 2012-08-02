from invoices.models import Invoice, Wine, Category, InvoicePosition
from django.http import QueryDict
from django.http import HttpRequest
from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response

def index(request):
    category_list = Category.objects.all()
    wine_list = Wine.objects.order_by("description")
    return render_to_response("index.html", {"categories": category_list, "wines": wine_list}, 
        context_instance = RequestContext(request))
    
def submit(request):
    rebate = request.POST["rebate"]
    return HttpResponse("Rebate: " + unicode(rebate))
