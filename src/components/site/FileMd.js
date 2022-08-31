import Panel from "../ui/Panel"

import styled from "styled-components"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Wrapper = styled.div.attrs({
        className: 'markdown-body'
    })``

export default function FileMd({header, content}) {
    const contents = (
        <Wrapper>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </Wrapper>
    )

    return (
        <Panel
            header={header}
            contents={contents}
        />
    )
}