import { createContext, useContext, useState } from 'react';

import {createStarryNight} from '@wooorm/starry-night'
import sourceCadence from '@wooorm/starry-night/lang/source.cadence.js'

export const HighlighterContext = createContext()

export const useHighlighter = () => useContext(HighlighterContext)

export default function HighlighterProvider({ children }) {

    const [highlighter, setHighlighter] = useState();

    (async () => {
        if (!highlighter) {
            const starryNight = await createStarryNight([sourceCadence])
            setHighlighter(starryNight)
        }
    })()

    return (
        <HighlighterContext.Provider value={highlighter}>
            {children}
        </HighlighterContext.Provider>
    )
}