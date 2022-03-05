from django.urls import path
from template_generation import views
from template_generation.views import *

urlpatterns = [
	path("", ReactView.as_view(), name="something"),
	path("get_collocs", views.getCollocs, name="getCollocs"),
	path("set_domain", views.setDomain, name="setDomain")
]