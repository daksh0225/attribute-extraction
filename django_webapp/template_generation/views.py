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


@csrf_exempt 
def getDomainNames(request):

	"""
	Retrieve all the domain names. All the files present in data folder are assumend to be files corresponding to differnet domains.
	File name is assumed to be the domain name.
	"""
	domains = []
	try:
		for file in os.listdir("./template_generation/data"):
			domain_name = file.split('.')[0]
			domains.append(domain_name)
	except all:
		return HttpResponse(status=404)
	print(domains)
	return HttpResponse(json.dumps(domains, indent=4))

@csrf_exempt 
def setDomain(request):
	global obj
	domain = request.POST['domain']
	file_path = domain+"_attribute_collocs.json"
	with open(file_path, 'r') as file:
		obj = json.load(file)
	return HttpResponse("domain changed to "+domain)

@csrf_exempt
def getCollocs(request):
	attribute = request.POST['attribute']
	if attribute in obj:
		collocsTopFive = obj[attribute][:5]
		return HttpResponse(json.dumps(collocsTopFive))
	else:
		return HttpResponse("Invalid attribute")


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