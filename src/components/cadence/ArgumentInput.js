import styled from "styled-components"

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Input = styled.input`
    margin-left: 10px;
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    padding: 5px;
    flex-grow: 1;
`

const Label = styled.div`
`

export default function ArgumentInput({label, type, onChange}) {
    return (
        <Container>
            <Label>
                {label} ({type}):
            </Label>
            <Input
                type="text"
                onChange={(e) => onChange(e.target.value)}
            />
        </Container>
    )
}