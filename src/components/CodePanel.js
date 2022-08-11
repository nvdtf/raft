import {toHtml} from 'hast-util-to-html'
import {createStarryNight, common} from '@wooorm/starry-night'
import sourceCadence from '@wooorm/starry-night/lang/source.cadence.js'

import styled from "styled-components"
import { useState, useEffect } from 'react'

const Wrapper = styled.div`
    white-space: pre;
`

export default function CodePanel({ code }) {

    const [prettyCode, setPrettyCode] = useState(code)

    const prettify = async () => {
        const starryNight = await createStarryNight([sourceCadence])
        const scope = starryNight.flagToScope('cadence')
        const tree = starryNight.highlight(code, scope)
        setPrettyCode(toHtml(tree))
    }

    useEffect(() => {
        prettify()
    }, [code])

    return (
        <Wrapper dangerouslySetInnerHTML={ { __html: prettyCode}}/>
    )
}

export async function getServerSideProps({ code }) {
    console.log(code)
    const starryNight = await createStarryNight([sourceCadence])
    const scope = starryNight.flagToScope('cadence')
    const tree = starryNight.highlight(code, scope)

    const prettyCode = toHtml(tree)

    return {
        props: {
            prettyCode
        }
    }
}