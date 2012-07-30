from invoices.models import Invoice, Wine, Category, InvoicePosition
from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response

def index(request):
    category_list = Category.objects.all()
    wine_list = Wine.objects.all()
    return render_to_response("index.html", {"categories": category_list, "wines": wine_list}, 
        context_instance = RequestContext(request))
    
def submit(request):
    return HttpResponse("Submit")
