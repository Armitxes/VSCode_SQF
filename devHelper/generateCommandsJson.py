#!/usr/bin/env python3

'''
File: generateCommandsJson.py

TODO
'''

from argparse import ArgumentParser
from setuptools import Command
from wiki.games import GAMES
from wiki.getCommands import CommandQuery
from wiki.wikiCrawler import Crawler
from os import path

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
parser.add_argument('--no-update', action='store_true',
                    help='if set, don\'t update the command list')

args = parser.parse_args()
if not (args.all or args.game):
    parser.error(
        'positional argument GAME is required, if --all option is not set. use {} --help for more information'.format(parser.prog))
    exit(1)


workdir = path.dirname(path.realpath(__file__))

if args.all:
    if not args.no_update:
        for game in GAMES.keys():
            CommandQuery().start(game, args.min, args.max, path=workdir)
    for game in GAMES.keys():
        Crawler().start(game, path=workdir)
else:
    if not args.no_update:
        CommandQuery().start(args.game, args.min, args.max, path=workdir)

    Crawler().start(args.game, path=workdir)
