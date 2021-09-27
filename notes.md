# Attribute Extraction

## Report To-dos
-	Problem Statement
-	Scope - Input, expected output, expected template
-	Literature Review
-	Domain (TBD)
	-	Research on the basis on infobox sizes, i.e. number of attributes inside the infobox to get a good starting number of attributes
	-	Get the count for number of articles for different domains/categories
	-	Decide on a not so big domain to start off with around 5/10K articles.
-	Ideas
	-	Relation extraction using OpenIE as a sort of attribute extraction baseline
	-	Infobox attribute extraction
	-	Wikidata attribute extraction

## Steps
-	Process article text
-	Find coref clusters, create a set of sentences which contain the coreferences (since, attributes about the person will be in these sentences only)
-	For each sentence, try dependency parsing, openIE
-	Approach attribute extraction as an QA problem.
-	On the generated questions for the coreference sentences, run collocations