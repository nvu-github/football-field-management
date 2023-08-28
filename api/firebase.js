import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

import config from '@root/firebase-config.json'

const app = initializeApp(config)
const database = getDatabase(app)
const storage = getStorage(app)

export { database, storage }
