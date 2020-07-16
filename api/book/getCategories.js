import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { db } from '../DBConfig'

async function getCategories() {
    try {
        let result = await db.collection('categories').get()
        let categories = []
        if (result) {
            result.forEach(doc => {
                categories.push(doc.data())
            })

            return categories
        }

    } catch (err) {
        throw err
    }
}

export { getCategories }