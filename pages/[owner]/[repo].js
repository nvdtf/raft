import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import * as fcl from "@onflow/fcl"

import { useMainReducer } from '../../src/reducers/reducer'
import { processRepo } from '../../src/lib/raft-api'

import styled from 'styled-components'
import FileMd from '../../src/components/FileMd'
import ObjectTree from '../../src/components/ObjectTree'
import Header from '../../src/components/Header'
import FileCadence from '../../src/components/FileCadence'

const Site = styled.div`
    font-family: 'Fira Code', monospace;
    width: 100vw;
    height: 100vh;
`

const LeftPanel = styled.div`
    background-color: white;
    padding-top: 10px;
    float: left;
    height: 100%;
    width: 20%;
    overflow: scroll;
    border-right: 1px solid lightgray;
`

const MainPanel = styled.div`
    background-color: whitesmoke;
    padding: 10px;
    float: right;
    height: 100%;
    width: 80%;
`

export default function Repo({processedRepo, initialPath}) {

    if (processedRepo.network == 'Mainnet') {
        fcl.config().put('accessNode.api', 'https://rest-mainnet.onflow.org')
        fcl.config().put('discovery.wallet', 'https://fcl-discovery.onflow.org/authn')
    } else if (processedRepo.network == 'Testnet') {
        fcl.config().put('accessNode.api', 'https://rest-testnet.onflow.org')
        fcl.config().put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
    }

    const {
        repo,
        currentObject,
        open,
    } = useMainReducer(processedRepo)

    const [user, setUser] = useState({})

    useEffect(() => {
        open(initialPath)
    }, [initialPath])

    useEffect(() => {
        fcl.currentUser().subscribe(user => setUser(user))
    }, [])

    const router = useRouter()

    function onNetworkChange(newNetwork) {

        fcl.unauthenticate()

        if (newNetwork == 'Testnet') {
            router.push(window.location.pathname + '?testnet')
        } else if (newNetwork == 'Mainnet') {
            router.push(window.location.pathname.split('?')[0])
        }
    }

    return (
        <Site>
            <Header
                user={user}
                repoPath={repo.path}
                network={repo.network}
                onNetworkChange={onNetworkChange}
            />
            <LeftPanel>
                <ObjectTree
                    objects={[repo]}
                    currentObject={currentObject}
                    onClick={open}
                />
            </LeftPanel>
            <MainPanel>
                {currentObject.type == 'Document' &&
                    <FileMd
                        header={currentObject.path}
                        content={currentObject.contents}
                    />
                }
                {(currentObject.type == 'Script' ||
                    currentObject.type == 'Contract') &&

                    <FileCadence
                        header={currentObject.path}
                        code={currentObject.contents}
                        args={currentObject.arguments}
                        isScript={true}
                    />
                }
                {currentObject.type == 'Transaction' &&

                    <FileCadence
                        header={currentObject.path}
                        code={currentObject.contents}
                        args={currentObject.arguments}
                        isScript={false}
                    />
                }
            </MainPanel>
        </Site>
    )
}

export async function getServerSideProps(context) {

    let network = 'Mainnet'
    if (context.query.hasOwnProperty('testnet')) {
        network = 'Testnet'
    }

    const result = await processRepo(context.query.owner, context.query.repo, network)

    const repo = {
        path: `github.com/${context.query.owner}/${context.query.repo}`,
        network,
        transactionFiles: result.transactions,
        documentFiles: result.documents,
        scriptFiles: result.scripts,
        contractFiles: result.contracts,
    }

    return {
        props: {
            processedRepo: repo,
            initialPath: 'README.md',
        },
    }
}