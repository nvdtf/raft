import styled from "styled-components"

const Container = styled.div`
    display: flex;
    flex-direction: row;
`

const Input = styled.input`
    margin-left: 10px;
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