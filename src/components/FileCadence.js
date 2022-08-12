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

const LogPanel = styled.div`
    overflow: scroll;
    font-size: 0.75em;
    width: 400px;
    max-height: 400px;
    border: 1px solid lightgray;
    border-radius: 10px;
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

    const initialLog = 'Ready\n'
    const [log, setLog] = useState(initialLog)

    const [running, setRunning] = useState(false)

    async function l(what) {
        setLog((prevLog, props) => (
            prevLog + what + '\n'
        ))
    }

    useEffect(() => {
        setLog(initialLog)
    }, [currentObject.path])

    async function run() {
        l('Running ...')

        setRunning(true)

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

        setRunning(false)
        l('Result: ' + JSON.stringify(result))
    }

    const contents = (
        <>
            {currentObject.type != 'Contract' && (
                <FloatingPanel>
                    <ArgumentsPanel
                        args={currentObject.arguments}
                    />
                    <Run onClick={run} disabled={running}>Run</Run>
                    <LogPanel>
                        <Log
                            log={log}
                        />
                    </LogPanel>
                </FloatingPanel>
            )}
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