# from django.shortcuts import render

# # Create your views here.
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import os

from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *

DATA_ROOT_PATH = "./template_generation/data/"
@csrf_exempt 
def get_domain_names(request):

	"""
	Retrieve all the domain names. All the files present in data folder are assumend to be files corresponding to differnet domains.
	File name is assumed to be the domain name.
	"""
	domains = []
	try:
		for file in os.listdir(DATA_ROOT_PATH):
			domain_name = file.split('.')[0]
			domains.append(domain_name)
	except all:
		return HttpResponse(status=404)
	return HttpResponse(json.dumps(domains, indent = 4))

@csrf_exempt 
def setDomain(request):
	global obj
	domain = request.POST['domain']
	file_path = domain+"_attribute_collocs.json"
	with open(file_path, 'r') as file:
		obj = json.load(file)
	return HttpResponse("domain changed to "+domain)

@csrf_exempt
def get_collocs(request, domain_name):
	file_path = DATA_ROOT_PATH + domain_name + ".json"

	try:
		obj_top_collocs = {}
		with open(file_path, 'r') as file:
			obj = json.load(file)
		for attribute in obj.keys():
			obj_top_collocs[attribute] = obj[attribute][:5]
		return HttpResponse(json.dumps(obj_top_collocs, indent = 4))
	except all:
		return HttpResponse("Invalid domain name")


class ReactView(APIView):
    
    serializer_class = ReactSerializer
  
    def get(self, request):
        detail = [ {"name": detail.name,"detail": detail.detail} 
        for detail in React.objects.all()]
        return Response(detail)
  
    def post(self, request):
  
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)