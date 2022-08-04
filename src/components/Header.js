import styled from 'styled-components'

import SignInOut from '../../src/components/SignInOut'

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

const Logo = styled.div`
    padding-left: 10px;
    font-size: 1em;
    font-weight: bold;
    font-family: 'Fira Code', monospace;
    color: red;
`

const UserPanel = styled.div`
    padding-right: 10px;
`

export default function Header({ user }) {
    return (
        <Wrapper>
            <Logo>
                Raft v0.1.0
            </Logo>
            <UserPanel>
                <SignInOut
                    user={user}
                />
            </UserPanel>
        </Wrapper>
    )
}