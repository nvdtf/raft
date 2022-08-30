import styled from "styled-components"
import * as fcl from "@onflow/fcl"

import Button from "./ui/Button"

const LoggedInWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`

export default function SignInOut({user}) {
    if (user.loggedIn) {
        return (
            <LoggedInWrapper>
                {user.addr}
                <Button
                    label='Log out'
                    onClick = {() => fcl.unauthenticate()}
                    color='red'
                />
            </LoggedInWrapper>
        )
    }
    return (
        <Button
            label='Connect Wallet'
            onClick = {() => fcl.authenticate()}
        />
    )
}