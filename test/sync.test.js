/* global describe it */
import {assert} from 'chai'
import {run} from 'syncano-test'
import meta from './meta'
import {mockSync} from './mock'
import {sync, lock, user, lockfilter} from './utils'
describe('sync', function () {
  it('create', async function () {
    const sync = mockSync()
    let res = await run('sync', {args: sync, meta})
    let lock = await lockfilter(sync)
    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/json')
    assert.propertyVal(res.data, 'appid', sync.appid)
    assert.propertyVal(res.data, 'tid', sync.tid)
    assert.propertyVal(res.data, 'entity', sync.entity)
  })
  it('create user object', async function () {
    const sync = mockSync({secret: true})
    const userObject = await user()
    let res = await run('sync', {args: sync, meta: {...meta, user: userObject}})
    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/json')
    assert.propertyVal(res.data, 'user', userObject.id)
  })
  it('create user object and not logged in', async function () {
    const userObject = await user()
    const syncObject = await sync({user: userObject.id, secret: true})
    await lock({
      appid: syncObject.appid,
      entity: syncObject.entity,
      latestTid: syncObject.tid,
      user: userObject.id
    })
    let sync2 = mockSync()
    sync2 = {
      ...sync2,
      appid: syncObject.appid,
      entity: syncObject.entity,
      latestTid: syncObject.tid,
      secret: true
    }
    let res = await run('sync', {args: sync2, meta: {...meta}})
    assert.propertyVal(res, 'code', 409)
    assert.propertyVal(res, 'mimetype', 'application/json')
  })
  it('create and update', async function () {
    const syncObject = await sync()
    await lock({
      appid: syncObject.appid,
      entity: syncObject.entity,
      latestTid: syncObject.tid
    })
    let sync2 = mockSync()
    sync2 = {
      ...sync2,
      appid: syncObject.appid,
      entity: syncObject.entity,
      latestTid: syncObject.tid
    }
    let res = await run('sync', {args: sync2, meta})

    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/json')
    assert.propertyVal(res.data, 'appid', sync2.appid)
    assert.propertyVal(res.data, 'tid', sync2.tid)
    assert.propertyVal(res.data, 'entity', sync2.entity)
  })
  it('create and cant update because wrong latestTid', async function () {
    const syncObject = await sync()
    await lock({
      appid: syncObject.appid,
      entity: syncObject.entity,
      latestTid: syncObject.tid
    })
    let sync2 = mockSync()
    sync2 = {
      ...sync2,
      appid: syncObject.appid,
      entity: syncObject.entity,
      latestTid: sync2.tid
    }
    let res = await run('sync', {args: sync2, meta})
    assert.propertyVal(res, 'code', 409)
    assert.propertyVal(res, 'mimetype', 'application/json')
  })
  it('create and cant update because no latestTid', async function () {
    const syncObject = await sync()
    await lock({
      appid: syncObject.appid,
      entity: syncObject.entity,
      latestTid: syncObject.tid
    })
    let sync2 = mockSync()
    sync2 = {
      ...sync2,
      appid: syncObject.appid,
      entity: syncObject.entity
    }
    let res = await run('sync', {args: sync2, meta})
    assert.propertyVal(res, 'code', 409)
    assert.propertyVal(res, 'mimetype', 'application/json')
  })
})
