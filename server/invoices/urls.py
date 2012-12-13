from django.conf.urls import patterns, include, url

urlpatterns = patterns("invoices.views",
    url(r"^pdf/(\d+)", "pdf"),
    url(r"^print/(\d+)", "print_invoice"),
    url(r"^", "index"),
)
