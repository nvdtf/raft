import { useState } from "react"
import styled from "styled-components"

const Panel = styled.div`
    white-space: pre;
    background-color: whitesmoke;
    color: dimgray;
    padding: 5px 15px;
    width: fit-content;
    min-width: 100%;
`
export default function Log({log}) {
    return (
        <Panel>
            {log}
        </Panel>
    )
}