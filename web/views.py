# -*- encoding: utf-8 -*-
from django.http import HttpResponse
from models import Aplicacion
from django.shortcuts import render_to_response
from django.template.context import RequestContext

def inicio_web(request):
    try:
        ultima_app=Aplicacion.objects.latest("id")
    except:
        ultima_app=""
    return render_to_response("inicio.html",
                              {"ultima_app":ultima_app,
                               "url_solapa_seleccionada": request.path,},
                              context_instance = RequestContext(request))
    
def documentacion (request):
    return render_to_response("documentacion.html",
                              {"url_solapa_seleccionada": request.path,},                                                   
                               context_instance = RequestContext(request))

def descargas (request):
    programas = Aplicacion.objects.all()
    return render_to_response("descargas.html",
                              {"programas":programas, 
                               "url_solapa_seleccionada": request.path,},
                              context_instance= RequestContext(request))

def acerca_de(request):
    return render_to_response("acerca_de.html",
                              {"url_solapa_seleccionada": request.path,},
                              context_instance=RequestContext(request))