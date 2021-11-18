const fetch = require('node-fetch').default;
const { parse } = require('node-html-parser');
const fs = require('fs');
const path = require('path');

(async () => {
  const WIKI_BASE_URL = 'https://community.bistudio.com';
  const getApiUrl = params => `${WIKI_BASE_URL}/wikidata/api.php?${params}`;
  const getUrlParams = category =>
    new URLSearchParams({
      action: 'categorytree',
      format: 'json',
      options: JSON.stringify({ depth: 1 }),
      category,
    });
  const introducedInGamesMap = {
    ofp: '/wiki/Category:Introduced_with_Operation_Flashpoint',
    ofpResistance: '/wiki/Category:Introduced_with_Operation_Flashpoint:_Elite',
    toh: '/wiki/Category:Introduced_with_Take_On_Helicopters',
    arma: '/wiki/Category:Introduced_with_Armed_Assault',
    arma2: '/wiki/Category:Introduced_with_Arma_2',
    arma2oa: '/wiki/Category:Introduced_with_Arma_2:_Operation_Arrowhead',
    arma3: '/wiki/Category:Introduced_with_Arma_3',
  };
  const introducedInGamesParamsMap = {
    ofp: getUrlParams('Category:Introduced_with_Operation_Flashpoint'),
    ofpResistance: getUrlParams('Category:Introduced_with_Operation_Flashpoint:_Elite'),
    toh: getUrlParams('Category:Introduced_with_Take_On_Helicopters'),
    arma: getUrlParams('Category:Introduced_with_Armed_Assault'),
    arma2: getUrlParams('Category:Introduced_with_Arma_2'),
    arma2oa: getUrlParams('Category:Introduced_with_Arma_2:_Operation_Arrowhead'),
    arma3: getUrlParams('Category:Introduced_with_Arma_3'),
  };

  await Promise.all(
    Object.keys(introducedInGamesParamsMap).map(async game => {
      const getVersionUrlParams = title =>
        new URLSearchParams({
          action: 'query',
          format: 'json',
          list: 'categorymembers',
          cmtitle: title,
          cmprop: 'ids|title|type',
          cmtype: 'page|subcat|file',
          cmlimit: '500',
        });
      const html = (await (await fetch(getApiUrl(introducedInGamesParamsMap[game]))).json()).categorytree['*'];
      const document = parse(html);
      const introducedInVersionMap = Array.from(document.querySelectorAll('a.CategoryTreeLabel')).reduce(
        (acc, a) => ({
          ...acc,
          [/\d+\.\d+/.exec(a.textContent).shift()]: {
            title: a.getAttribute('href').split('/wiki/').pop(),
            params: getVersionUrlParams(a.getAttribute('href').split('/wiki/').pop()),
          },
        }),
        {}
      );

      const gameCommands = { docs: `${WIKI_BASE_URL}${introducedInGamesMap[game]}` };
      await Promise.all(
        Object.keys(introducedInVersionMap).map(async version => {
          const cmdData = await (await fetch(getApiUrl(introducedInVersionMap[version].params))).json();
          let categoryMembers = cmdData.query.categorymembers;
          let cmdContinue = cmdData.continue;
          while (cmdContinue) {
            const continueParams = new URLSearchParams({
              action: 'query',
              format: 'json',
              list: 'categorymembers',
              cmtitle: introducedInVersionMap[version].title,
              cmprop: 'ids|title|type',
              cmtype: 'page|subcat|file',
              cmlimit: '500',
              ...cmdContinue,
            });
            const next = await (await fetch(getApiUrl(continueParams))).json();
            categoryMembers = [...categoryMembers, ...next.query.categorymembers];
            cmdContinue = next.continue;
          }

          const commands = categoryMembers.filter(cat => cat.type === 'page' && !cat.title.includes(':')).map(cat => cat.title.replace(/[ ]+/g, '_'));
          gameCommands[version] = commands;
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
        .reduce((acc, key) => (gameCommands[key].length ? { ...acc, [key]: gameCommands[key] } : acc), {});

      fs.writeFileSync(path.join(process.cwd(), 'devHelper/commands', `${game}.json`), JSON.stringify(gameCommandsSorted, null, 2), 'utf8');
    })
  );
})();
