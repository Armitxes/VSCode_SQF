#!/usr/bin/env python3

'''
File: getCommands.py

TODO
'''

import re
import json
import requests
from os import path
from pyquery import PyQuery as pq
from argparse import ArgumentParser
from wiki.games import GAMES


class CommandQuery:
    baseUri = 'https://community.bistudio.com/wiki/Category:'
    path = path.dirname(path.realpath(__file__))
    invalid_commands = r'(.*(\W|greater|_hash_|_less_|_or_|_and_).*)|^((call|spawn)|(then|do|else|exit|exitWith|for|forEach|if|return|switch|case|default|while|from|to|step|forEachMember|forEachMemberAgent|forEachMemberTeam|breakOut|breakTo)|(player|cursorTarget|cursorObject)|(this|_this|_x|_y|_forEachIndex|_exception|_thisEvent|_thisScript|_thisFSM|thisList|thisTrigger|west|east|resistance|civilian|independent|blufor|opfor)|(get|set|select|getOrDefault|#|insert)|(compile|compileFinal|exec|execFSM|execVM|callExtension)|(null|nil|controlNull|displayNull|grpNull|locationNull|netObjNull|objNull|scriptNull|taskNull|teamMemberNull|configNull)|(private)|(true|false))$'

    def parse(self, version: str, res: requests.Response):
        cmds = []
        skipped = 0

        for item in pq(res.text)('div.mw-category ul li').items():
            item = item.text().replace(' ', '_')
            if re.match(self.invalid_commands, item):
                skipped += 1
                continue
            cmds.append(item)

        if not cmds:
            return

        self.fjson[version] = cmds

        print(f'{len(cmds)} commands found; {skipped} skipped')

    def _json_output(self, game: str):
        """Stores the crawl result into a JSON file"""
        cfile = path.join(self.path, 'commands', f'{game}.json')

        print('Saving JSON: "%s"' % cfile)
        with open(cfile, 'w+') as jsonFile:
            json.dump(self.fjson, jsonFile, indent=4)

    def start(self, game: str, path: str = None):
        gamename = GAMES.get(game, 'ERROR')
        api_base = f'{self.baseUri}_{gamename}'
        apis = {
            'CMD': f'{api_base}:_Scripting_Commands',
            'FNC': f'{api_base}:_Functions'
        }

        self.fjson = {
            'docs': apis
        }

        if path:
            self.path = path

        for type, url in apis.items():
            req = requests.get(url)
            if req.ok:
                self.parse(type, req)
            else:
                print(
                    f'Entry for {gamename} "{url}" not found, skipping...')

        self._json_output(game)


if (__name__ == '__main__'):
    parser = ArgumentParser(
        description='Fetch all Arma 3 Commands and functions by version.')
    parser.add_argument('game', metavar='GAME', type=str, nargs='?',
                        choices=GAMES.keys(), help=f'Game to fetch commands for. Valid options: {list(GAMES.keys())}')
    parser.add_argument('--all', action='store_true',
                        help='Fetch all games')

    args = parser.parse_args()
    if not (args.all or args.game):
        parser.error(
            'positional argument GAME is required, if --all option is not set. use {} --help for more information'.format(parser.prog))
        exit(1)

    if args.all:
        for game in GAMES.keys():
            CommandQuery().start(game)
    else:
        CommandQuery().start(args.game)
