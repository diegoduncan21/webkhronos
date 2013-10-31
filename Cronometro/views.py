from django.shortcuts import render_to_response

from django.forms import EmailField
from django.template import RequestContext
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login as djlogin, logout
from django.contrib.auth.models import User
from json import dumps

from forms import ProyectoForm, UserCreateForm
from models import Proyectos, JSQuerySets, Tareas, Intervalos, Settings

from datetime import datetime

def js(content):
	return HttpResponse(dumps(content))

def is_loged_in(request):
	if request.user.is_authenticated():
		return js({'user':request.user.username})
	else:
		return js(False)

def save_settings(request):
	JSQuerySets.save_settings(request.GET, request.user)
	return js(True)

def get_user_settings(request):
	return js(JSQuerySets.get_user_settings(request.user))

def get_activitie_intervals(request):
	return js(JSQuerySets.get_activitie_intervals(request.GET['activitie_id']))

def cron_play(request):
	a = Tareas.objects.get(pk=request.GET['activitie_id'])
	i = Intervalos()
	i.tarea = a
	i.save()
	return js({
		'id' : i.id
	})

def cron_stop(request):
	i = Intervalos.objects.get(pk=request.GET['interval_id'])
	i.duracion = request.GET['interval_duration']
	i.fin = datetime.now()
	i.save()
	return js({
		'id' : i.id,
		'inicio' : str(i.inicio),
		'fin' : str(i.fin)
	})

def activitie_details_panel(request, activitie_id):
	a = Tareas.objects.get(pk=activitie_id)
	intervalos = Intervalos.objects.filter(tarea=a)
	return render_to_response('activitie_details_panel.html',
		{'activitie': a,
		 'project' : a.proyecto,
		 'intervalos': intervalos},
		context_instance=RequestContext(request))
		
def search_project_activities(request):
	key = request.GET['key']
	p_id = request.GET['project_id']
	return js(JSQuerySets.search_project_activities(key,p_id))

def add_activitie(request):
	nombre = request.GET['nombre']
	project_id = request.GET['project_id']
	p = Proyectos.objects.get(pk=project_id)
	duplicated = Tareas.objects.filter(nombre=nombre, proyecto=p)
	if not duplicated:
		a = Tareas()
		a.proyecto = p
		a.nombre = nombre
		a.save()
		return js({'id':a.id,'nombre':a.nombre})
	else:
		return js({'duplicated_activitie':True})
	

def get_project_activities(request, project_id):
	p = Proyectos.objects.get(pk=project_id)
	return js(JSQuerySets.get_project_activities(p))

def get_user_projects(request):
	return js(JSQuerySets.get_user_projects(request.user))
	
def search_user_projects(request):
	return js(JSQuerySets.search_user_projects(request.user, request.GET['key']))
	

def add_project(request):
	nombre = request.GET.get('nombre')
	if nombre:
		duplicated = Proyectos.objects.filter(nombre=nombre,usuario=request.user)
		if duplicated:
			return js({'duplicated_proyect':True})
		p = Proyectos()
		p.nombre = nombre
		p.usuario = request.user
		p.save()
		return js({'id':p.id, 'nombre':nombre})
	return js("")

def activitie_panel(request,project_id):
	project = Proyectos.objects.get(pk=project_id)
	return render_to_response('activitie_panel.html',
		{'project':project},
		context_instance=RequestContext(request))

def project_panel(request):
	return render_to_response('project_panel.html', context_instance=RequestContext(request))

def main_panel(request):
	return render_to_response('main_panel.html',
								context_instance=RequestContext(request))

def login(request):
	if request.GET.get('user'):
		username = request.GET['user']
		password = request.GET['pass']
		user = authenticate(username=username, password=password)
		if user is not None:
			if user.is_active:
				djlogin(request, user)
				return js({'user':username})
		return js(False)
	return render_to_response('login.html', context_instance=RequestContext(request))

def salir(request):
	logout(request)
	return HttpResponseRedirect('/cron/login/')

def proyectos_crear(request):
	
	form = ProyectoForm()
	return render_to_response('proyectos/crear.html',
								{'proyecto_form' : form },
								context_instance=RequestContext(request))

def register(request):
	if request.GET.get('username'):
		username = request.GET['username']
		password = request.GET['password1']
		email = request.GET['email']
		data = {}
		if User.objects.filter(username=username):
			data['invalid_user']=True
		if User.objects.filter(email=email):
			data['invalid_email']=True
		if (not data.get('invalid_user') and (not data.get('invalid_email'))):
			user = User.objects.create_user(username, request.GET['email'], password)
			user.save()
			
			sett = Settings()
			sett.usuario = user;
			sett.clave = "tooltips"
			sett.valor = "true"
			sett.save()
			
			user = authenticate(username=username, password=password)
			if user is not None:
				if user.is_active:
					djlogin(request, user)
					data['user']=username
		return js(data)

	return render_to_response('registrar.html',
								context_instance=RequestContext(request))

def inicio(request):
	return render_to_response('inicio.html', context_instance=RequestContext(request))

