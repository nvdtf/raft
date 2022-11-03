import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import * as fcl from "@onflow/fcl"

import { useMainReducer } from '../../reducers/reducer'
import { processRepo } from '../../lib/raft-api'
import * as ga from '../../lib/google-analytics'

import styled from 'styled-components'
import FileMd from '../../components/site/FileMd'
import ObjectTree from '../../components/site/ObjectTree'
import Header from '../../components/site/Header'
import FileCadence from '../../components/cadence/FileCadence'
import Panel from '../../components/ui/Panel'

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
    width: 100%;
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
        fcl.config().put('discovery.authn.include', ["0xead892083b3e2c6c", "0xe5cd26afebe62781"])
    } else if (processedRepo.network == 'Testnet') {
        fcl.config().put('accessNode.api', 'https://rest-testnet.onflow.org')
        fcl.config().put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
        fcl.config().put('discovery.authn.include', ["0x82ec283f88a62e65", "0x9d2e44203cb13051"])
    }

    const {
        repo,
        currentObject,
        open,
    } = useMainReducer(processedRepo)

    const [user, setUser] = useState({})

    const router = useRouter()

    useEffect(() => {
        pushPath(initialPath)
    }, [])

    useEffect(() => {
        fcl.currentUser().subscribe(user => setUser(user))
    }, [])

    useEffect(() => {
        const handleRouteChange = (url, { shallow }) => {
            ga.pageview(url)

            const urlPrefix = '/' + repo.path
            if (url.startsWith(urlPrefix) && url.length > urlPrefix.length) {
                const path = url.slice(urlPrefix.length + 1)
                openPath(path)
            } else if(url === urlPrefix) {
                openPath(initialPath)
            }
        }

        router.events.on('routeChangeStart', handleRouteChange)
        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [])

    function onNetworkChange(newNetwork) {

        fcl.unauthenticate()

        if (newNetwork == 'Testnet') {
            window.location.href = window.location.pathname + '?testnet'
        } else if (newNetwork == 'Mainnet') {
            window.location.href = window.location.pathname.split('?')[0]
        }
    }

    function pushPath(path) {
        var q = null
        if (processedRepo.network == 'Testnet') {
            q = 'testnet'
        }

        router.push({
            pathname: '/' + repo.path + '/' + path,
            query: q,
        }, undefined, { shallow: true })
    }

    function openPath(path) {
        if (path) {
            var prefix = 'Raft | '
            if (path.indexOf('?') > 0) {
                path = path.slice(0, path.indexOf('?'))
                prefix = 'Raft <testnet> | '
            }

            if(path === initialPath) {
                document.title = prefix + repo.path
            } else {
                document.title = prefix + repo.path + '/' + path
            }
            open(path)
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
                            onClick={pushPath}
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
        if (initialPath.indexOf('?') > 0) {
            initialPath = initialPath.slice(0, initialPath.indexOf('?'))
        }
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
        console.log(error)
        return {
            props: {
                processedRepo,
                initialPath: '',
                error: JSON.stringify(error),
            },
        }
    }
}