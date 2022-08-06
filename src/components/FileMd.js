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
    top: 0;
    padding: 5px;
    background-color: white;
    border-bottom: 1px solid lightgray;
`

const ContentPanel = styled.div.attrs({
        className: 'markdown-body'
    })`
    padding: 10px 25px 50px 25px;
    background-color: white;
    height: 100%;
    overflow: scroll;
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