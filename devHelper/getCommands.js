const fetch = require('node-fetch').default;
const { parse } = require('node-html-parser');
const fs = require('fs');
const path = require('path');

(async () => {
  const WIKI_BASE_URL = 'https://community.bistudio.com';
  const introducedInGamesMap = {
    ofp: '/wiki/Category:Introduced_with_Operation_Flashpoint',
    ofpResistance: '/wiki/Category:Introduced_with_Operation_Flashpoint:_Elite',
    toh: '/wiki/Category:Introduced_with_Take_On_Helicopters',
    arma: '/wiki/Category:Introduced_with_Armed_Assault',
    arma2: '/wiki/Category:Introduced_with_Arma_2',
    arma2oa: '/wiki/Category:Introduced_with_Arma_2:_Operation_Arrowhead',
    arma3: '/wiki/Category:Introduced_with_Arma_3',
  };

  await Promise.all(Object.keys(introducedInGamesMap).map(async game => {
    const html = await (await fetch(`${WIKI_BASE_URL}${introducedInGamesMap[game]}`)).text();
    const document = parse(html);
    const introducedInVersionMap = Array.from(document.querySelectorAll('.CategoryTreeLabel')).reduce(
      (acc, a) => ({ ...acc, [/\d+\.\d+/.exec(a.textContent).shift()]: a.getAttribute('href') }),
      {}
    );
    const gameCommands = { docs: `${WIKI_BASE_URL}${introducedInGamesMap[game]}` };
    await Promise.all(Object.keys(introducedInVersionMap).map(async version => {
      const cmdhtml = await (await fetch(`${WIKI_BASE_URL}${introducedInVersionMap[version]}`)).text();
      const cmdDocument = parse(cmdhtml);
      const commands = Array.from(cmdDocument.querySelectorAll('div.mw-category-group > ul > li > a[title]'))
        .filter(a => !a.classList.length && !a.textContent.includes(':'))
        .map(a => a.textContent.replace(/[ ]+/g, '_'));
      gameCommands[version] = commands;
    }));
    fs.writeFileSync(
      path.join(process.cwd(), 'devHelper/commands', `${game}.json`),
      JSON.stringify(gameCommands, null, 2),
      'utf8'
    );
  }));
})();
