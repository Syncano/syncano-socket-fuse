import Server from 'syncano-server'
export default async ctx => {
  const {data, response} = Server(ctx)
  const {pool, lastId} = ctx.args
  // GET LATEST TRANSACTION
  const createNewTransaction = async () => {
    const transaction = await data.transaction.create({
      pool
    })
    return response.json({
      transaction,
      message: 'New transaction added'
    })
  }
  try {
    const lastTransactionInPool = await data.transaction
      .where('pool', pool)
      .orderBy('created_at', 'desc')
      .firstOrFail()
    // TRANSACTION IS NOT EQUAL TO SENT ID
    if (typeof lastId === 'undefined') {
      return response.json(
        {
          message: 'Please provide correct last transaction id'
        },
        400
      )
    }
    if (lastId !== lastTransactionInPool.id) {
      return response.json(
        {
          message: 'Transaction ids not equal'
        },
        400
      )
    }
    return createNewTransaction()
  } catch (error) {
    if (typeof lastId === 'undefined') {
      return createNewTransaction()
    } else {
      return response.json(
        {
          message: 'Please create initial transaction'
        },
        400
      )
    }
  }
  // TRANSACTION IS EQUAL TO SENT ID
}
