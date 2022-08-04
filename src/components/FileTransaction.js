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

const Result = styled.div`
    height: 100%;
    background-color: black;
    color: white;
    padding: 5px 15px;
`

async function executeTransaction(code, args) {
    const txId = await fcl.mutate({
        cadence: code,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 9999,
        args: (arg, t) => args.map(a => {
            return arg(a.value, t[a.type])
        })
    })

    const tx = await fcl.tx(txId).onceSealed()
    return tx
}

export default function FileTransaction({header, code, args}) {

    // fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org")
    // fcl.config().put("accessNode.api", "https://rest-mainnet.onflow.org")

    const [log, setLog] = useState('Ready\n')

    async function execute() {
        setLog(log + 'Executing transaction ...\n')
        const result = await executeTransaction(code, args, setLog)
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
                        onClick={execute}
                    >
                        Execute Transaction
                    </Run>
                </ArgumentsPanel>
                <Result>
                    {log}
                </Result>
            </RightPanel>
        </Panel>
    )
}