from django.db import models

class Invoice(models.Model):
    date = models.DateField(auto_now_add = True, verbose_name = "Datum")
    customer = models.TextField("Kundendaten")
    rebate = models.PositiveIntegerField("Rabatt")
    invoice_postions = models.ManyToMany(InvoicePosition, verbose_name = "Rechnungsposten")
    
    class Meta:
        verbose_name = "Rechnung"
        verbose_name_plural = "Rechnungen"
        
    def __unicode__(self):
        return self.name

class InvoicePosition(models.Model):
    quantity = models.PositiveIntegerField("Anzahl")
    wine = models.OneToMany(Wine, verbose_name = "Wein")
    
    class Meta:
        verbose_name = "Rechnungsposten"
        verbose_name_plural = "Rechnungsposten"
    
    def __unicode__(self):
        return self.name

class Wine(models.Model):
    description = models.CharField(max_length = 20, verbose_name = "Bezeichnung")
    quantity = models.
    price = models.
    
    class Meta:
        verbose_name = "Wein"
        verbose_name_plural = "Weine"
        
    def __unicode__(self):
        return self.name
