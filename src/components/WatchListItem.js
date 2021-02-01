import { Button, Divider, TextField, ListItem, Checkbox } from '@material-ui/core'
import React, { useState } from 'react'
import * as alpaca from '../service/alpaca'

function WatchListItem(props) {
    const { asset, account, setAccount } = props
    const [sharesCount, setSharesCount] = useState(0)
    const [canBuy, setCanBuy] = useState(false)

    // Temporary until I can get price from an API.
    const [price, setPrice] = useState(0)

    const handleShareCountChange = (e) => {
        setSharesCount(e.target.value)
    }

    const handlePriceChange = (e) => {
        setPrice(e.target.value)
    }

    const handleBuySharesKeyPress = (event) => {
        if (event.key === 'Enter' && canBuy) {
            handleBuyShares()
        }
    }

    const handleBuyShares = () => {
        setSharesCount(0)
    }

    const handleBuyMaxKeyPress = (event) => {
        if (event.key === 'Enter' && canBuy) {
            handleBuyMax()
        }
    }

    const handleBuyMax = async () => {
        try {
            const bufferPercentage = 0.05
            const maxShares = Math.floor(account.cash / (price * (1 + bufferPercentage)))

            console.log(`Max shares for $${account.cash} cash at $${price} is ${maxShares}.`)
            console.log(`Buying ${maxShares} shares of ${asset.symbol}`)

            await alpaca.createOrder({
                symbol: asset.symbol,
                qty: maxShares,
                side: 'buy'
            })

            setAccount(await alpaca.getAccount())
        } catch (e) {
            console.error('Error placing order:', e)
        }

        // Set the price regardless because the order is still in limbo.
        setPrice(0)
    }

    const handleCanBuyChange = (e) => {
        setCanBuy(e.target.checked)
    }

    return (
        <React.Fragment key={asset.symbol + asset.exchange}>
            <ListItem button display="flex" style={{ justifyContent: 'space-between' }}>
                <div>
                    {/* The goal of this checkbox is to prevent misclicks from buying the wrong stock. */}
                    <Checkbox checked={canBuy} onChange={handleCanBuyChange} />
                    <span style={{ fontWeight: 'bold' }}>{asset.symbol}</span>
                    <span style={{ color: '#bebebe', marginLeft: '10px' }}>{asset.exchange}</span>
                    {asset.tradable ? '' : ' - NOT TRADABLE'}
                </div>
                <div>
                    <TextField
                        id="sharesCount"
                        style={{ width: '50px' }}
                        name="sharesCount"
                        value={sharesCount}
                        onKeyPress={handleBuySharesKeyPress}
                        onChange={handleShareCountChange}
                    />
                    <Button
                        variant="outlined"
                        disabled={sharesCount === 0 || !canBuy}
                        color="primary"
                        onClick={handleBuyShares}
                        style={{ marginLeft: '20px' }}
                    >
                        Buy shares
                    </Button>
                    <TextField
                        id="price"
                        style={{ marginLeft: '20px', width: '50px' }}
                        name="price"
                        value={price}
                        onKeyPress={handleBuyMaxKeyPress}
                        onChange={handlePriceChange}
                    />
                    <Button
                        variant="outlined"
                        disabled={!canBuy || !price}
                        color="primary"
                        onClick={handleBuyMax}
                        style={{ marginLeft: '20px' }}
                    >
                        Buy Max
                    </Button>
                </div>
            </ListItem>
            <Divider />
        </React.Fragment>
    )
}

export default WatchListItem
