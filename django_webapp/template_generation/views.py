# from django.shortcuts import render

# # Create your views here.
from django.http import HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt

obj = []
with open('superheroes_attribute_collocs.json', 'r') as file:
	obj = json.load(file)

def home(request):
	attributes = list(obj.keys())
	return HttpResponse(json.dumps(attributes, indent=4))

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