import styled from "styled-components"
import ReactMarkdown from 'react-markdown'

const Panel = styled.div`
    border-radius: 10px;
    border: 1px solid lightgrey;
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const Header = styled.div`
    padding: 5px;
    font-family: 'Fira Code', monospace;
    background-color: whitesmoke;
`

const ContentPanel = styled.div`
    padding: 5px 15px;
`

export default function FileMd({header, content}) {
    return (
        <Panel>
            <Header>
                {header}
            </Header>
            <ContentPanel>
                <ReactMarkdown>
                    {content}
                </ReactMarkdown>
            </ContentPanel>
        </Panel>
    )
}