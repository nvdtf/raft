import styled from 'styled-components'
import { useState } from 'react'

import SignInOut from '../../src/components/SignInOut'
import Spinner from './Spinner'

const Wrapper = styled.div`
    width: 100%;
    height: 40px;
    background-color: white;
    border-bottom: 1px solid lightgray;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const LeftSide = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
`

const Logo = styled.div`
    padding-left: 10px;
    font-size: 1em;
    font-weight: bold;
    font-family: 'Fira Code', monospace;
    color: black;
`

const NetworkChangeStatus = styled.div`
    font-family: 'Fira Code', monospace;
    color: darkgray;
    font-size: 0.75em;
`

const UserPanel = styled.div`
    padding-right: 10px;
`

export default function Header({ user, network, onNetworkChange }) {

    const [spin, setSpin] = useState(false)
    const [networkStatus, setNetworkStatus] = useState('')

    function updateNetwork(network) {
        setSpin(true)
        setNetworkStatus('Switching to ' + network + ' ...')
        onNetworkChange(network)
    }

    return (
        <Wrapper>
            <LeftSide>
                <Logo>
                    Raft v0.1.0
                </Logo>
                <select value={network} onChange={(e) => updateNetwork(e.target.value)}>
                    <option>Mainnet</option>
                    <option>Testnet</option>
                </select>
                {spin &&
                    <>
                        <NetworkChangeStatus>
                            {networkStatus}
                        </NetworkChangeStatus>
                        <Spinner/>
                    </>
                }
            </LeftSide>
            <UserPanel>
                <SignInOut
                    user={user}
                />
            </UserPanel>
        </Wrapper>
    )
}