import * as alpaca from './alpaca'
import * as tda from './tda'

export let broker

export const init = async (isPaper) => {
    if (isPaper) {
        await alpaca.init()
        broker = alpaca
    } else {
        await tda.init()
        broker = tda
    }
}
