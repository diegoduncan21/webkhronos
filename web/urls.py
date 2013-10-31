from django.conf.urls import patterns, include, url


urlpatterns = patterns('',

    # url(r'^$', 'khronos.views.home', name='home'),
    url(r'^$', "web.views.inicio_web", name="inicio_web"),
    url(r'^documentacion/$', "web.views.documentacion", name="documentacion"),
    url(r'^descargas/$', "web.views.descargas", name="descargas"),
    url(r'^acerca_de/$', "web.views.acerca_de", name="acerca_de"),
)
