import Syncano from 'syncano-server'
import meta from './meta'
import {mockSync, mockLock} from './mock'
import faker from 'faker'
const {data, users} = Syncano({meta})

export const sync = params => data.transaction.create(mockSync(params))
export const lock = params => data.lock.create(mockLock(params))
export const lockfilter =  (sync) => data.lock.where('entity',sync.entity).where('appid',sync.appid).firstOrFail()
export const user = () =>
  users.create({
    username: faker.internet.userName(),
    password: faker.internet.password()
  })
