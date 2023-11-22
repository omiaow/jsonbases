const fs = require('fs')
const path = require('path')

const jsonbases = (name, format, directory) => {

    const dataFormat = {...format}

    dataFormat.types._id = 'string'
    if (dataFormat.uniques) dataFormat.uniques.push('_id')
    else dataFormat.uniques = ['_id']

    if (dataFormat.requireds) dataFormat.requireds.push('_id')
    else dataFormat.requireds = ['_id']

    const correctPath = (directory && directory[directory.length-1] === '/') ?
        directory.slice(0, directory.length-1) : directory
    const folderPath = correctPath ? correctPath : './jsonbases'

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
                console.error('\x1b[31m%s\x1b[0m', 'Types are not matching or assign as null')
                console.error(`${key} => ${item[key]}`)
                console.error('----------------------------')
                checkTypes = false
            }
        }
        
        let checkGarbage = true
        for (const key in item) {
            if (dataFormat.types[key] === undefined) {
                console.error('---------- Error! ----------')
                console.error('\x1b[31m%s\x1b[0m', 'Type is not defined in data format')
                console.error(`${key} => ${item[key]}`)
                console.error('----------------------------')
                checkGarbage = false
            }
        }

        let checkRequireds = true
        for (const key of dataFormat.requireds) {
            if(item[key] === null || item[key] === undefined) {
                console.error('---------- Error! ----------')
                console.error('\x1b[31m%s\x1b[0m', 'Required field is not filled')
                console.error(`${key} => ${item[key]}`)
                console.error('----------------------------')
                checkRequireds = false
            }
        }

        return checkTypes && checkGarbage && checkRequireds
    }

    const createItem = (length = 1) => {

        const existsId = (id, list) => {
            for (const item of list) {
                if (item._id === id) return true
            }
            return false
        }

        const data = JSON.parse(fs.readFileSync(path))
        const list = [...data]
        const result = []

        for (let i=0; i<length; i++) {
            const timestamp = Date.now().toString(36)
            let randomString = Math.random().toString(36).substring(2, 8)

            while (existsId(timestamp + randomString, list)) {
                randomString = Math.random().toString(36).substring(2, 8)
            }

            const item = { _id: timestamp + randomString }
            for (const key in dataFormat.types) {
                if (key !== '_id') item[key] = null
            }
            list.push(item)
            result.push(item)
        }

        return length > 1 ? result : result[0]
    }

    const add = (item) => {
        const data = JSON.parse(fs.readFileSync(path))
        
        for (const element of data) {
            for (const key of dataFormat.uniques) {
                if (element[key] === item[key]) {
                    console.error('---------- Error! ----------')
                    console.error('\x1b[31m%s\x1b[0m', 'Duplicate values are not allowed for unique element')
                    console.error(`${key} => ${item[key]}`)
                    console.error('----------------------------')
                    return false
                }
            }
        }

        if (!checkFormat(item, data)) return false
        
        data.push(item)

        fs.writeFileSync(path, JSON.stringify(data))
        
        return true
    }

    const find = (item) => {
        const data = JSON.parse(fs.readFileSync(path))

        for (const key in item) {
            if (!dataFormat.uniques.includes(key) && item[key] !== null) {
                console.error('---------- Error! ----------')
                console.error('\x1b[31m%s\x1b[0m', 'Find item only with unique values')
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
            if (check) return {...element}
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
                        console.error('\x1b[31m%s\x1b[0m', 'Duplicate values are not allowed for unique element')
                        console.error(`${key} => ${item[key]}`)
                        console.error('----------------------------')
                        return false
                    }
                }
            }
        }

        if (i < data.length) {
            data[i] = {...item}
            fs.writeFileSync(path, JSON.stringify(data))
            return true
        }

        return false
    }

    const remove = (item) => {
        const data = JSON.parse(fs.readFileSync(path))

        for (const key in item) {
            if (!dataFormat.uniques.includes(key) && item[key] !== null) {
                console.error('---------- Error! ----------')
                console.error('\x1b[31m%s\x1b[0m', 'Remove item only with unique values')
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

    const addFromList = (list) => {
        const checkList = (item, data) => {
            for (const element of data) {
                for (const key of dataFormat.uniques) {
                    if (element[key] === item[key]) {
                        console.error('---------- Error! ----------')
                        console.error('\x1b[31m%s\x1b[0m', 'Duplicate values are not allowed for unique element')
                        console.error(`${key} => ${item[key]}`)
                        console.error('----------------------------')
                        return false
                    }
                }
            }
            return true
        }

        const data = JSON.parse(fs.readFileSync(path))
        
        for (const i in list) {
            const item = list[i]
            if (!checkList(item, [...list.slice(0, i), ...list.slice(i+1, list.length)])) return false
            if (!checkList(item, data)) return false
            if (!checkFormat(item)) return false
        }

        for (const item of list) data.push(item)

        fs.writeFileSync(path, JSON.stringify(data))
        
        return true
    }
    
    const updateFromList = (list) => {
        const checkList = (item, data, checkId) => {
            for (const element of data) {
                for (const key of dataFormat.uniques) {
                    const check = checkId ? element._id !== item._id : true
                    if (element[key] === item[key] && check) {
                        console.error('---------- Error! ----------')
                        console.error('\x1b[31m%s\x1b[0m', 'Duplicate values are not allowed for unique element')
                        console.error(`${key} => ${item[key]}`)
                        console.error('----------------------------')
                        return false
                    }
                }
            }
            return true
        }

        const data = JSON.parse(fs.readFileSync(path))
        
        for (const i in list) {
            const item = list[i]
            if (!checkList(item, [...list.slice(0, i), ...list.slice(i+1, list.length)])) return false
            if (!checkList(item, data, true)) return false
            if (!checkFormat(item)) return false
        }

        for (const item of list) {
            let i=0
            while (i < data.length) {
                if (data[i]._id === item._id) break
                else i++
            }
            if (i < data.length) {
                data[i] = {...item}
            }
        }

        fs.writeFileSync(path, JSON.stringify(data))
        return true
    }

    const removeFromList = (list) => {
        const data = JSON.parse(fs.readFileSync(path))

        for (const item of list) {
            for (const key in item) {
                if (!dataFormat.uniques.includes(key)) {
                    console.error('---------- Error! ----------')
                    console.error('\x1b[31m%s\x1b[0m', 'Remove item only with unique values')
                    console.error(`${key} => ${item[key]}`)
                    console.error('----------------------------')
                    return false
                }
            }
        }

        let deleted = false
        for (const item of list) {
            let i=0
            while (i < data.length) {
                let check = true
                for (const key in item) check = check && item[key] === data[i][key]
                if (check) break
                else i++
            }
            if (i < data.length) {
                data.splice(i, 1)
                deleted = true
            }
        }

        fs.writeFileSync(path, JSON.stringify(data))

        return deleted
    }
    
    const getAll = () => {
        const data = JSON.parse(fs.readFileSync(path))
        return data
    }

    const reset = () => {
        fs.writeFileSync(path, JSON.stringify([]))
    }

    return { createItem, add, find, findAll, update, remove, removeAll, addFromList, updateFromList, removeFromList, getAll, reset }
}

module.exports = jsonbases