# -*- coding: utf-8 -*-

from django.db import models
# Create your models heres.

class Aplicacion (models.Model):
    version=models.CharField(max_length=10)
    archivo32=models.URLField(max_length=150)
    archivo64=models.URLField(max_length=150)
    descripcion=models.TextField()
    fecha_publicacion=models.DateField(auto_now_add=True)

    
    
    def __unicode__(self):
        return "%s - %s" %(self.version,self.fecha_publicacion)
    
