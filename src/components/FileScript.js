import * as fcl from "@onflow/fcl"

import styled from "styled-components"

const Panel = styled.div`
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

async function runScript(script) {
    // const result = await fcl.query({
    //     cadence: `
    //       pub fun main(a: Int, b: Int, addr: Address): Int {
    //         log(addr)
    //         return a + b
    //       }
    //     `,
    //     args: (arg, t) => [
    //       arg(7, t.Int), // a: Int
    //       arg(6, t.Int), // b: Int
    //       arg("0xba1132bc08f82fe2", t.Address), // addr: Address
    //     ],
    //   });
      const result = await fcl.query({
        cadence: script
    });
    console.log(result);
}

export default function FileScript({header, content}) {

    // fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org")
    fcl.config().put("accessNode.api", "https://rest-mainnet.onflow.org")
    return (
        <Panel>
            <Header>
                {header}
            </Header>
            <LeftPanel>
                <Pre>
                    <CodePanel>
                        {content}
                    </CodePanel>
                </Pre>
            </LeftPanel>
            <RightPanel>
                <ArgumentsPanel>
                    <Run onClick={() => runScript(content)}>Run Script</Run>
                </ArgumentsPanel>
                <ScriptResult>
                    Ready ...
                </ScriptResult>
            </RightPanel>
        </Panel>
    )
}