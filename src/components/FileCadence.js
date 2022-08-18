import * as fcl from "@onflow/fcl"
import { useEffect, useState } from "react"

import styled from "styled-components"
import ArgumentsPanel from "./ArgumentsPanel"
import Log from "./Log"
import CodePanel from "./CodePanel"
import Panel from "./Panel"
import Spinner from './Spinner'

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
    padding-top: 20px;
    gap: 20px;
    background-color: white;
    width: 500px;
`

const Run = styled.button`
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    background-color: green;
    color: white;
    border: 1px solid black;
    padding: 5px 30px;
    width: 100px;
    align-self: center;
`

const LogPanel = styled.div`
    overflow: scroll;
    font-size: 0.75em;
    max-height: 400px;
    border: 1px solid lightgray;
    border-radius: 10px;
`

const ErrorsPanel = styled.div`
    border: 1px solid red;
    padding: 10px;
    color: red;
    white-space: pre;
    overflow: scroll;
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

export default function FileCadence({ currentObject }) {

    const code = currentObject.contents

    const isScript = currentObject.type == 'Script'

    const initialLog = 'Ready\n'
    const [log, setLog] = useState(initialLog)

    const [running, setRunning] = useState(false)
    const [runDisabled, setRunDisabled] = useState(false)

    async function l(what) {
        setLog((prevLog, props) => (
            prevLog + what + '\n'
        ))
    }

    useEffect(() => {
        setLog(initialLog)
    }, [currentObject.path])

    useEffect(() => {
        if (currentObject.errors.length > 0) {
            setRunDisabled(true)
        }
    }, [currentObject.errors])

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

        l('Transaction ID: ' + txId)
        l('Executing transaction ...')
        let result = await fcl.tx(txId).onceExecuted()
        l('Executed! Waiting for seal ...')
        result = await fcl.tx(txId).onceSealed()
        l('Sealed!')
        return result.events
    }

    async function run() {
        if (isScript) {
            l('Running script ...')
        } else {
            l('Waiting for signature ...')
        }


        setRunning(true)

        let result
        try {
            if (isScript) {
                result = await runScript(code, currentObject.arguments)
            } else {
                result = await runTransaction(code, currentObject.arguments)
            }
            l('Result: ' + JSON.stringify(result, null, '\t'))
        } catch (error) {
            l('Failed! ' + error)
            console.log(error)
        }

        setRunning(false)
    }

    const contents = (
        <>
            {currentObject.type != 'Contract' && (
                <FloatingPanel>
                    {currentObject.errors.length > 0 && (
                        <ErrorsPanel>
                          {currentObject.errors.join('\n')}
                        </ErrorsPanel>
                    )}
                    {currentObject.arguments.length > 0 && (
                        <ArgumentsPanel
                          args={currentObject.arguments}
                        />
                    )}
                    <Run onClick={run} disabled={running || runDisabled}>
                        {running
                            ? <Spinner color="white"/>
                            : "Run"
                        }
                    </Run>
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

    let header = currentObject.path
    if (currentObject.address) {
        header = `${currentObject.path} (${currentObject.address})`
    }
    return (
        <Panel
            header={header}
            contents={contents}
        />
    )
}