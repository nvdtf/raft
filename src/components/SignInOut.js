import styled from "styled-components"
import * as fcl from "@onflow/fcl"

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`

const SignInButton = styled.button`
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    background-color: blue;
    color: white;
    border: 1px solid black;
    padding: 1px 15px;
`

const SignOutButton = styled.button`
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    background-color: red;
    color: white;
    border: 1px solid black;
    padding: 1px 15px;
`

const UserAddress = styled.div`
    font-family: 'Fira Code', monospace;
    font-size: 1em;
`

export default function SignInOut({user}) {
    if (user.loggedIn) {
        return (
            <Wrapper>
                <UserAddress>
                    {user.addr}
                </UserAddress>
                <SignOutButton
                    onClick = {() => fcl.unauthenticate()}
                >
                    Logout
                </SignOutButton>
            </Wrapper>
        )
    }
    return (
        <>
            <SignInButton
                onClick = {() => fcl.authenticate()}
            >
                Connect Wallet
            </SignInButton>
        </>
    )
}