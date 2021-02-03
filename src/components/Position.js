import { Button, Divider, ListItem } from '@material-ui/core'
import { broker } from '../service/broker'
import React from 'react'

function Position(props) {
    const { position, setAccount, setPositions } = props

    const handleSellAll = async () => {
        try {
            await broker.createOrder({
                symbol: position.symbol,
                qty: position.qty,
                side: 'sell'
            })

            const results = await Promise.all([broker.getPositions(), broker.getAccount()])

            setPositions(results[0])
            setAccount(results[1])
        } catch (e) {
            console.error('Error selling positions:', e)
        }
    }

    return (
        <React.Fragment key={position.asset_id}>
            <ListItem button display="flex" style={{ justifyContent: 'space-between' }}>
                <div>
                    <span style={{ fontWeight: 'bold' }}>{position.symbol}</span>
                    <span style={{ color: '#bebebe', marginLeft: '10px' }}>{position.exchange}</span>
                    <span style={{ color: '#bebebe', marginLeft: '10px' }}>
                        {position.qty} Shares at ~ {position.avg_entry_price}
                    </span>
                </div>
                <div>
                    <Button variant="outlined" color="primary" onClick={handleSellAll} style={{ marginLeft: '20px' }}>
                        Sell All
                    </Button>
                </div>
            </ListItem>
            <Divider />
        </React.Fragment>
    )
}

export default Position
