import ArgumentInput from "./ArgumentInput"

import styled from "styled-components"

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export default function ArgumentsPanel({ currentObject }) {
    return (
        <Wrapper>
            {currentObject.arguments && currentObject.arguments.map((arg, idx) => (
                <ArgumentInput
                    label={arg.name}
                    type={arg.type}
                    onChange={(v) => arg.value = v}
                    key={currentObject.path + arg.name + arg.type + idx}
                />
            ))}
        </Wrapper>
    )
}