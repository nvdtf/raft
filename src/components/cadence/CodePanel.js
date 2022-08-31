import {toHtml} from 'hast-util-to-html'

import styled from "styled-components"
import { useState, useEffect } from 'react'

import { useHighlighter } from "../../context/HighlighterProvider"

const Wrapper = styled.div`
    white-space: pre;
`

export default function CodePanel({ code }) {

    const [prettyCode, setPrettyCode] = useState(code)

    const highlighter = useHighlighter()

    const prettify = async () => {
        const scope = highlighter.flagToScope('cadence')
        const tree = highlighter.highlight(code, scope)
        setPrettyCode(toHtml(tree))
    }

    useEffect(() => {
        setPrettyCode(code)
        prettify()
    }, [code])

    return (
        <Wrapper dangerouslySetInnerHTML={{ __html: prettyCode}}/>
    )
}