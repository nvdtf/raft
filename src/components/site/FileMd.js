import Panel from "../ui/Panel"

import styled from "styled-components"
import ReactMarkdown from 'react-markdown'
import { uriTransformer } from "react-markdown"
import remarkGfm from 'remark-gfm'

const Wrapper = styled.div.attrs({
        className: 'markdown-body'
    })``

function transformUrl(url, repo) {
    var shouldTransform = false

    // transform if no colon exists
    const colon = url.indexOf(':')
    if (colon === -1) {
        shouldTransform = true
    }

    if (shouldTransform) {
        var filePath = url
        // clean starting slash
        if (url.charAt(0) == '/') {
            filePath = url.slice(1)
        }

        return uriTransformer('/' + repo + '/' + filePath)
    }
    return uriTransformer(url)
}

export default function FileMd({header, content, repo}) {
    const contents = (
        <Wrapper>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                transformLinkUri={(href) => transformUrl(href, repo)}
            >
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