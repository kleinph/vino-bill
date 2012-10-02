from django.conf.urls import patterns, include, url

urlpatterns = patterns("invoices.views",
    url(r"^$", "index"),
    url(r"angular$", "angular"),
)
