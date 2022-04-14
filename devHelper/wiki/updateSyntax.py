#!/usr/bin/env python3

'''
File: updateSyntax.py

TODO
'''

import json
import re
from os import path
from sys import argv


class SyntaxUpdater:
    path = path.dirname(path.realpath(__file__))

    def start(self, dir: str = None):
        if path:
            self.path = dir

        with open(path.join(self.path, '..', 'syntaxes', 'sqf.min.json'), 'r') as file:
            json_file = json.load(file)

        games = {
            'OFP': ['ofp', 'ofpElite'],
            'TOH': ['toh'],
            'ARMA': ['arma'],
            'ARMA2': ['arma2', 'arma2oa'],
            'ARMA3': ['arma3']
        }
        repo = json_file['repository']

        for key, value in games.items():
            regex = ''
            for game in value:
                try:
                    with open(path.join(self.path, 'commands', f'{game}.json'), 'r') as file:
                        json_game = json.load(file)

                    for ver, cmd_list in json_game.items():
                        if ver == 'docs':
                            continue

                        for cmd in cmd_list:
                            if re.fullmatch(r'\w+', cmd) and not re.match(r'\w*(greater|less|a_or_b)\w*', cmd):
                                # regex += f'{cmd}\\b|'
                                regex += f'{cmd}|'

                except FileNotFoundError:
                    print('err')

            repo[key]['match'] = '\\s*(?i)(' + regex[:-1] + ')\\b'

        json_file['repository'] = repo
        with open(path.join(self.path, 'output', 'sqf.min.json'), 'w') as file:
            json.dump(json_file, file)


if __name__ == '__main__':
    SyntaxUpdater().start(argv[1])
