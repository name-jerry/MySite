let fs = require('fs');
let path = require('path');
let mdsPath = path.join(__dirname, './ignore/mds/');
let mds = fs.readdirSync(mdsPath)
let namesPath = path.join(mdsPath, '../names.js')
let mds2 = mds.filter((dir) => {
  return ~dir.indexOf('.md')
})
fs.writeFileSync(namesPath, JSON.stringify(mds2));