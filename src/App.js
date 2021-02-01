import './App.css'
import { Button, Container, TextField, FormControlLabel, Switch } from '@material-ui/core'
import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import * as alpaca from './service/alpaca'
import Account from './components/Account'

const useStyles = makeStyles((theme) => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch'
    }
}))

function App() {
    const classes = useStyles()

    // Prevents dev from having to keep entering login information while in local.
    const initialSettings = {
        keyId: process.env.REACT_APP_CLIENT_ID || '',
        secretKey: process.env.REACT_APP_CLIENT_SECRET || '',
        paper: true,
        usePolygon: false
    }
    const [settings, setSettings] = useState(initialSettings)
    const [account, setAccount] = useState()
    const [closedOrders, setClosedOrders] = useState()
    const [positions, setPositions] = useState()
    const [watchList, setWatchList] = useState()

    const handleSettingsChange = (event) => {
        setSettings((prevSettings) => ({ ...prevSettings, [event.target.name]: event.target.value }))
    }

    const handleLiveSwitchChange = (event) => {
        setSettings((prevSettings) => ({ ...prevSettings, [event.target.name]: !event.target.checked }))
    }

    const handleLogin = async () => {
        try {
            setAccount(await alpaca.init(settings))
            const results = await Promise.all([alpaca.getClosedOrders(), alpaca.getPositions(), alpaca.getWatchList()])
            setClosedOrders(results[0])
            setPositions(results[1])
            setWatchList(results[2])
        } catch (e) {
            console.log('Error logging in:', e)
        }
    }

    return (
        <div className="App">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            {!account ? (
                <Container>
                    <form noValidate>
                        <div>
                            <TextField
                                id="keyId"
                                name="keyId"
                                label="Client Id"
                                value={settings.keyId}
                                onChange={handleSettingsChange}
                                className={classes.textField}
                            />
                            <TextField
                                id="secretKey"
                                name="secretKey"
                                label="Secret"
                                value={settings.secretKey}
                                onChange={handleSettingsChange}
                                className={classes.textField}
                                type="password"
                            />
                            <FormControlLabel
                                control={
                                    <Switch checked={!settings.paper} onChange={handleLiveSwitchChange} name="paper" />
                                }
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
                    settings={settings}
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
