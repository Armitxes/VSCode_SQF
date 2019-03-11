# -*- coding: utf-8 -*-
# Written by Armitxes (Jan Brodersen)
# All rights reserved. For more information visit https://armitxes.net

import os
import json
import re

biWiki = json.load(open('./env/shared/commands/sqfCommands.min.json'))

# Review Levels:
# 	1 -> Corrected by wikiCorrector, has issues
#	2 -> Corrected by wikiCorrector, has no issues
#	3 -> Corrected by a dev / contributor, has issues
#	4 -> Corrected by a dev / contributor, has no issues

# Statistics
cmdStats = {
	'total': 0,
	'levels': {1:0, 2:0, 3:0, 4:0},
	'versions': {

	}
}

def update_stats(version, level):
	if version not in cmdStats['versions']:
		cmdStats['versions'][version] = {
			'total': 0,
			'levels': {1:0, 2:0, 3:0, 4:0},
		}

	cmdStats['total'] += 1
	cmdStats['levels'][level] += 1
	cmdStats['versions'][version]['total'] +=1
	cmdStats['versions'][version]['levels'][level] +=1

def print_stats():
	print(
		'\n---------------------------------\n',
		'Total Commands:', cmdStats['total'],
		'\n  - Level 1:', cmdStats['levels'][1],
		'\n  - Level 2:', cmdStats['levels'][2],
		'\n  - Level 3:', cmdStats['levels'][3],
		'\n  - Level 4:', cmdStats['levels'][4],
		'\n---------------------------------\n'
	)

	for version in sorted(cmdStats['versions']):
		print(
			'\nTotal', version, 'Commands:', cmdStats['versions'][version]['total'],
			'\n  - L1:', cmdStats['versions'][version]['levels'][1],
			'| L2:', cmdStats['versions'][version]['levels'][2],
			'| L3:', cmdStats['versions'][version]['levels'][3],
			'| L4:', cmdStats['versions'][version]['levels'][4],
		)

for version in biWiki:
	ver = biWiki[version]

	for command in biWiki[version]:
		cmd = ver[command]
		reviewLevel = cmd.get('reviewLevel', 0)

		if reviewLevel > 2:
			update_stats(version, reviewLevel)
			continue

		docSyntax = cmd.get('docSyntax')
		if docSyntax:
			docSyntax = docSyntax.replace(', ', ',')
			docSyntax = re.sub(r'(?i)\b(\\\"[A-Za-z0-9_ \t]*\\\"|boardName|weapon|taskName|magazine|name|string|text|subject|skillName|texture|markerName|soundName)\b', '<string>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(object|obj|target)\b', '<object>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(unit|player|person|unitName|killer|killed|member|anObject)\b', '<objUnit>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(vehicle|car|cargo)\b', '<objVehicle>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(grp|group)\b', '<objGroup>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(item)\b', '<objItem>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(map)\b', '<objMap>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(side)\b', '<objSide>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(task)\b', '<objTask>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(trigger)\b', '<objTrigger>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(curatorObj)\b', '<objCurator>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(camera)\b', '<objCamera>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(code)\b', '<code>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(bool|boolean|true|false|enabled|enable|locked)\b', '<bool>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(idc|index|objectId|delay|distance|damage|ownerID|points|value|n|id|order|coef|row|column|scale|speed|altitude|color|number|time|zoom)\b', '<scalar>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(control|ctrl)\b', '<uiControl>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(display)\b', '<uiDisplay>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(configClass)\b', '<cfgClass>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(params)\b', '<any>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(flag)\b', '<objFlag>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(leaderPos|array|pos|rotation)\b', '<array>', docSyntax)
			
			reviewLevel = 2
			for docSyn in docSyntax.split(' '):
				if docSyn != command and \
				   not docSyn.isnumeric() and \
				   docSyn not in ['=', '>', '<', ' ', '-', '+', '*', '^', '/', 'call', 'spawn'] and \
				   '_' not in docSyn and docSyn.isalpha():
					reviewLevel = 1
					break

			update_stats(version, reviewLevel)
			cmd['reviewLevel'] = reviewLevel
			cmd['syntax'] = docSyntax

path = os.path.dirname(os.path.realpath(__file__)) + '/output/sqfCommandsCorrected.json'
with open(path, 'w') as jsonFile:
	json.dump(biWiki, jsonFile)

print_stats()