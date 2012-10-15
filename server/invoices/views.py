from invoices.models import Invoice, Wine, Category, InvoicePosition
from django.http import QueryDict, HttpRequest, HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from datetime import datetime

def index(request):
    return HttpResponse(open("templates/index.html").read())
    
def submit(request):
    rebate = request.POST["rebate"]
    customer_data = request.POST["customer-data"]
    
    invoice = Invoice(rebate = rebate, customer = customer_data, date = datetime.today())
    invoice.save()
    
    return HttpResponse("Rebate: " + unicode(rebate))
