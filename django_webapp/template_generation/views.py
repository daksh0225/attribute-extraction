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
import spacy
import neuralcoref
import sys
from nltk.tokenize import sent_tokenize
from tqdm.notebook import tqdm
import re
import pandas as pd
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import math
from nltk.collocations import *
from nltk.util import ngrams
from nltk.metrics.association import QuadgramAssocMeasures
import collections
import nltk

nltk.download('punkt')

DATA_ROOT_PATH = "./template_generation/data/"
TEMP_DATA_PATH = "./template_generation/temp"

nlp = spacy.load("en_core_web_sm")
neuralcoref.add_to_pipe(nlp)

class TfIdfProcessor:
	def __init__(self, data):
		self.text = []
		self.attributes = []
		self.data = data
		self.unique_attributes = set()
		self.THRESHOLD = 0.75

		# following data members store the final output
		self.section_stats_for_attributes = {}
		self.section_stats_for_attributeValuePairs = {}
		self.tf_idf = {}
		self.top_k_attributes = []
		self.remaining_attributes = []

	def section_wise_article(self, article):
		# Divides text in each article section wise
		# Here it is assumed that a section starts with '==' and each level of subsection adds more '=' characters
		# For now, we are ignoring subsections and only taking sections into consideration

		MIN_SECTION_LENGTH = 10   # ignore sections that contain less than 10 characters
		
		processed_article = []
		article = article.split("\n")
		section = 'Introduction'
		text = ""
		
		for line in article:
			line = line.strip()
			line = line.replace('\n', '')
			if len(line) < 3:
				continue
			if line[0] == '=' and line[1] == '=' and line[2] == '=':
			# This denotes a subsection. Ignore this
				continue
			if line[0] == '=' and line[1] == '=' and line[2] != '=':
			# This denotes start of new section
				if len(text) >= MIN_SECTION_LENGTH:
					processed_article.append({
						'section': section,
						'text': text 
					})
				line = line.replace('=', '')
				section = line.strip()
				text = ""
			else:
				if text == "":
					text += line
				else:
					text += " " + line
		return processed_article
  
	def preProcessText(self):
		# processing the article text. The data passed as input contains section
		# wise data. Processed text is stored for each article separately. For each
		# article, we go through each section, sentence tokinze that section, and
		# then store all the tokens in each sentence. Each token is lowercased first.
		# Stopwords are removed at this stage. For each token we also store in which
		# section it appeared. This might help later in categorizing attributes into
		# sections
		print('pre processing text...')
		for idx, item in enumerate(self.data):
			cur_article_processed_text = []
			article = self.section_wise_article(item['coref_resolved_unprocessed'])
			for section in article:
				cur_section = section['section']
				cur_section_text = section['text']
				sentences = sent_tokenize(cur_section_text)
				processed_text = (cur_section, [])
				for sentence in sentences:
					sentence_lower_case = sentence.lower()
					processed_text[1].append(sentence_lower_case)
				cur_article_processed_text.append(processed_text)
			self.text.append((idx, item['title'], cur_article_processed_text))

	def preProcessWikidataText(self, key):
		key_processed = re.sub("\(.*?\)", "", key)
		key_processed = key_processed.strip().lower()
		return key_processed

	def preProcessAttributes(self):
		print('pre processing attributes...')
		for item in self.data:
			infobox = item['infobox']
			wikidata = item['wikidata']
			print(infobox)
			# print(wikidata)
		# processing the infobox keys. In the data passed, '_' is used as the 
		# space character, so it is first replaced by space character. Then it is
		# converted to lower case
			if infobox != None:
				for key in infobox.keys():
					try:
						key = key.replace('_', ' ')
						cur_attribute = (key, key.lower().strip())
						if key not in self.unique_attributes:
							print('adding', key)
							self.unique_attributes.add(key)
							self.attributes.append(cur_attribute)
					except:
						pass
		  # processing wikidata keys
			# for key in wikidata.keys():
			# 	try:
			# 		# key_processed = preProcessWikidataText(key)
			# 		key_processed = key
			# 		print('wikidata key', key)
			# 		# key_processed = re.sub("\(.*?\)", "", key)
			# 		# key_processed = key_processed.strip().lower()
			# 		cur_attribute = (key, key_processed)
			# 		if key not in self.unique_attributes:
			# 			print('adding', key)
			# 			self.unique_attributes.add(key)
			# 			self.attributes.append(cur_attribute)
			# 	except:
			# 		pass


	def findAttributeScores(self):
		print('finding tf-idf scores of each attribute and caluculating section stats for each attribute...')
		num_articles = len(self.text)
		print(self.attributes)
		for attribute in self.attributes:
			tf = 0
			df = 1
			section_score = {}
			for article in self.text:
				article_id = article[0]
				article_title = article[1]
				text = article[2]
				found = False
				for section in text:
					section_name = section[0]
					sents = section[1]
					for idx, sent in enumerate(sents):
						if attribute[1] in sent:
							found = True
							tf += 1
							if section_name not in section_score.keys():
								section_score[section_name] = [(article_id, article_title, idx, sent)]
							else:
								section_score[section_name].append((article_id, article_title, idx, sent))
				if found:
					df += 1
			idf = num_articles * math.log10(df)
			self.tf_idf[attribute[0]] = tf*idf
			self.section_stats_for_attributes[attribute[0]] = section_score

	def findAttributeValuePairs(self):
		for attributeName in self.section_stats_for_attributes:
			section_score = {}
			for sectionName in self.section_stats_for_attributes[attributeName]:
				section_score[sectionName] = []
				for sentenceInfo in self.section_stats_for_attributes[attributeName][sectionName]:
					articleIndex = sentenceInfo[0]
					sentence = sentenceInfo[3]
					for wikidataKeys in self.data[articleIndex]['wikidata']:
						if self.preProcessWikidataText(wikidataKeys) == attributeName:
							value = self.preProcessWikidataText(str(self.data[articleIndex]['wikidata'][wikidataKeys]))
							if sentence.find(value)!= -1:
								newSentenceInfo = (*sentenceInfo, value)
								section_score[sectionName].append(newSentenceInfo)
				if len(section_score[sectionName]) == 0:
					section_score.pop(sectionName)
			if bool(section_score):
				print(attributeName)
				self.section_stats_for_attributeValuePairs[self.preProcessWikidataText(attributeName)] = section_score



	# def partition(self):
	#   print('finding top ', self.THRESHOLD * 100, '% attributes')
	#   scores = []
	#   for attribute in tfIdfProcessor.tf_idf.keys():
	#       scores.append((tfIdfProcessor.tf_idf[attribute], attribute))
	#   scores.sort(reverse=True)
	#   top_k = len(scores) * self.THRESHOLD
	#   for i in range(len(scores)):
	#       if i < top_k:
	#           self.top_k_attributes.append(scores[i][1])
	#       else:
	#           self.remaining_attributes.append(scores[i][1])


	def run(self):
		self.preProcessText()
		self.preProcessAttributes()
		self.findAttributeScores()
		self.findAttributeValuePairs()
		# self.partition()

def getAllSents(attribute, data):
	# data = tfIdfProcessor.section_stats_for_attributes[attribute]
	sents = []
	for section, value in data.items():
		for tupl in value:
			sents.append(tupl[3])
	return sents

def getTopKCollocations(attribute, k, data):
	sents = getAllSents(attribute, data)
	q_text = (' ').join(sents)
	q_text = q_text.split(' ')
	creature_filter = lambda *w: attribute not in w
	# ngram_measures = nltk.collocations.TrigramAssocMeasures()
	ngram_measures = QuadgramAssocMeasures()
	# finder = TrigramCollocationFinder.from_words(q_text)
	finder = QuadgramCollocationFinder.from_words(q_text)
	finder.apply_ngram_filter(creature_filter)
	# finder.apply_word_filter(creature_filter)
	collocs = []
	for i, q in enumerate(finder.score_ngrams(ngram_measures.likelihood_ratio)):
		collocs.append(q)
	return collocs

def create_collocations(data):
	tfIdfProcessor = TfIdfProcessor(data)
	tfIdfProcessor.run()

	attribute_collocs = dict()
	print(tfIdfProcessor.section_stats_for_attributes)
	for key in tfIdfProcessor.section_stats_for_attributes.keys():
		print(key)
		k = 5
		collocs = getTopKCollocations(key, k, tfIdfProcessor.section_stats_for_attributes[key])
		attribute_collocs[key] = collocs

	attribute_collocs_dict = dict()

	for key in attribute_collocs.keys():
		collocs = attribute_collocs[key]
		attribute_collocs_dict[key] = collocs

	return attribute_collocs_dict

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
	print(petscan)
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

		if total == 2:
			break
	
	with open(DATA_ROOT_PATH+domain_name+'.json', 'w+') as file:
		json.dump(store, file, indent=4)

	## Coref resolution of every article
	for i in range(len(store)):
		doc = nlp(store[i]["article"])
		store[i]["coref_resolved_unprocessed"] = doc._.coref_resolved

	attribute_collocs = create_collocations(store)
	with open(DATA_ROOT_PATH+domain_name+'.json', 'w+') as file:
		json.dump(attribute_collocs, file, indent=4)

		# if count % 100 == 0:
		#   file = open(save_path, 'w')
		#   file.write(json.dumps(store, indent=4))
		#   file.close()
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