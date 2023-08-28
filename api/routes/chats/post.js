import { ref, push, onValue } from '@firebase/database'
import { database } from '@root/firebase'

export default async (req, res) => {
  const chatsRef = ref(database, 'Chat')
  push(chatsRef, req.body)
    .then(() => {
      console.log('Data written to the database successfully')
    })
    .catch(error => {
      console.error('Error writing data to the database:', error)
    })
  onValue(
    chatsRef,
    snapshot => {
      const data = snapshot.val()
      return res.send(data)
    },
    error => {
      console.error('Error reading data from the database:', error)
      return res.status(500)
    }
  )
}
