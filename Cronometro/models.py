from django.db import models

from django.contrib.auth.models import User

# Create your models here.

class Proyectos(models.Model):
	nombre = models.CharField(max_length=128)
	descripcion = models.TextField(null=True, blank=True)
	inicio = models.DateTimeField(auto_now_add=True)
	fin = models.DateTimeField(null=True, blank=True)
	terminado = models.BooleanField(default=False)
	usuario = models.ForeignKey(User)

	class Meta:
		verbose_name_plural = "Proyectos"
	
	def __unicode__(self):
		return self.nombre+" - "+str(self.inicio)


class Tareas(models.Model):
	proyecto = models.ForeignKey(Proyectos)
	nombre = models.CharField(max_length=128)
	descripcion = models.TextField(null=True, blank=True)
	inicio = models.DateTimeField(auto_now_add=True)
	fin = models.DateTimeField(blank=True, null=True)
	terminado = models.BooleanField(default=False)
	
	class Meta:
		verbose_name_plural = "Tareas"
		unique_together = ("nombre", "proyecto")
		
	def __unicode__(self):
		return "tarea: %s - proyecto: %s" % (self.nombre, self.proyecto.nombre)


class Intervalos(models.Model):
	tarea = models.ForeignKey(Tareas)
	descripcion = models.TextField(null=True, blank=True)
	inicio = models.DateTimeField(auto_now_add=True)
	fin = models.DateTimeField(blank=True, null=True)
	duracion = models.IntegerField(blank=True, null=True)

	class Meta:
		verbose_name_plural = "Intervalos"
		
	def __unicode__(self):
		return "tarea: %s - inicio: %s - fin: %s" % (self.tarea.nombre, self.inicio, self.fin) 

class Settings(models.Model):
	usuario = models.ForeignKey(User)
	clave = models.CharField(max_length=100)
	valor = models.CharField(max_length=200)

	class Meta:
		verbose_name_plural = "Settings"



class JSQuerySets(object):

	@classmethod
	def save_settings(cls, settings, user):
		for key in settings:
			s = Settings.objects.get(usuario=user, clave=key)
			s.valor = settings[key]
			print s.valor
			s.save()
	
	@classmethod
	def get_user_settings(cls, user):
		sett = {}
		for s in Settings.objects.filter(usuario=user):
			sett[s.clave] = s.valor
		return sett
	
	@classmethod
	def get_activitie_intervals(cls, activitie_id):
		a = Tareas.objects.get(pk=activitie_id)
		intervals = []
		for i in Intervalos.objects.filter(tarea=a):
			if i.fin:
				intervals.append({
					'id' : i.id,
					'duracion' : i.duracion,
					'inicio' : str(i.inicio),
					'fin' : str(i.fin) if i.fin else None,
				})
		return intervals
	
	@classmethod
	def search_project_activities(cls, key, p_id):
		sr = []
		p = Proyectos.objects.get(pk=p_id)
		for a in Tareas.objects.filter(nombre__startswith=key, proyecto=p):
			sr.append({
				'id':a.id,
				'nombre':a.nombre
			})
		return sr
	
	@classmethod
	def get_project_activities(cls, project):
		pa = []
		for a in Tareas.objects.filter(proyecto=project):
			pa.append({
				'id':a.id,
				'nombre':a.nombre,
			})
		return pa
	
	@classmethod
	def get_user_projects(cls, user):
		up = []
		for p in Proyectos.objects.filter(usuario=user).order_by('inicio'):
			up.append({
				'id' : p.id,
				'nombre' : p.nombre
			})
		return up
	
	@classmethod
	def search_user_projects(cls, user, key):
		sr = []
		for p in Proyectos.objects.filter(usuario=user, nombre__startswith=key):
			sr.append({
				'nombre' : p.nombre,
				'id' : p.id
			})
		return sr
