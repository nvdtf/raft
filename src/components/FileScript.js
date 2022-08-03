import * as fcl from "@onflow/fcl"
import { useState } from "react"

import styled from "styled-components"
import ArgumentInput from "./ArgumentInput"

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
    font-family: 'Fira Code', monospace;
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

const ScriptResult = styled.div`
    height: 100%;
    background-color: black;
    color: white;
    padding: 5px 15px;
`

async function runScript(script, args) {
    const result = await fcl.query({
        cadence: script,
        // args: (arg, t) => [
        //     arg("test", t.String)
        // ],
        // args: [
        //     cadut.mapArgument("test", "String")
        // ]
        // args: (arg, t) => [
        //     arg("test", t["String"])
        // ]
        args: (arg, t) => args.map(a => {
            return arg(a.value, t[a.type])
        })
    })
    return result
}

export default function FileScript({header, script, args}) {

    // fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org")
    fcl.config().put("accessNode.api", "https://rest-mainnet.onflow.org")

    const [log, setLog] = useState('Ready\n')

    async function execute() {
        setLog(log + 'Executing script ...\n')
        const result = await runScript(script, args, setLog)
        setLog(log + 'Result: ' + result + '\n')
    }

    return (
        <Panel>
            <Header>
                {header}
            </Header>
            <LeftPanel>
                <Pre>
                    <CodePanel>
                        {script}
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
                        onClick={execute}
                    >
                        Run Script
                    </Run>
                </ArgumentsPanel>
                <ScriptResult>
                    {log}
                </ScriptResult>
            </RightPanel>
        </Panel>
    )
}