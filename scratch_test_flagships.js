const fs = require('fs');

// We can extract getFlagshipDate logic and run it across all geographies
// Let's create a test script that imports or evaluates entry-resolver logic
const ts = require('typescript');

function requireTs(path) {
  const code = fs.readFileSync(path, 'utf8');
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const m = { exports: {} };
  const fn = new Function('module', 'exports', 'require', result.outputText);
  fn(m, m.exports, (id) => {
    if (id.startsWith('@/data/')) {
      return requireTs('./data/' + id.replace('@/data/', '') + '.ts');
    }
    if (id.startsWith('@/lib/calendar/')) {
      return requireTs('./lib/calendar/' + id.replace('@/lib/calendar/', '') + '.ts');
    }
    if (id === './calendar-utils') {
      return requireTs('./lib/calendar/calendar-utils.ts');
    }
    if (id === './entry-resolver') {
      return requireTs('./lib/calendar/entry-resolver.ts');
    }
    return require(id);
  });
  return m.exports;
}

try {
  const { INDIAN_GEOGRAPHIES } = requireTs('./data/geographies.ts');
  const { getFlagshipDateForGeography, getEntriesForDate } = requireTs('./lib/calendar/entry-resolver.ts');

  console.log('--- FLAGSHIP DATES FOR ALL GEOGRAPHIES (2026) ---');
  for (const g of INDIAN_GEOGRAPHIES) {
    const fDate = getFlagshipDateForGeography(g.id, 2026);
    const entries = getEntriesForDate(fDate, g.id);
    console.log(
      g.id.padEnd(30),
      'Flagship Date:', fDate,
      'Entries on that date:', entries.length,
      entries[0] ? `"${entries[0].title}"` : 'NO ENTRY!'
    );
  }
} catch (e) {
  console.error(e);
}
