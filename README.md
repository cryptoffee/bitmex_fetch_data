*Usage*
set env variables
BITMEX_API_KEY=XYZ
BITMEX_API_SECRET=ABC
then run 
`node fetch-command-line.js 2019-01-01T00:00:00.000Z 2019-01-01T17:00:00.000Z > data.json`
or
set it one time for the command
`BITMEX_API_KEY=XYZ BITMEX_API_SECRET=ABC node fetch-command-line.js 2019-01-01T00:00:00.000Z 2019-01-01T17:00:00.000Z > data.json`