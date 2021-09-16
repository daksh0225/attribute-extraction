import wptools
import wikipedia
from tqdm import tqdm
import json
import sys

store = []
total = 0
categories = [sys.argv[1]]
for category in categories:

	file_path = './Categories/' + category + '.json'
	file = open(file_path, 'r')
	cummulative_infobox_size = 0
	infobox_properties = set()
	for line in file:
		data = json.loads(line)
		break

	missing_wikidata_entries = 0
	missing_infobox_entries = 0
	missing_article_text = 0

	count = 0
	save_path = category + '_data.json'

	for page in tqdm(data['*'][0]['a']['*']):
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

	file = open(save_path, 'w+')
	file.write(json.dumps(store, indent=4))
	file.close()

	print("=" * 30)
	print('Category:', category)
	print('number of articles:', total)
	print('entries for which infobox was not found:', missing_infobox_entries)
	print('entries for which wikidata was not found:', missing_wikidata_entries)
	print('entries for which text was not found:', missing_article_text)