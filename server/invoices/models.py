# -*- coding: utf8 -*-

from django.db import models
from decimal import Decimal
from server import settings

class CurrencyField(models.DecimalField):
    __metaclass__ = models.SubfieldBase

    def to_python(self, value):
        try:
           return super(CurrencyField, self).to_python(value).quantize(Decimal("0.01"))
        except AttributeError:
           return None

class Category(models.Model):
    name = models.CharField(max_length = 20)
    
    class Meta:
        verbose_name = "Kategorie"
        verbose_name_plural = "Kategorien"
    
    def __unicode__(self):
        return self.name

class Wine(models.Model):
    description = models.CharField("Bezeichnung", max_length = 30)
    volume = models.PositiveIntegerField("Gebinde (ml)", default = 750)
    price = CurrencyField("Preis", decimal_places = 2, max_digits = 5)
    category = models.ForeignKey(Category, blank = True, null = True, verbose_name = "Kategorie")
    
    class Meta:
        verbose_name = "Wein"
        verbose_name_plural = "Weine"
        
    def __unicode__(self):
        return self.description
        
    def _get_volume_in_l(self):
        return float(self.volume / 1000.0)
    volume_in_l = property(_get_volume_in_l)

class Invoice(models.Model):
    date = models.DateField("Datum")
    customer = models.TextField("Kundendaten", blank = True)
    rebate = models.PositiveIntegerField("Rabatt (%)")
    invoice_positions = models.ManyToManyField(Wine, through = "InvoicePosition", verbose_name = "Rechnungsposten")
    ust = settings.UST

    def _get_sum(self):
        total = 0
        for pos in self.invoiceposition_set.all():
            total += pos.sum
        return total
    sum = property(_get_sum)
    
    def _get_rebate_amount(self):
        return self.sum * self.rebate / 100
    rebate_amount = property(_get_rebate_amount)
    
    def _get_ust_amount(self):
        return round(self.sum / (100 + self.ust) * self.ust, 2)
    ust_amount = property(_get_ust_amount)
    
    def _get_total(self):
        return self.sum * (100 - self.rebate) / 100
    total = property(_get_total)

    class Meta:
        verbose_name = "Rechnung"
        verbose_name_plural = "Rechnungen"

    def __unicode__(self):
        return unicode(self.id)

class InvoicePosition(models.Model):
    quantity = models.IntegerField("Anzahl")
    wine = models.ForeignKey(Wine, verbose_name = "Wein")
    invoice = models.ForeignKey(Invoice)
    
    def _get_sum(self):
        return self.wine.price * self.quantity
    sum = property(_get_sum)
    
    class Meta:
        verbose_name = "Rechnungsposten"
        verbose_name_plural = "Rechnungsposten"
    
    def __unicode__(self):
        return u"{quantity} x {name} - € {sum}".format(quantity = self.quantity, name = self.wine, sum = self.sum)
