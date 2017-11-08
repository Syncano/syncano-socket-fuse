import Server from 'syncano-server'

export default async ctx => {
  const {data, response} = Server(ctx)

  try {
    const {user} = ctx.meta
    const {appid = null, entity = null, secret = false} = ctx.args
    const userId = user ? user.id : null

    let query = data.transaction.where('appid', appid).where('entity', entity)

    if (userId !== null && secret === true) {
      query = query.where('user', userId)
    }

    transactions = await query.list()
    transactions = transactions.filter(t => {
      if (t.user !== null) {
        return t.user === userId
      }

      return true
    })
    return response.json(transactions)

  } catch (error) {
    return response.json({message: error.message}, 400)
  }
}
