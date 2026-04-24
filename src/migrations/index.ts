import * as migration_20260423_230153 from './20260423_230153';
import * as migration_20260424_100000 from './20260424_100000';
import * as migration_20260424_100100 from './20260424_100100';
import * as migration_20260424_100200 from './20260424_100200';
import * as migration_20260424_100300 from './20260424_100300';
import * as migration_20260424_110400 from './20260424_110400';

export const migrations = [
  {
    up: migration_20260423_230153.up,
    down: migration_20260423_230153.down,
    name: '20260423_230153'
  },
  {
    up: migration_20260424_100000.up,
    down: migration_20260424_100000.down,
    name: '20260424_100000'
  },
  {
    up: migration_20260424_100100.up,
    down: migration_20260424_100100.down,
    name: '20260424_100100'
  },
  {
    up: migration_20260424_100200.up,
    down: migration_20260424_100200.down,
    name: '20260424_100200'
  },
  {
    up: migration_20260424_100300.up,
    down: migration_20260424_100300.down,
    name: '20260424_100300'
  },
  {
    up: migration_20260424_110400.up,
    down: migration_20260424_110400.down,
    name: '20260424_110400'
  },
];
