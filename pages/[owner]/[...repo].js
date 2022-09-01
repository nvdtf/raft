import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import * as fcl from "@onflow/fcl"

import { useMainReducer } from '../../src/reducers/reducer'
import { processRepo } from '../../src/lib/raft-api'

import styled from 'styled-components'
import FileMd from '../../src/components/site/FileMd'
import ObjectTree from '../../src/components/site/ObjectTree'
import Header from '../../src/components/site/Header'
import FileCadence from '../../src/components/cadence/FileCadence'
import Panel from '../../src/components/ui/Panel'

const Site = styled.div`
    font-family: 'Fira Code', monospace;
    width: 100vw;
    height: 100vh;
`

const HeaderPanel = styled.div`
    width: 100%;
    height: 40px;
    border-bottom: 1px solid lightgray;
`

const MainPanel = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 40px;
    bottom: 0;
    display: flex;
`

const LeftPanel = styled.div`
    background-color: white;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    height: 100%;
    border-right: 1px solid lightgray;
    width: fit-content;
    min-width: 400px;
    overflow: scroll;
`

const ObjectPanel = styled.div`
    background-color: whitesmoke;
    padding: 10px;
    height: 100%;
    flex-grow: 1;
    overflow: scroll;
`

const ErrorPanel = styled.div`
    position: absolute;
    left: 40px;
    right: 40px;
    top: 40px;
`

const ErrorMessage = styled.div`
    color: red;
    margin-top: 30px;
`

export default function Repo({processedRepo, initialPath, error}) {

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

    const router = useRouter()

    useEffect(() => {
        if (initialPath) {
            document.title = 'Raft | ' + repo.path + '/' + initialPath
            open(initialPath)
        }
    }, [])

    useEffect(() => {
        fcl.currentUser().subscribe(user => setUser(user))
    }, [])

    function onNetworkChange(newNetwork) {

        fcl.unauthenticate()

        if (newNetwork == 'Testnet') {
            window.location.href = window.location.pathname + '?testnet'
        } else if (newNetwork == 'Mainnet') {
            window.location.href = window.location.pathname.split('?')[0]
        }
    }

    function openPath(path) {
        router.push({
            pathname: '/' + repo.path + '/' + path,
        }, undefined, { shallow: true })

        document.title = 'Raft | ' + repo.path + '/' + path

        open(path)
    }

    return (
        <Site>
            <HeaderPanel>
                <Header
                    user={user}
                    repoPath={repo.path}
                    network={repo.network}
                    onNetworkChange={onNetworkChange}
                />
            </HeaderPanel>
            <MainPanel>
            {error
            ? (
                <ErrorPanel>
                    <Panel
                        header='Error'
                        contents={<ErrorMessage>{error}</ErrorMessage>}
                    />
                </ErrorPanel>
            ):(
                <>
                    <LeftPanel>
                        <ObjectTree
                            objects={[repo]}
                            currentObject={currentObject}
                            onClick={openPath}
                        />
                    </LeftPanel>
                    <ObjectPanel>
                        {currentObject.type == 'Document' &&
                            <FileMd
                                header={currentObject.path}
                                content={currentObject.contents}
                            />
                        }
                        {(currentObject.type == 'Script' ||
                            currentObject.type == 'Transaction' ||
                            currentObject.type == 'Contract') &&

                            <FileCadence
                                currentObject={currentObject}
                            />
                        }
                    </ObjectPanel>
                </>
            )}

            </MainPanel>
        </Site>
    )
}

export async function getServerSideProps(context) {

    let network = 'Mainnet'
    if (context.query.hasOwnProperty('testnet')) {
        network = 'Testnet'
    }

    const owner = context.query.owner
    const repo = context.query.repo[0]

    let initialPath = 'README.md'
    if (context.query.repo.length > 1) {
        initialPath = context.query.repo.slice(1).join('/')
    }

    const processedRepo = {
        path: `${owner}/${repo}`,
        network,
        transactionFiles: [],
        documentFiles: [],
        scriptFiles: [],
        contractFiles: [],
    }

    try {
        const result = await processRepo(owner, repo, network)

        processedRepo.transactionFiles = result.transactions
        processedRepo.documentFiles = result.documents
        processedRepo.scriptFiles = result.scripts
        processedRepo.contractFiles = result.contracts

        return {
            props: {
                processedRepo,
                initialPath,
                error: '',
            },
        }
    } catch (error) {
        return {
            props: {
                processedRepo,
                initialPath: '',
                error: JSON.stringify(error),
            },
        }
    }
}