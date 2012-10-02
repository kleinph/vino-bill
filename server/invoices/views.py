from invoices.models import Invoice, Wine, Category, InvoicePosition
from django.http import QueryDict, HttpRequest, HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from datetime import datetime

def index(request):
    category_list = Category.objects.all()
    wine_list = Wine.objects.order_by("description")
    return render_to_response("index.html", {"categories": category_list, "wines": wine_list}, 
        context_instance = RequestContext(request))
    
def angular(request):
    return HttpResponse(open("templates/angular.html").read())
    
def submit(request):
    rebate = request.POST["rebate"]
    customer_data = request.POST["customer-data"]
    
    invoice = Invoice(rebate = rebate, customer = customer_data, date = datetime.today())
    invoice.save()
    
    return HttpResponse("Rebate: " + unicode(rebate))
