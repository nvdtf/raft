import FileMd from '../src/components/FileMd'
import styled from 'styled-components'
import ObjectTree from '../src/components/ObjectTree'

const Site = styled.div`
    width: 100vw;
    height: 100vh;
`

const Header = styled.div`
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #c9f7ff;
    padding-left: 20px;
    font-size: 2em;
`

const LeftPanel = styled.div`
    background-color: whitesmoke;
    padding-top: 20px;
    padding-bottom: 20px;
    float: left;
    height: 100%;
    width: 40%;
`

const MainPanel = styled.div`
    float: right;
    height: 100%;
    width: 60%;
`

export default function Main() {
    return (
        <Site>
            <Header>
                RAFT
            </Header>
            <LeftPanel>
            <ObjectTree
                objects={[
                    {
                        title: 'github.com/navidte/flow-contract-auditor-sample',
                        type: 'Repository',
                        children: [
                            {
                                title: 'transactions/new_audit.cdc',
                                type: 'transaction',
                            },
                            {
                                title: 'scripts/get_vouchers.cdc',
                                type: 'script',
                            },
                            {
                                title: 'contract/FlowContractAudits.cdc',
                                type: 'contract',
                            }
                        ],
                    },
                    {
                        title: '0xf919ee77447b7497',
                        type: 'Account',
                        children: [
                            {
                                title: 'Saved Transaction 01',
                                type: 'transaction',
                            },
                            {
                                title: 'Deployed',
                                type: 'contract',
                            }
                        ],
                    }
                ]}
            />
            </LeftPanel>
            <MainPanel>

            </MainPanel>
        </Site>
    )
}

export async function getServerSideProps(context) {

    return {
        props: {
        },
    }
}