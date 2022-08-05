import * as fcl from "@onflow/fcl"
import { useState } from "react"

import styled from "styled-components"
import ArgumentInput from "./ArgumentInput"
import Log from "./Log"

const Panel = styled.div`
    background-color: white;
    border-radius: 10px;
    border: 1px solid lightgrey;
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const Header = styled.div`
    padding: 5px;
    background-color: whitesmoke;
`

const LeftPanel = styled.div`
    float: left;
    width: 70%;
`

const RightPanel = styled.div`
    float: right;
    width: 30%;
    height: 100%;
    padding: 5px 15px;
`

const CodePanel = styled.code`
`

const Pre = styled.pre`
    padding: 5px 15px;
`

const Run = styled.button`
    padding: 5px 15px;
`

const ArgumentsPanel = styled.div`
    height: 200px;
`

const Result = styled.div`
    height: 100%;
    background-color: black;
    color: white;
    padding: 5px 15px;
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

export default function FileCadence({header, code, args, isScript}) {

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
                result = await runScript(code, args)
            } else {
                result = await runTransaction(code, args)
            }
        } catch (error) {
            result = error
            console.log(error)
        }

        l('Result: ' + result)
    }

    return (
        <Panel>
            <Header>
                {header}
            </Header>
            <LeftPanel>
                <Pre>
                    <CodePanel>
                        {code}
                    </CodePanel>
                </Pre>
            </LeftPanel>
            <RightPanel>
                <ArgumentsPanel>
                    {args && args.map(arg => (
                        <ArgumentInput
                            label={arg.name}
                            type={arg.type}
                            onChange={(v) => arg.value = v}
                        />
                    ))}
                    <Run
                        onClick={run}
                    >
                        Run
                    </Run>
                </ArgumentsPanel>
                <Result>
                    <Log
                        log={log}
                    />
                </Result>
            </RightPanel>
        </Panel>
    )
}