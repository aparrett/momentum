import '../App.css'
import { Button, Container, TextField, Box, List, ListItem } from '@material-ui/core'
import React, { useState } from 'react'
import { broker } from '../service/broker'
import WatchListItem from './WatchListItem'
import Position from './Position'

const format = (number) => {
    return number ? Number(number).toLocaleString() : 0
}

function AccountInfo(props) {
    const { account } = props
    return (
        <Container style={{ marginTop: '20px' }}>
            {account.isDayTrader && (
                <div style={{ color: '#e53935' }}>Warning: You have been listed as a Pattern Day Trader.</div>
            )}
            <div>Cash: ${format(account.cash)}</div>
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
    const { watchList, setWatchList, account, setAccount, setPositions } = props
    const [newWatchItem, setNewWatchItem] = useState('')

    const handleNewWatchItemChange = (e) => {
        setNewWatchItem(e.target.value)
    }

    const handleAddWatchItem = async () => {
        try {
            const updatedWatchList = await broker.addToWatchList(watchList.id, newWatchItem)
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
                            setPositions={setPositions}
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
    const { isPaper, account, setAccount, watchList, setWatchList, positions, setPositions } = props

    return (
        <div>
            <Container>
                <Box display="flex" justifyContent="space-between">
                    {isPaper ? (
                        <div style={{ fontWeight: 'bold' }}>Simulating..</div>
                    ) : (
                        <div style={{ color: '#64dd17', fontWeight: 'bold' }}>Live!</div>
                    )}
                    <div>Welcome, Anthony</div>
                </Box>
            </Container>
            <AccountInfo account={account} />
            <WatchList
                watchList={watchList}
                setWatchList={setWatchList}
                setAccount={setAccount}
                account={account}
                setPositions={setPositions}
            />
            <Positions positions={positions} setAccount={setAccount} setPositions={setPositions} />
        </div>
    )
}

export default Account
