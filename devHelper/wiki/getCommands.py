#!/usr/bin/env python3

'''
File: getCommands.py

TODO
'''

import json
import requests
from os import path
from pyquery import PyQuery as pq
from argparse import ArgumentParser
from wiki.games import GAMES


class CommandQuery:
    baseUri = 'https://community.bistudio.com/wiki/Category:Introduced_with'
    path = path.dirname(path.realpath(__file__))

    def parse(self, version: str, res: requests.Response):
        cmds = []

        for item in pq(res.text)('div.mw-category ul li').items():
            item = item.text().replace(' ', '_')
            cmds.append(item)

        if not cmds:
            return

        self.fjson[version] = cmds

    def _json_output(self, game: str):
        """Stores the crawl result into a JSON file"""
        cfile = path.join(self.path, 'commands', f'{game}.json')

        print('Saving JSON: "%s"' % cfile)
        with open(cfile, 'w+') as jsonFile:
            json.dump(self.fjson, jsonFile, indent=4)

    def start(self, game: str, min: str, max: str, path: str = None):
        gamename = GAMES.get(game, 'ERROR')
        current = min
        api_base = f'{self.baseUri}_{gamename}'
        self.fjson = {
            'docs': api_base
        }

        if path:
            self.path = path

        while float(current) <= float(max):
            req = requests.get(f'{api_base}_version_{current}')
            if req.ok:
                self.parse(current, req)
            else:
                print(
                    f'Entry for {gamename} version {current} not found, skipping...')

            # increment by 0.02
            current = '%.2f' % (float(current) + 0.02)

        self._json_output(game)


if (__name__ == '__main__'):
    parser = ArgumentParser(
        description='Fetch all Arma 3 Commands and functions by version.')
    parser.add_argument('game', metavar='GAME', type=str, nargs='?',
                        choices=GAMES.keys(), help=f'Game to fetch commands for. Valid options: {list(GAMES.keys())}')
    parser.add_argument('--all', action='store_true',
                        help='Fetch all games')
    parser.add_argument('--min', type=str, nargs='?',
                        const='min', default='0.50', help='Minimum ARMA 3 version')
    parser.add_argument('--max', type=str, nargs='?',
                        const='max', default='2.08', help='Maximum ARMA 3 version')

    args = parser.parse_args()
    if not (args.all or args.game):
        parser.error(
            'positional argument GAME is required, if --all option is not set. use {} --help for more information'.format(parser.prog))
        exit(1)

    if args.all:
        for game in GAMES.keys():
            CommandQuery().start(game, args.min, args.max)
    else:
        CommandQuery().start(args.game, args.min, args.max)
