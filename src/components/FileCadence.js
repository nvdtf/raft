import * as fcl from "@onflow/fcl"
import { useEffect, useState } from "react"

import styled from "styled-components"
import ArgumentsPanel from "./ArgumentsPanel"
import Log from "./Log"
import CodePanel from "./CodePanel"
import Panel from "./Panel"

const FloatingPanel = styled.div`
    position: absolute;
    top: 70px;
    right: 40px;
    border: 1px solid lightgray;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 20px;
    background-color: white;
`

const Run = styled.button`
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    background-color: green;
    color: white;
    border: 1px solid black;
    padding: 1px 15px;
    padding: 5px 30px 5px 30px;
    align-self: center;
`

const Result = styled.div`
    background-color: whitesmoke;
    border: 1px solid lightgray;
    border-radius: 10px;
    color: dimgray;
    padding: 5px 15px;
    overflow: scroll;
    font-size: 0.75em;
    width: 400px;
`

async function runScript(code, args) {
    const result = await fcl.query({
        cadence: code,
        // args: (arg, t) => [
        //     arg("test", t.String)
        // ],
        // args: [
        //     cadut.mapArgument("test", "String")
        // ]
        // args: (arg, t) => [
        //     arg("test", t["String"])
        // ]
        args: (arg, t) => args?.map(a => {
            return arg(a.value, t[a.type])
        })
    })
    return result
}

async function runTransaction(code, args) {
    const txId = await fcl.mutate({
        cadence: code,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 9999,
        args: (arg, t) => args?.map(a => {
            return arg(a.value, t[a.type])
        })
    })

    const tx = await fcl.tx(txId).onceSealed()
    return tx
}

export default function FileCadence({ currentObject}) {

    const code = currentObject.contents

    const isScript = currentObject.type == 'Script'

    const [log, setLog] = useState('Ready\n')

    async function l(what) {
        setLog((prevLog, props) => (
            prevLog + what + '\n'
        ))
    }

    async function run() {
        l('Running ...')

        let result
        try {
            if (isScript) {
                result = await runScript(code, currentObject.arguments)
            } else {
                result = await runTransaction(code, currentObject.arguments)
            }
        } catch (error) {
            result = error
            console.log(error)
        }

        l('Result: ' + result)
    }

    const contents = (
        <>
            <FloatingPanel>
                <ArgumentsPanel
                    args={currentObject.arguments}
                />
                <Run onClick={run}>Run</Run>
                <Result>
                    <Log
                        log={log}
                    />
                </Result>
            </FloatingPanel>
            <CodePanel
                code={code}
            />
        </>
    )

    return (
        <Panel
            header={currentObject.path}
            contents={contents}
        />
    )
}