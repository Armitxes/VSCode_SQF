# -*- coding: utf-8 -*-
# Written by Armitxes (Jan Brodersen)
# All rights reserved. For more information visit https://armitxes.net

import json
import os
from pyquery import PyQuery as pq

import re
import requests


class Crawler():
	# Comment out games that don't need to be crawled (get_games)!!
	# Don't crawl the entire list at once, we don't want to cause a DoS.
	# Try to crawl at times where the wiki isn't used as much.
	fjson = {}

	def get_games(self):
		"""Returns a list of supported games, sorted by release date"""
		return [
			'ofp',
			'ofpResistance',
			'toh',
			'arma',
			'arma2',
			'arma2oa',
			'arma3',
		]

	def syntax_translator(self, command):
		doc_syntax = self.fjson[command].get('docSyntax')
		if not doc_syntax:
			return

		syntax = doc_syntax.replace(', ', ',')
		syntax = re.sub(r'(?i)\b(\\\"[A-Za-z0-9_ \t]*\\\"|boardName|weapon|taskName|magazine|name|string|text|subject|skillName|texture|markerName|soundName)\b', '<string>', syntax)
		syntax = re.sub(r'(?i)\b(object|obj|target)\b', '<object>', syntax)
		syntax = re.sub(r'(?i)\b(unit|player|person|unitName|killer|killed|member|anObject)\b', '<objUnit>', syntax)
		syntax = re.sub(r'(?i)\b(vehicle|car|cargo)\b', '<objVehicle>', syntax)
		syntax = re.sub(r'(?i)\b(grp|group)\b', '<objGroup>', syntax)
		syntax = re.sub(r'(?i)\b(item)\b', '<objItem>', syntax)
		syntax = re.sub(r'(?i)\b(map)\b', '<objMap>', syntax)
		syntax = re.sub(r'(?i)\b(side)\b', '<objSide>', syntax)
		syntax = re.sub(r'(?i)\b(task)\b', '<objTask>', syntax)
		syntax = re.sub(r'(?i)\b(trigger)\b', '<objTrigger>', syntax)
		syntax = re.sub(r'(?i)\b(curatorObj)\b', '<objCurator>', syntax)
		syntax = re.sub(r'(?i)\b(camera)\b', '<objCamera>', syntax)
		syntax = re.sub(r'(?i)\b(code)\b', '<code>', syntax)
		syntax = re.sub(r'(?i)\b(bool|boolean|true|false|enabled|enable|locked)\b', '<bool>', syntax)
		syntax = re.sub(r'(?i)\b(idc|index|objectId|delay|distance|damage|ownerID|points|value|n|id|order|coef|row|column|scale|speed|altitude|color|number|time|zoom)\b', '<scalar>', syntax)
		syntax = re.sub(r'(?i)\b(control|ctrl)\b', '<uiControl>', syntax)
		syntax = re.sub(r'(?i)\b(display)\b', '<uiDisplay>', syntax)
		syntax = re.sub(r'(?i)\b(configClass)\b', '<cfgClass>', syntax)
		syntax = re.sub(r'(?i)\b(params)\b', '<any>', syntax)
		syntax = re.sub(r'(?i)\b(flag)\b', '<objFlag>', syntax)
		syntax = re.sub(r'(?i)\b(leaderPos|array|pos|rotation)\b', '<array>', syntax)
		self.fjson[command]['syntax'] = syntax

	def _call_bi_wiki(self, command):
		uri = 'https://community.bistudio.com/wiki?title={cmd}&printable=yes'.format(cmd=command)
		pq_all = pq(requests.get(uri).text)
		pq_all(
			'head,script,style,h1#firstHeading,div#mw-navigation,div.suggestions,div#bohemia-header,' +
			'div.printfooter,div.catlinks,div.visualClear,div#footer,div#siteSub,div#contentSub,div#jump-to-nav,' +
			'div.noprint'
		).remove()
		pq_rev = pq_all('div._description.cmd')

		# Command Tags
		if bool(pq_rev('a[href="/wiki/Category:Commands_requiring_server_side_execution"]')):
			# https://community.bistudio.com/wiki/Category:Commands_requiring_server_side_execution
			self.fjson[command]['tags'] += '[SE] '
		if bool(pq_rev('a[href="/wiki/Category:Commands_utilizing_local_arguments"]')):
			# https://community.bistudio.com/wiki/Category:Commands_utilizing_local_arguments
			self.fjson[command]['tags'] += '[AL] '
		if bool(pq_rev('a[href="/wiki/Category:Commands_utilizing_global_arguments"]')):
			# https://community.bistudio.com/wiki/Category:Commands_utilizing_global_arguments
			self.fjson[command]['tags'] += '[AG] '
		if bool(pq_rev('a[href="/wiki/Category:Commands_with_local_effects"]')):
			# https://community.bistudio.com/wiki/Category:Commands_with_local_effects
			self.fjson[command]['tags'] += '[EL] '
		if bool(pq_rev('a[href="/wiki/Category:Commands_with_global_effects"]')):
			# https://community.bistudio.com/wiki/Category:Commands_with_global_effects
			self.fjson[command]['tags'] += '[EG] '

		bi_wiki = pq_all.text().strip().split('\n')
		if 'Description:' in bi_wiki:
			self.fjson[command]['description'] = bi_wiki[bi_wiki.index('Description:') + 1]

		if 'Example 1:' in bi_wiki:
			self.fjson[command]['example'] = bi_wiki[bi_wiki.index('Example 1:') + 1]

		if 'Syntax:' in bi_wiki:
			self.fjson[command]['docSyntax'] = bi_wiki[bi_wiki.index('Syntax:') + 1]
			self.syntax_translator(command)

	def _local_overwrite(self, command, overwrite):
		if command and overwrite and isinstance(overwrite, dict):
			for key, value in overwrite.items():
				self.fjson[command][key] = value

	def _crawl_game_version_command(self, game, version, command):
		"""Crawl command specific information from BI wiki"""
		if version == "docs":
			return

		print('- {g} | {v} | {c}'.format(g=game, v=version, c=command))
		overwrite = {}

		if isinstance(command, (dict)):
			overwrite = command.get('overwrite')
			command = command.get('key', command)

		self.fjson[command] = {
			'version': version,
			'tags': '',
		}
		self._call_bi_wiki(command)
		self._local_overwrite(command, overwrite)

	def _crawl_game_versions(self, game):
		"""Crawl the wiki for the specified game and its versions"""
		versions = json.load(open('./devHelper/commands/{game}.json'.format(game=game)))
		for version, commands in versions.items():
			for command in commands:
				self._crawl_game_version_command(
					game=game,
					version=version,
					command=command,
				)

	def _json_output(self, game):
		"""Stores the crawl result into a JSON file"""
		cfile = '{path}/output/{game}.min.json'.format(
			path=os.path.dirname(os.path.realpath(__file__)),
			game=game,
		)

		print('Saving JSON: "%s"' % cfile)
		with open(cfile, 'w+') as jsonFile:
			json.dump(self.fjson, jsonFile)

	def start(self):
		"""Start wiki crawler."""
		for game in self.get_games():
			self.fjson = {}
			self._crawl_game_versions(game=game)
			self._json_output(game=game)

Crawler().start()
