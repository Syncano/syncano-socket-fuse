/* global describe it */
import {assert} from 'chai'
import {run} from 'syncano-test'

describe('create pool', function () {
  const meta = {
    instance: process.env.SYNCANO_INSTANCE_NAME,
    token: process.env.ACCOUNT_KEY
  }
  it('correct', function (done) {
    run('create_pool', {meta, args: {name: 'swim'}})
      .then(res => {
        console.log(res)
        assert.propertyVal(res, 'code', 200)
        assert.propertyVal(res, 'mimetype', 'application/json')
        assert.propertyVal(res.data, 'name', 'swim')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('incorrect', function (done) {
    run('create_pool', {meta, args: {elo: 'swim'}})
      .then(res => {
        console.log(res)
        done()
      })
      .catch(err => {
        assert.propertyVal(err, 'code', 400)
        assert.propertyVal(err, 'mimetype', 'application/json')
        done(err)
      })
  })
})
