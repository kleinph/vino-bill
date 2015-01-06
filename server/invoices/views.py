from xhtml2pdf import pisa
from os.path import isfile, join
import subprocess
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
    return HttpResponse(open(join(settings.SITE_ROOT, "assets/index.html")).read())

def pdf(request, invoice_id):
    invoice = Invoice.objects.get(id = invoice_id)
    html = get_template("print.html").render(Context({"invoice": invoice}))
    filename = get_invoice_filename(invoice_id)
    
    out = file(filename, "wb")
    pdf = pisa.CreatePDF(html, out, link_callback = fetch_resources)
    out.close()
    
    if not pdf.err:
      return HttpResponse(open(filename, "rb"), content_type = "application/pdf")
    return HttpResponseServerError("Error rendering pdf<pre>%s</pre>" % escape(html))
    # TODO delete file if generation was unsuccessful

def print_invoice(request, invoice_id):   
    filename = get_invoice_filename(invoice_id)
   
    # check if invoice pdf exists and generate it otherwise
    if not isfile(filename):
      pdf(request, invoice_id)
      
    #print pdf
    try:
      output = subprocess.check_output(["lp", filename])
      return HttpResponse(output)
    except CalledProcessError as e:
      return HttpResponseServerError(output)

def get_invoice_filename(invoice_id):
    return join(settings.INVOICE_DIR, settings.INVOICE_PREFIX + settings.INVOICE_ID_PREFIX + invoice_id + ".pdf")
