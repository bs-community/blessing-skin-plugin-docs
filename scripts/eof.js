const fs = require('fs-extra')

const BASE_PATH = './guide/'

const tasks = fs.readdirSync(BASE_PATH)
  .filter(file => fs.statSync(BASE_PATH + file).isFile())
  .map(async file => {
    const location = BASE_PATH + file
    const content = await fs.readFile(location, 'utf-8')
    if (!content.endsWith('\n')) {
      return fs.writeFile(location, `${content}\n`)
    }
  })

Promise.all(tasks)
