import ArgumentInput from "./ArgumentInput"

import styled from "styled-components"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export default function ArgumentsPanel({ args }) {
    return (
        <Wrapper>
            {args && args.map(arg => (
                <ArgumentInput
                    label={arg.name}
                    type={arg.type}
                    onChange={(v) => arg.value = v}
                />
            ))}
        </Wrapper>
    )
}