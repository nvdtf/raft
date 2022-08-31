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
import FancyButton from '../../src/components/ui/FancyButton'

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
    height: 100%;
    border-right: 1px solid lightgray;
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 50px;
`

const ObjectPanel = styled.div`
    background-color: whitesmoke;
    padding: 10px;
    height: 100%;
    flex-grow: 1;
    overflow: scroll;
`

const FeedbackButton = styled(FancyButton)`
    align-self: center;
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

    useEffect(() => {
        if (initialPath) {
            open(initialPath)
        }
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
                            onClick={open}
                        />
                        <FeedbackButton
                            label='Submit Feedback'
                            onClick={() => window.location = 'mailto:navid@dapperlabs.com'}
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

    const repo = {
        path: `github.com/${context.query.owner}/${context.query.repo}`,
        network,
        transactionFiles: [],
        documentFiles: [],
        scriptFiles: [],
        contractFiles: [],
    }

    try {
        const result = await processRepo(context.query.owner, context.query.repo, network)

        repo.transactionFiles = result.transactions
        repo.documentFiles = result.documents
        repo.scriptFiles = result.scripts
        repo.contractFiles = result.contracts

        return {
            props: {
                processedRepo: repo,
                initialPath: 'README.md',
                error: '',
            },
        }
    } catch (error) {
        return {
            props: {
                processedRepo: repo,
                initialPath: '',
                error: JSON.stringify(error),
            },
        }
    }
}