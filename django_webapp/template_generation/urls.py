from django.urls import path
from template_generation import views
from template_generation.views import *

urlpatterns = [
	path("", views.get_domain_names, name="something"),
	path("get_collocs/<str:domain_name>", views.get_collocs, name="getCollocs"),
	path("set_domain", views.setDomain, name="setDomain")
]