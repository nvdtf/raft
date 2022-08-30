import styled, { keyframes } from "styled-components"
import Button from "./Button"

const entice = keyframes`
0%,
100% {
    background-color: blue;
}

20%{
    background-color: chocolate;
}

40%{
    background-color: magenta;
}

60%{
    background-color: green;
}
`

const Fancy = styled(Button)`
    &:hover {
        animation:${entice} 3s linear infinite;
    }
`

export default function FancyButton(props) {
    return (
        <Fancy {...props}/>
    )
}