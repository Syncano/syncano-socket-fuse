import Server from 'syncano-server'
export default async ctx => {
  const {data, response} = Server(ctx)
  const {name} = ctx.args
  try {
    if (typeof name === 'undefined') {
      throw new Error('Name not specified')
    }
    const pool = await data.pool.create({name})
    return response.json(pool)
  } catch ({data}) {
    return response.json(data, 400)
  }
}
