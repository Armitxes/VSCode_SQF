# -*- coding: utf-8 -*-
# Written by Armitxes (Jan Brodersen)
# All rights reserved. For more information visit https://armitxes.net

import os
import json
import re

biWiki = json.load(open('./env/shared/commands/sqfCommands.json'))

for version in biWiki:
	ver = biWiki[version]
	for command in biWiki[version]:
		cmd = ver[command]
		if cmd.get('reviewed'):
			continue

		docSyntax = cmd.get('docSyntax')
		if docSyntax:
			docSyntax = docSyntax.replace(', ', ',')
			docSyntax = re.sub(r'(?i)\b(\\\"[A-Za-z0-9_ \t]*\\\"|boardName|weapon|magazine|name)\b', '<string>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(object)\b', '<object>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(unit|player|person|unitName|killer|killed|member|anObject)\b', '<objUnit>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(vehicle|car|cargo)\b', '<objVehicle>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(grp|group)\b', '<objGroup>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(item)\b', '<objItem>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(map)\b', '<objMap>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(side)\b', '<objSide>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(task)\b', '<objTask>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(trigger)\b', '<objTrigger>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(curatorObj)\b', '<objCurator>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(code)\b', '<code>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(bool|boolean|true|false|enabled)\b', '<bool>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(position|leaderPos|array)\b', '<array>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(string)\b', '<string>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(idc|index|distance|damage|ownerID|value|n|id|order|coef|row|column|scale)\b', '<scalar>', docSyntax)
			docSyntax = re.sub(r'(?i)\b(params)\b', '<any>', docSyntax)
			cmd['syntax'] = docSyntax

path = os.path.dirname(os.path.realpath(__file__)) + '/output/sqfCommandsCorrected.json'
with open(path, 'w') as jsonFile:
	json.dump(biWiki, jsonFile)