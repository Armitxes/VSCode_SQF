const nodeFetch = require('node-fetch').default;
const { parse } = require('node-html-parser');
const { DOMParser } = require('xmldom');
const xpath = require('xpath');
const fs = require('fs');
const path = require('path');

const WIKI_BASE_URL = 'https://community.bistudio.com';
const getApiUrl = params => `${WIKI_BASE_URL}/wikidata/api.php?${params}`;

const introducedInGamesCategoryMap = {
  ofp: 'Category:Introduced_with_Operation_Flashpoint',
  ofpResistance: 'Category:Introduced_with_Operation_Flashpoint:_Elite',
  toh: 'Category:Introduced_with_Take_On_Helicopters',
  arma: 'Category:Introduced_with_Armed_Assault',
  arma2: 'Category:Introduced_with_Arma_2',
  arma2oa: 'Category:Introduced_with_Arma_2:_Operation_Arrowhead',
  arma3: 'Category:Introduced_with_Arma_3',
};

class RequestQueue {
  #fetch;
  #queue;
  #errors;

  constructor() {
    this.#fetch = nodeFetch;
    this.#queue = [];
    this.#errors = [];
  }

  get errors() {
    return this.#errors;
  }

  enqueue(item) {
    return this.#queue.push(item);
  }

  dequeue() {
    return this.#queue.shift();
  }

  peek() {
    if (!this.#queue.length) {
      return undefined;
    }
    return this.#queue[0];
  }

  fetch(params) {
    const url = getApiUrl(params);
    const existingItem = this.#queue.find(item => url === item.url);
    if (existingItem) {
      return existingItem.request;
    }
    const request = new Promise(async (resolve, reject) => {
      while (this.peek()?.url !== url) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.dequeue();
      let res = { status: null };
      let retries = 0;
      while (res.status !== 200 && retries < 10) {
        if (retries > 0) {
          const waitTime = (Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000) * retries;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        try {
          res = await this.#fetch(url);
        } catch (e) {}
        retries++;
      }
      if (retries >= 10) {
        this.#errors.push({ error: 'Request timed out', url, res });
        reject(new Error(`Request timed out with ${retries} retries!\nurl: ${url}`));
      }
      resolve(await res.json());
    });
    this.enqueue({ url, request });
    return request;
  }
}

const requestQueue = new RequestQueue();
const fetch = params => requestQueue.fetch(params);

(async () => {
  const commandErrors = [];
  await Promise.all(
    Object.keys(introducedInGamesCategoryMap).map(async game => {
      const categoryParams = new URLSearchParams({
        action: 'categorytree',
        format: 'json',
        options: JSON.stringify({ depth: 1 }),
        category: introducedInGamesCategoryMap[game],
      });
      const html = (await fetch(categoryParams)).categorytree['*'];
      const document = parse(html);
      const introducedInVersionMap = Array.from(document.querySelectorAll('a.CategoryTreeLabel')).reduce(
        (acc, a) => ({
          ...acc,
          [/\d+\.\d+/.exec(a.textContent).shift()]: {
            title: a.getAttribute('href').split('/wiki/').pop(),
            params: new URLSearchParams({
              action: 'query',
              format: 'json',
              list: 'categorymembers',
              cmtitle: a.getAttribute('href').split('/wiki/').pop(),
              cmprop: 'ids|title|type|timestamp',
              cmtype: 'page|subcat|file',
              cmlimit: '500',
            }),
          },
        }),
        {}
      );

      const currGameCommands = fs.existsSync(path.join(process.cwd(), 'devHelper/commands', `${game}.json`))
        ? JSON.parse(fs.readFileSync(path.join(process.cwd(), 'devHelper/commands', `${game}.json`), 'utf8'))
        : {};
      const gameCommands = { docs: `${WIKI_BASE_URL}/wiki/${introducedInGamesCategoryMap[game]}` };
      await Promise.all(
        Object.keys(introducedInVersionMap).map(async version => {
          const cmdData = await fetch(introducedInVersionMap[version].params);
          let categoryMembers = cmdData.query.categorymembers;
          let cmdContinue = cmdData.continue;
          while (cmdContinue) {
            const continueParams = new URLSearchParams({
              action: 'query',
              format: 'json',
              list: 'categorymembers',
              cmtitle: introducedInVersionMap[version].title,
              cmprop: 'ids|title|type|timestamp',
              cmtype: 'page|subcat|file',
              cmlimit: '500',
              ...cmdContinue,
            });
            const next = await fetch(continueParams);
            categoryMembers = [...categoryMembers, ...next.query.categorymembers];
            cmdContinue = next.continue;
          }

          const commands = categoryMembers
            .filter(cat => cat.type === 'page' && !cat.title.includes(':'))
            .map(cat => ({ command: cat.title.replace(/[ ]+/g, '_'), pageId: cat.pageid, timestamp: cat.timestamp }))
            .sort((a, b) => a.command.localeCompare(b.command, undefined, { sensitivity: 'base' }));
          gameCommands[version] = await Promise.all(
            commands
              .map(async cat => {
                const { command, pageId, timestamp } = cat;
                console.log(`- ${game} | ${version} | ${command}`);

                const currCommand = currGameCommands[command];
                if (currCommand?.timestamp && new Date(currCommand.timestamp) - new Date(timestamp) >= 0) {
                  return currCommand;
                }

                const pageParams = new URLSearchParams({
                  action: 'parse',
                  format: 'json',
                  pageid: pageId,
                  prop: 'parsetree|wikitext|properties|images|sections|parsewarnings',
                });
                const parsetree = (await fetch(pageParams))?.parse?.parsetree?.['*'];

                if (!parsetree) {
                  return command;
                }
                if (parsetree.includes('<title>TOC</title>')) {
                  return null;
                }

                const errorData = {};
                try {
                  const formatText = text => {
                    return text
                      .trim()
                      .replace(/\\\\n/, ' ')
                      .replace(/\\n/, ' ')
                      .replace(/\n/, ' ')
                      .replace(/\s+/g, ' ')
                      .replace(/\[\[[^\|]+\|\s*([^\]]+)\]\]/g, '$1')
                      .replace(/\[\[\s*([^\]]+)\]\]/g, '<$1>')
                      .replace(/'''/g, "'")
                      .trim();
                  };
                  const commandDoc = new DOMParser().parseFromString(parsetree);

                  const tags = Array.from(
                    new Set([
                      ...xpath
                        .select('//name[starts-with(., "serverExec")]', commandDoc)
                        .map(e => (formatText(e?.nextSibling?.nextSibling?.textContent ?? '').toLowerCase() === 'server' ? '[SE]' : null))
                        .filter(Boolean),
                      ...xpath
                        .select('//name[starts-with(., "arg")]', commandDoc)
                        .map(e => formatText(e?.nextSibling?.nextSibling?.textContent ?? '').toLowerCase())
                        .filter(e => ['local', 'global'].includes(e))
                        .map(e => (e === 'local' ? '[AL]' : '[AG]')),
                      ...xpath
                        .select('//name[starts-with(., "eff")]', commandDoc)
                        .map(e => formatText(e?.nextSibling?.nextSibling?.textContent ?? '').toLowerCase())
                        .filter(e => ['local', 'global'].includes(e))
                        .map(e => (e === 'local' ? '[EL]' : '[EG]')),
                    ])
                  ).join(' ');
                  errorData.tags = tags;

                  const description = formatText(xpath.select('//name[starts-with(., "descr")]', commandDoc).shift()?.nextSibling?.nextSibling?.textContent ?? '').replace(
                    /<(\w+)>/g,
                    '$1'
                  );
                  errorData.description = description;

                  const example = formatText(
                    xpath
                      .select('//name[starts-with(., "x")]', commandDoc)
                      .filter(e => /x\d+/.test(e.textContent))
                      .shift()?.nextSibling?.nextSibling?.textContent ?? ''
                  );
                  errorData.example = (/<code>(?<code>.+)<\/code>/.exec(example)?.groups?.code ?? example).replace(/\w*<(\w+)>/g, '$1').replace(/; cc(\w+)/g, '; // $1').replace(/ Example: /g, '\n');

                  const params = xpath
                    .select('//name[starts-with(., "p")]', commandDoc)
                    .filter(e => /p\d+/.test(e.textContent))
                    .map(e => formatText(e?.nextSibling?.nextSibling?.textContent ?? ''))
                    .map(p => Object.entries(/(?<syntax>[^:]+):\s*(?<type><?\w+>?)/.exec(p)?.groups ?? {}).reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {}));
                  errorData.params = params;

                  const returns = formatText(
                    xpath
                      .select('//name[starts-with(., "r")]', commandDoc)
                      .filter(e => /r\d+/.test(e.textContent))
                      .shift()?.nextSibling?.nextSibling?.textContent ?? ''
                  );
                  const primaryReturn = (/<(?<return>\w+)>/.exec(returns)?.groups?.return ?? returns).toLowerCase();
                  const allReturns = [];
                  if (/<(?<return>\w+)>/.test(returns)) {
                    let bufferReturn = returns;
                    while (bufferReturn) {
                      const altReturn = /<(?<return>\w+)>/.exec(bufferReturn)?.groups?.return;
                      if (altReturn) {
                        allReturns.push(altReturn.toLowerCase());
                        bufferReturn = bufferReturn.replace(/<(?<return>\w+)>/, '');
                      } else {
                        bufferReturn = null;
                      }
                    }
                  }
                  errorData.returns = allReturns.length > 1 ? allReturns.join(' | ') : primaryReturn;

                  const docSyntax = formatText(
                    xpath
                      .select('//name[starts-with(., "s")]', commandDoc)
                      .filter(e => /s\d+/.test(e.textContent))
                      .shift()?.nextSibling?.nextSibling?.textContent ?? ''
                  ).replace(/<(\w+)>/g, '$1');
                  errorData.docSyntax = docSyntax;

                  let syntax = docSyntax;
                  if (params.length) {
                    params.forEach(param => {
                      if (param.syntax && param.type) {
                        syntax = syntax.replace(param.syntax, param.type.toLowerCase());
                      }
                    });
                  }

                  return {
                    command,
                    timestamp,
                    version,
                    syntax,
                    docSyntax,
                    tags,
                    description,
                    example: (/<code>(?<code>.+)<\/code>/.exec(example)?.groups?.code ?? example).replace(/\w*<(\w+)>/g, '$1').replace(/; cc(\w+)/g, '; // $1').replace(/ Example: /g, '\n'),
                    params: params
                      .map(p => p?.type?.toLowerCase())
                      .filter(Boolean)
                      .join(' '),
                    returns: allReturns.length > 1 ? allReturns.join(' | ') : primaryReturn,
                  };
                } catch (error) {
                  commandErrors.push({ ...cat, error: `${error.name} :: ${error.message}`, parsetree, errorData });
                  return command;
                }
              })
              .filter(Boolean)
          );
        })
      );
      const gameCommandsSorted = Object.keys(gameCommands)
        .sort((a, b) => {
          if (a === 'docs') {
            return -1;
          }
          if (b === 'docs') {
            return 1;
          }
          const [, aVer] = /(\d+\.\d+)/.exec(a);
          const [, bVer] = /(\d+\.\d+)/.exec(b);
          return Number.parseFloat(aVer) - Number.parseFloat(bVer);
        })
        .reduce((acc, key) => {
          if (key === 'docs' || !gameCommands[key].length) {
            return acc;
          }
          return {
            ...acc,
            ...gameCommands[key].reduce(
              (cmdsMap, cmd) => (cmd?.command ? { ...cmdsMap, [cmd.command]: { ...cmd } } : typeof cmd === 'string' ? { ...cmdsMap, [cmd]: { command: cmd } } : cmdsMap),
              {}
            ),
          };
        }, {});

      ['devHelper/commands', 'devHelper/output', 'env/shared/commands/json'].forEach(dir => {
        if (!fs.existsSync(path.join(process.cwd(), dir))) {
          fs.mkdirSync(path.join(process.cwd(), dir));
        }
        if (dir === 'devHelper/commands') {
          fs.writeFileSync(path.join(process.cwd(), dir, `${game}.json`), JSON.stringify(gameCommandsSorted, null, 2), 'utf8');
        } else {
          fs.writeFileSync(path.join(process.cwd(), dir, `${game}.min.json`), JSON.stringify(gameCommandsSorted), 'utf8');
        }
      });
    })
  );
  console.log(`Total command errors: ${commandErrors.length}`);
  if (commandErrors.length) {
    commandErrors.forEach(error => console.log(JSON.stringify(error, null, 2)));
  }
  console.log(`Total request errors: ${requestQueue.errors.length}`);
  if (requestQueue.errors.length) {
    requestQueue.errors.forEach(error => console.log(JSON.stringify(error, null, 2)));
  }
})();
