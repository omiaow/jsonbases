const fs = require('fs')
const path = require('path')

const jsonbases = (name, format, directory) => {

    const dataFormat = JSON.parse(JSON.stringify(format))
    dataFormat.uniques.push('_id')

    const folderPath = directory ? directory : './jsonbases'

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const path = `${folderPath}/${name}.json`

    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify([]))
    }

    const checkFormat = (item) => {
        let checkTypes = true
        for (const key in dataFormat.types) {
            if (!(typeof item[key] === dataFormat.types[key] || item[key] === null)) {
                console.error('---------- Error! ----------')
                console.error('Types are not matching')
                console.error(`${key} => ${item[key]}`)
                console.error('----------------------------')
                checkTypes = false
            }
        }

        let checkRequireds = true
        for (const key of dataFormat.requireds) {
            if(item[key] === null || item[key] === undefined) {
                console.error('---------- Error! ----------')
                console.error('Required fields are not filled')
                console.error(`${key} => ${item[key]}`)
                console.error('----------------------------')
                checkRequireds = false
            }
        }

        return checkTypes && checkRequireds
    }

    const createItem = () => {

        const data = JSON.parse(fs.readFileSync(path))

        const existsId = (id) => {
            for (const item of data) {
                if (item._id === id) return true
            }
            return false
        }
        
        const timestamp = Date.now().toString(36)
        let randomString = Math.random().toString(36).substring(2, 8)

        while (existsId(timestamp + randomString)) {
            randomString = Math.random().toString(36).substring(2, 8)
        }

        const item = { _id: timestamp + randomString }
        for (const key in dataFormat.types) {
            item[key] = null
        }
        return item
    }

    const add = (item) => {
        const data = JSON.parse(fs.readFileSync(path))
        
        let checkUniques = true
        for (const element of data) {
            for (const key of dataFormat.uniques) {
                if (element[key] === item[key]) {
                    console.error('---------- Error! ----------')
                    console.error('Unique value was already given')
                    console.error(`${key} => ${item[key]}`)
                    console.error('----------------------------')
                    checkUniques = false
                }
            }
        }
        
        if (!checkFormat(item) && checkUniques) return false

        let i=0
        while (i < data.length) {
            if (data[i]._id === item._id) break
            else i++
        }
        if (i < data.length) return false

        data.push(item)

        fs.writeFileSync(path, JSON.stringify(data))
        
        return true
    }

    const find = (item) => {
        const data = JSON.parse(fs.readFileSync(path))

        for (const key in item) {
            if (!dataFormat.uniques.includes(key)) {
                console.error('---------- Error! ----------')
                console.error('Find item only with unique values')
                console.error(`${key} => ${item[key]}`)
                console.error('----------------------------')
                return null
            }
        }

        for (const element of data) {
            let check = true
            for (const key in item) {
                check = check && item[key] === element[key]
            }
            if (check) return JSON.parse(JSON.stringify(element))
        }
        
        return null
    }

    const findAll = (item) => {
        const data = JSON.parse(fs.readFileSync(path))

        let result = []
        data.forEach(element => {
            let check = true
            for (const key in item) check = check && item[key] === element[key]
            if (check) result.push(element)
        })
    
        return result
    }

    const update = (item) => {
        const data = JSON.parse(fs.readFileSync(path))

        if (!item._id) {
            console.error('---------- Error! ----------')
            console.error('Your input doesn\' have _id. Update with original item!')
            console.error(`object._id => ${item._id}`)
            console.error('----------------------------')
            return false
        }
        
        if (!checkFormat(item, data)) return false

        let i=0
        while (i < data.length) {
            if (data[i]._id === item._id) break
            else i++
        }

        for (const key of dataFormat.uniques) {
            if (data[i][key] !== item[key]) {
                for (const element of data) {
                    if (element._id !== item._id && element[key] === item[key]) {
                        console.error('---------- Error! ----------')
                        console.error('Unique value already exist.')
                        console.error(`${key} => ${item[key]}`)
                        console.error('----------------------------')
                        return false
                    }
                }
            }
        }

        if (i < data.length) {
            data[i] = JSON.parse(JSON.stringify(item))
            fs.writeFileSync(path, JSON.stringify(data))
            return true
        }

        return false
    }

    const remove = (item) => {
        const data = JSON.parse(fs.readFileSync(path))

        for (const key in item) {
            if (!dataFormat.uniques.includes(key)) {
                console.error('---------- Error! ----------')
                console.error('Remove item only with unique values')
                console.error(`${key} => ${item[key]}`)
                console.error('----------------------------')
                return false
            }
        }

        let i=0
        while (i < data.length) {
            let check = true
            for (const key in item) check = check && item[key] === data[i][key]
            if (check) break
            else i++
        }
        if (i < data.length) {
            data.splice(i, 1)
            fs.writeFileSync(path, JSON.stringify(data))
            return true
        }

        return false
    }

    const removeAll = (item) => {
        const data = JSON.parse(fs.readFileSync(path))

        let ids = []
        data.forEach((element, i) => {
            let check = true
            for (const key in item) check = check && item[key] === element[key]
            if (check) ids.unshift(i)
        })

        let result = false
        for (const id of ids) {
            data.splice(id, 1)
            result = true
        }

        fs.writeFileSync(path, JSON.stringify(data))
        return result
    }

    const getAll = () => {
        const data = JSON.parse(fs.readFileSync(path))
        return data
    }

    const reset = () => {
        fs.writeFileSync(path, JSON.stringify([]))
    }

    return { createItem, add, find, findAll, update, remove, removeAll, getAll, reset }
}

module.exports = jsonbases