import spacy
import neuralcoref
from tqdm import tqdm
import json
import sys

nlp = spacy.load("en_core_web_sm")
neuralcoref.add_to_pipe(nlp)
category = sys.argv[2]

file = open(sys.argv[1]+"/"+category+"_data.json")
json_data = json.load(file)
file.close()

count = 0

for i in tqdm(range(len(json_data))):
	doc = nlp(json_data[i]["article"])
	json_data[i]["coref_resolved_unprocessed"] = doc._.coref_resolved
	if count%100 == 0:
		file = open("./coref_resolved/"+category+"_coref_resolved_unprocessed_data.json", "w+")
		json.dump(json_data, file, indent=4)
		file.close()
	count += 1
	file = open("./coref_resolved/"+category+"_coref_resolved_unprocessed_data.json", "w+")
	json.dump(json_data, file, indent=4)
	file.close()