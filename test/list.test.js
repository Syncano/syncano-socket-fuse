/* global describe it */
import {assert} from 'chai'
import {run} from 'syncano-test'
import meta from './meta'
import {sync, user} from './utils'
let syncMock
describe('list', function () {
  it('list transactions', async function () {
    syncMock = await sync()
    const {appid, tid, entity} = syncMock
    let res = await run('list', {args: {appid, entity}, meta})
    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/json')
    assert.propertyVal(res.data[0], 'appid', appid)
    assert.propertyVal(res.data[0], 'tid', tid)
    assert.propertyVal(res.data[0], 'entity', entity)
  })
  it('list user transactions', async function () {
    const userObject = await user()
    const syncObject = await sync({secret: true, user: userObject.id})
    let res = await run('list', {
      args: {
        appid: syncObject.appid,
        entity: syncObject.entity,
        secret: true
      },
      meta: {...meta, user: userObject}
    })
    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/json')
  })
  it('incorrect', async function () {
    let res = await run('list', {args: {}, meta})
    assert.propertyVal(res, 'code', 400)
    assert.propertyVal(res, 'mimetype', 'application/json')
  })
})
