let fs = require('fs');
let path = require('path');
let artPath = path.join(__dirname, '/pages/Article/');
let mdsPath = path.join(artPath + '/mds/');
let mdsDir = fs.readdirSync(mdsPath)
let namesFile = path.join(artPath + '/names.js')
let mdsDir2 = mdsDir.filter((dir) => {
  return ~dir.indexOf('.md')
})
fs.writeFileSync(namesFile, JSON.stringify(mdsDir2));
