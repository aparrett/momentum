import '../App.css'
import { Button, Container, TextField, Box, List, ListItem } from '@material-ui/core'
import React, { useState } from 'react'
import * as alpaca from '../service/alpaca'
import WatchListItem from './WatchListItem'
import Position from './Position'

const format = (number) => {
    return number ? Number(number).toLocaleString() : 0
}

function AccountInfo(props) {
    const { account } = props
    return (
        <Container style={{ marginTop: '20px' }}>
            {account.pattern_day_trader && (
                <div style={{ color: '#e53935' }}>Warning: Alpaca has listed you as a Pattern Day Trader.</div>
            )}
            {account.trade_suspended_by_user && (
                <div style={{ color: '#e53935' }}>Warning: You have suspended yourself from trading.</div>
            )}
            {account.trading_blocked && (
                <div style={{ color: '#e53935' }}>Warning: Alpaca has blocked trading until further notice.</div>
            )}
            <div>
                Cash: ${format(account.cash)} (${format(account.buying_power)})
            </div>
        </Container>
    )
}

function Positions(props) {
    const { positions, setPositions, setAccount } = props
    return (
        <Container style={{ marginTop: '20px' }}>
            <div>Positions</div>
            {!positions ? (
                <div>Loading...</div>
            ) : (
                <List>
                    {positions.map((position) => (
                        <Position
                            position={position}
                            setPositions={setPositions}
                            setAccount={setAccount}
                            key={position.asset_id}
                        />
                    ))}
                </List>
            )}
        </Container>
    )
}

function WatchList(props) {
    const { watchList, setWatchList, account, setAccount } = props
    const [newWatchItem, setNewWatchItem] = useState('')

    const handleNewWatchItemChange = (e) => {
        setNewWatchItem(e.target.value)
    }

    const handleAddWatchItem = async () => {
        try {
            const updatedWatchList = await alpaca.addToWatchList(watchList.id, newWatchItem)
            setWatchList(updatedWatchList)
            setNewWatchItem('')
        } catch (e) {
            console.log(e)
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAddWatchItem()
        }
    }

    return (
        <Container style={{ marginTop: '20px' }}>
            <div>Watch List</div>
            {!watchList ? (
                <div>Loading...</div>
            ) : (
                <List>
                    {watchList.assets.map((asset) => (
                        <WatchListItem
                            asset={asset}
                            account={account}
                            setAccount={setAccount}
                            key={asset.symbol + asset.exchange}
                        />
                    ))}
                    <ListItem>
                        <TextField
                            id="newWatchItem"
                            style={{ width: '50px' }}
                            name="newWatchItem"
                            value={newWatchItem}
                            onChange={handleNewWatchItemChange}
                            onKeyPress={handleKeyPress}
                        />
                        <Button
                            variant="outlined"
                            disabled={!newWatchItem || newWatchItem === ''}
                            color="primary"
                            onClick={handleAddWatchItem}
                            style={{ marginLeft: '20px' }}
                        >
                            Add +
                        </Button>
                    </ListItem>
                </List>
            )}
        </Container>
    )
}

function Account(props) {
    const { settings, account, setAccount, watchList, setWatchList, positions, setPositions } = props

    return (
        <div>
            <Container>
                <Box display="flex" justifyContent="space-between">
                    {settings.paper ? (
                        <div style={{ fontWeight: 'bold' }}>Simulating..</div>
                    ) : (
                        <div style={{ color: '#64dd17', fontWeight: 'bold' }}>Live!</div>
                    )}
                    <div>Welcome, Anthony</div>
                </Box>
            </Container>
            <AccountInfo account={account} />
            <WatchList watchList={watchList} setWatchList={setWatchList} setAccount={setAccount} account={account} />
            <Positions positions={positions} setAccount={setAccount} setPositions={setPositions} />
        </div>
    )
}

export default Account
