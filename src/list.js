import Server from 'syncano-server'
export default async ctx => {
  const {data, response} = Server(ctx)
  try {
    const {user} = ctx.meta
    const {appid = null, entity = null, secret = false} = ctx.args
    const userId = user ? user.id : null
    let list = data.transaction.where('appid', appid).where('entity', entity)
    if (userId !== null && secret === true) {
      list = list.where('user', userId)
    }
    list = await list.list()
    list = list.filter(l => {
      if (l.user !== null) {
        return l.user === userId
      }
      return true
    })
    return response.json(list)
  } catch (error) {
    return response.json({message: error.message}, 400)
  }
}
