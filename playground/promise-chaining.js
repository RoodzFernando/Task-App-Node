require('../src/db/mongoose')
const Task = require('../src/models/task')

// 62369c425b00df19078a425d

// Task.findByIdAndDelete('62369c425b00df19078a425d')
// .then(task => Task.countDocuments({completed: false}))
// .then(res => console.log(res))
// .catch(e => console.log(e))

const deleteTaskAndCount = async id => {
  await Task.findByIdAndDelete(id)
  return await Task.countDocuments({completed: false})
}

deleteTaskAndCount('6237bcfb7e7f921f2eaf6798')
.then(data => console.log(data))