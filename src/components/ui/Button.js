import styled from "styled-components"
import Spinner from "./Spinner"

const ButtonTemplate = styled.button`
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    background-color: ${props => props.disabled ? "gray" : (props.color || "blue")};
    color: white;
    border: 1px solid black;
    padding: 1px 15px;
    cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
`

export default function Button({ className, label, onClick, color, disabled, spinner }) {
    return (
        <ButtonTemplate className={className} onClick={onClick} color={color} disabled={disabled || spinner}>
            {spinner
                ? <Spinner color="white"/>
                : label
            }
        </ButtonTemplate>
    )
}