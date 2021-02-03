import axios from 'axios'

let bearerToken = ''
const accountId = process.env.REACT_APP_TDA_ACCOUNT_ID
const url = 'https://api.tdameritrade.com/v1/'

export const init = async () => {
    await refreshAuth()

    // Auto refresh token every 29 minutes so that the auth never has to happen when
    // trying to trade.
    setTimeout(async () => {
        await refreshAuth()
    }, 29 * 60 * 1000)
}

export const refreshAuth = async () => {
    const data = new URLSearchParams()
    data.append('grant_type', 'refresh_token')
    data.append('refresh_token', process.env.REACT_APP_TDA_REFRESH_TOKEN)
    data.append('client_id', process.env.REACT_APP_TDA_CONSUMER_KEY)

    const result = await axios({
        method: 'post',
        url: `${url}oauth2/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data
    })

    bearerToken = result.data.access_token
}

export const getAccount = async () => {
    const result = await axios(`${url}accounts/${accountId}?fields=positions,orders`, {
        headers: { Authorization: `Bearer ${bearerToken}` }
    })
    const account = result.data.securitiesAccount
    return {
        ...account,
        cash: account.currentBalances.cashBalance
    }
}
