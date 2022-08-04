import { useState } from "react"
import styled from "styled-components"

const Panel = styled.div`
    white-space: pre-line;
`
export default function Log({log}) {
    return (
        <Panel>
            {log}
        </Panel>
    )
}