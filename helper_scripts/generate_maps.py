#!/usr/bin/python3

import urllib.request
import json

def guess_level(name, site):
	res_split = name.split('-')

	if (len(res_split) == 3):
		# It's a computer! Well probably anyway.
		return res_split[1]

	# Now we're not sure. Ask the user!
	return input("What level is resource [" + name + "] in [" + site + "] located?")

def generate_filename(site, level):
	level = str(level)
	
	if level.isnumeric():
		level = level.zfill(2)
	else:
		level = level.lower()

	site = site.lower()

	return site + '_' + level + '.png'
		

url = 'https://bookit.unimelb.edu.au/MyPC/Front.aspx?page=getResourceStatesAPI'
req = urllib.request.urlopen(url)

encoding = req.headers.get_content_charset()
obj = json.loads(req.read().decode(encoding))

for site in obj:
	site_data = {
		"info":      {},
		"levels":    {},
		"resources": {}
	}

	level_count = 0

	site_id = site["id"]
	site_name = site["name"]
	locations = site["locations"]

	site_data["info"] = {
		"id":   site_id,
		"name": site_name
	}

	for location in locations:
		loc_id = location["id"]
		loc_name = location["name"]
		resources = location["resources"]

		for resource in resources:
			res_id = resource["id"]
			res_name = resource["name"]
			res_state = resource["state"]

			level = guess_level(res_name, site_name)

			if not level_count in site_data["levels"].keys():
				site_data["levels"][level_count] = {}

			site_data["levels"][level_count]["name"] = level
			site_data["levels"][level_count]["filename"] = generate_filename(site_name, level)

			site_data["resources"][res_name] = {
				"x":     0,
				"y":     0,
				"level": level_count
			}

	filename = site_name.lower() + '.json'
	print("Saving to " + filename)

	f = open(filename, 'w')
	f.write(json.dumps(site_data, indent=4, sort_keys=True))
	f.close()
