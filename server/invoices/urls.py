from django.conf.urls import patterns, url

urlpatterns = patterns("invoices.views",
    url(r"^$", "index"),
    url(r"^submit/$", "submit")
)
