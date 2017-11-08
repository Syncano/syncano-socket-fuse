import Server from 'syncano-server'

export default async ctx => {
  const {data, response, channel} = Server(ctx)

  try {
    const {user} = ctx.meta
    const {
      appid,
      entity,
      action,
      payload,
      tid,
      secret = false,
      latestTid = null
    } = ctx.args

    let query = data.lock.where('appid', appid).where('entity', entity)
    let userId = user ? user.id : null

    if (secret === true && userId === null) {
      throw new Error('If creating a secret object you must be logged in')
    }
    if (userId !== null && secret === true) {
      query = query.where('user', userId)
    }

    lock = await query.list()
    if (lock.length === 0) {
      // Create new lock if it doesn't exist
      let lockParams = {
        appid,
        entity,
        latestTid: tid
      }
      if (secret === true) {
        lockParams = {...lockParams, user: userId}
      }
      lock = [await data.lock.create(lockParams)]
    }
    lock = lock[0]

    if (latestTid === null && lock.latestTid !== tid) {
      throw new Error('Please provide last id')
    }
    if (latestTid !== null && lock.latestTid !== latestTid) {
      throw new Error('Transaction id mismatch')
    }

    await data.lock.update(lock.id, {
      expected_revision: lock.revision,
      latestTid: tid
    })

    let params = {
      appid,
      entity,
      action,
      payload,
      tid
    }
    // if secret is true make this user owned object
    if (secret === true) {
      params = {
        ...params,
        secret: true,
        user: userId
      }
    }

    const createdTransaction = await data.transaction.create(params)
    const messagesString = secret === true && userId !== null
      ? `user_messages.${appid}.${userId}`
      : `messages.${appid}`

    channel.publish(messagesString, {entity, action, payload, tid})
    return response.json(createdTransaction)

  } catch ({message}) {
    return response.json(message, 409)
  }
}
