import styled from "styled-components"
import ReactMarkdown from 'react-markdown'

const Panel = styled.div`
    padding: 0.5em;
    font-family: 'Fira Code', monospace;
    display: flex;
    flex-direction: column;
    gap: 3em;
`
const Section = styled.div`
`

const Title = styled.div`
`

const Item = styled.div`
    margin-left: 20px;
`

export default function ObjectTree({objects}) {
    return (
        <Panel>
            {objects.map(obj => (
                <Section>
                    <Title onClick={obj.onClick}>
                        {obj.title}
                    </Title>
                    {obj.children.map(item => (
                        <Item onClick={item.onClick}>
                            {item.path}
                        </Item>
                    ))}
                </Section>
            ))}
        </Panel>
    )
}