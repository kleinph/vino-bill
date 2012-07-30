# -*- coding: utf8 -*-

from django.db import models
from decimal import Decimal

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
    quantity = models.PositiveIntegerField("Gebinde (ml)")
    price = CurrencyField("Preis", decimal_places = 2, max_digits = 5)
    category = models.ForeignKey(Category, null = True, verbose_name = "Kategorie")
    
    class Meta:
        verbose_name = "Wein"
        verbose_name_plural = "Weine"
        
    def __unicode__(self):
        return self.description

class Invoice(models.Model):
    date = models.DateField("Datum")
    customer = models.TextField("Kundendaten", blank = True)
    rebate = models.PositiveIntegerField("Rabatt (%)")
    invoice_positions = models.ManyToManyField(Wine, through = "InvoicePosition", verbose_name = "Rechnungsposten")

    def _get_total(self):
        total = 0
        for pos in self.invoice_positions.all():
            total += pos.sum
        return sum
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
