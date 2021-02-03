import Alpaca from '@alpacahq/alpaca-trade-api'

let alpaca

export const init = async () => {
    const settings = {
        keyId: process.env.REACT_APP_ALP_CLIENT_ID,
        secretKey: process.env.REACT_APP_ALP_CLIENT_SECRET,
        paper: true,
        usePolygon: false
    }

    alpaca = new Alpaca(settings)
    return alpaca
}

export const getAccount = async () => {
    console.log('getting account')
    if (!alpaca) {
        throw 'Alpaca must be initilized before retrieving account details'
    }

    const account = await alpaca.getAccount()
    return {
        ...account,
        isDayTrader: account.pattern_day_trader
    }
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
