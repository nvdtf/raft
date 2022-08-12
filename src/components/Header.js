import styled from 'styled-components'
import { useState } from 'react'

import SignInOut from '../../src/components/SignInOut'
import Spinner from './Spinner'

const Wrapper = styled.div`
    height: 100%;
    background-color: honeydew;
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

const FeedbackButton = styled.a`
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    background-color: blue;
    color: white;
    border: 1px solid black;
    padding: 1px 15px;
`

const Logo = styled.div`
    padding-left: 10px;
    font-size: 1em;
    font-weight: bold;
    color: black;
`

const Path = styled.div`
`

const NetworkChangeStatus = styled.div`
    color: darkgray;
    font-size: 0.75em;
`

const UserPanel = styled.div`
    padding-right: 10px;
`

export default function Header({ user, repoPath, network, onNetworkChange }) {

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
                    Raft
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
                <FeedbackButton
                    href="mailto:navid@dapperlabs.com"
                >
                    Submit Feedback
                </FeedbackButton>
            </LeftSide>
            <Path>
                {repoPath}
            </Path>
            <UserPanel>
                <SignInOut
                    user={user}
                />
            </UserPanel>
        </Wrapper>
    )
}