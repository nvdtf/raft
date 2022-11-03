import styled from 'styled-components'
import { useState } from 'react'

import SignInOut from '../auth/SignInOut'
import Spinner from '../ui/Spinner'
import FancyButton from '../ui/FancyButton'

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

const Center = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
`

const Logo = styled.div`
    padding-left: 10px;
    font-size: 1em;
    font-weight: bold;
    color: black;
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
                    Raft v0.1.0
                </Logo>
                <FancyButton
                    label='Submit Feedback'
                    onClick={() => window.location = 'mailto:navid@dapperlabs.com'}
                />

            </LeftSide>
            <Center>
                <a href={`https://github.com/${repoPath}`} target="_blank" rel="noreferrer">
                    github.com/{repoPath}
                </a>
                <select value={network} onChange={(e) => updateNetwork(e.target.value)}>
                    <option>Mainnet</option>
                    <option>Testnet</option>
                </select>
                {spin &&
                    <>
                        <NetworkChangeStatus>
                            {networkStatus}
                        </NetworkChangeStatus>
                        <Spinner color="blue"/>
                    </>
                }
            </Center>
            <UserPanel>
                <SignInOut
                    user={user}
                />
            </UserPanel>
        </Wrapper>
    )
}