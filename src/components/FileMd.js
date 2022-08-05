import styled from "styled-components"
import ReactMarkdown from 'react-markdown'

const Panel = styled.div`
    border-radius: 10px;
    border: 1px solid lightgrey;
    width: 100%;
    height: 100%;
    overflow: scroll;
`

const Header = styled.div`
    padding: 5px;
    background-color: white;
    border-bottom: 1px solid lightgray;
`

const ContentPanel = styled.div`
    padding: 1px 15px;
    background-color: white;
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