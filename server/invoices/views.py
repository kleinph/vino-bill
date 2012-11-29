from xhtml2pdf import pisa
from os.path import join
from server import settings
from invoices.models import Invoice
from django.http import HttpResponse, HttpResponseServerError
from django.template import Context
from django.template.loader import get_template
from cgi import escape

def fetch_resources(uri, rel):
   """
   Callback to allow pisa/reportlab to retrieve Images,Stylesheets, etc.
   `uri` is the href attribute from the html link element.
   `rel` gives a relative path, but it's not used here.
   """
   return join(settings.STATICFILES_DIRS[0], uri.replace(settings.STATIC_URL, ""))

def index(request):
    return HttpResponse(open("templates/index.html").read())

def pdf(request, invoice_id):
    invoice = Invoice.objects.get(id = invoice_id)
    html = get_template("print.html").render(Context({"invoice": invoice}))
    filename = join(settings.INVOICE_DIR, settings.INVOICE_PREFIX + settings.INVOICE_ID_PREFIX + invoice_id + ".pdf")
    
    out = file(filename, "wb")
    pdf = pisa.CreatePDF(html, out, link_callback = fetch_resources)
    out.close()
    
    if not pdf.err:
      return HttpResponse()
      #return HttpResponse(open(filename, "rb"), mimetype = "application/pdf")
    return HttpResponseServerError("Error rendering pdf<pre>%s</pre>" % escape(html))
   # TODO delete file if generation was unsuccessful

def print_invoice(request, invoice_id):
   # TODO send invoice to default printer
   # at the moment this view is more a debugging tool
    invoice = Invoice.objects.get(id = invoice_id)
    template = get_template("print.html")
    html = template.render(Context({"invoice": invoice}))
    return HttpResponse(html)
