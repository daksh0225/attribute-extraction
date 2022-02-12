from django.urls import path
from template_generation import views

urlpatterns = [
	path("", views.home, name="home"),
	path("get_collocs", views.getCollocs, name="getCollocs"),
	path("set_domain", views.setDomain, name="setDomain")
]