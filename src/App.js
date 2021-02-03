import './App.css'
import { Button, Container, FormControlLabel, Switch } from '@material-ui/core'
import { useState } from 'react'
import { init, broker } from './service/broker'
import Account from './components/Account'

function App() {
    const [isPaper, setIsPaper] = useState(true)
    const [account, setAccount] = useState()
    const [closedOrders, setClosedOrders] = useState()
    const [positions, setPositions] = useState()
    const [watchList, setWatchList] = useState()

    const handleLiveSwitchChange = (event) => {
        setIsPaper(!event.target.checked)
    }

    const handleLogin = async () => {
        try {
            await init(isPaper)
            const account = await broker.getAccount()
            setAccount(account)
            const results = await Promise.all([broker.getClosedOrders(), broker.getPositions(), broker.getWatchList()])
            setClosedOrders(results[0])
            setPositions(results[1])
            setWatchList(results[2])
        } catch (e) {
            console.log('Error during init:', e)
        }
    }

    return (
        <div className="App">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            {!account ? (
                <Container>
                    <form noValidate>
                        <div>
                            <FormControlLabel
                                control={<Switch checked={!isPaper} onChange={handleLiveSwitchChange} name="paper" />}
                                label="Live"
                            />
                            <Button variant="outlined" color="primary" onClick={handleLogin}>
                                Login
                            </Button>
                        </div>
                    </form>
                </Container>
            ) : (
                <Account
                    account={account}
                    isPaper={isPaper}
                    watchList={watchList}
                    setWatchList={setWatchList}
                    setAccount={setAccount}
                    closedOrders={closedOrders}
                    positions={positions}
                    setPositions={setPositions}
                />
            )}
        </div>
    )
}

export default App
