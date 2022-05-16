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
import requests
from tqdm import tqdm
import wptools
import wikipedia

DATA_ROOT_PATH = "./template_generation/data/"
TEMP_DATA_PATH = "./template_generation/temp"
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
def add_domain(request, domain_name):
	print('adding new domain')
	petscan = requests.get('https://petscan.wmflabs.org/?max_sitelink_count=&categories=' + domain_name + '&depth=1&project=wikipedia&language=en&cb_labels_yes_l=1&edits%5Bflagged%5D=both&edits%5Bbots%5D=both&cb_labels_any_l=1&cb_labels_no_l=1&format=json&interface_language=en&edits%5Banons%5D=both&ns%5B0%5D=1&&doit=').json()
	save_path = TEMP_DATA_PATH + domain_name + ".json"
	store = []
	total = 0
	count = 0
	missing_article_text = 0
	missing_infobox_entries = 0
	missing_wikidata_entries = 0
	for page in tqdm(petscan['*'][0]['a']['*']):
		infobox = ""
		wikidata = ""
		article = ""

		title = page['title'].replace('_', ' ')
		page = wptools.page(title)
		fela = page.get_parse()

		try:
			page.get_wikidata()
			wikidata = page.data['wikidata']
		except:
			missing_wikidata_entries += 1
		
		try:
			infobox = fela.data['infobox']
		except:
			missing_infobox_entries += 1

		try:
			main_article = wikipedia.page(title)
			article = main_article.content
		except:
			missing_article_text += 1

		current_data = {
			'title': title,
			'infobox': infobox,
			'wikidata': wikidata,
			'article': article,
		}
		store.append(current_data)
		total += 1
		
		if count % 100 == 0:
			file = open(save_path, 'w')
			file.write(json.dumps(store, indent=4))
			file.close()
	return HttpResponse("domain changed to "+domain_name)
@csrf_exempt
def get_collocs(request, domain_name):
	file_path = DATA_ROOT_PATH + domain_name + ".json"

	try:
		obj_top_collocs = {}
		with open(file_path, 'r') as file:
			obj = json.load(file)
		for attribute in obj.keys():
			if len(obj[attribute]) >= 5:
				obj_top_collocs[attribute] = obj[attribute][:5]
			elif len(obj[attribute]) > 0:
				obj_top_collocs[attribute] = obj[attribute]
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