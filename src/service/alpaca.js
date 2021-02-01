import Alpaca from '@alpacahq/alpaca-trade-api'

let alpacaSettings, alpaca

export const init = async (settings) => {
    if (!settings) {
        throw 'Alpaca settings not given. Unable to initialize.'
    }

    alpacaSettings = settings
    alpaca = new Alpaca(alpacaSettings)

    return await getAccount()
}

export const getAccount = () => {
    if (!alpaca) {
        throw 'Alpaca must be initilized before retrieving account details'
    }

    return alpaca.getAccount()
}

export const getClosedOrders = () => {
    return alpaca.getOrders({
        status: 'closed',
        limit: 100,
        nested: true // show nested multi-leg orders
    })
}

export const getPositions = () => {
    return alpaca.getPositions()
}

export const getWatchList = async () => {
    const watchlists = await alpaca.getWatchlists()
    return await alpaca.getWatchlist(watchlists[0].id)
}

export const addToWatchList = (id, symbol) => {
    // Returns the updated watch list.
    return alpaca.addToWatchlist(id, symbol)
}

export const removeFromWatchList = (id, symbol) => {
    // Returns the updated watch list.
    return alpaca.deleteFromWatchlist(id, symbol)
}

export const createOrder = async (orderToCreate) => {
    let order = await alpaca.createOrder({ ...orderToCreate, type: 'market', time_in_force: 'day' })
    let count = 0
    while (count < 30 && order.status !== 'filled') {
        order = await alpaca.getOrder(order.id)
        count++
    }

    if (order.status === 'filled') {
        return order
    } else {
        throw `Order is not yet filled. Current status is: ${order.status}`
    }
}
