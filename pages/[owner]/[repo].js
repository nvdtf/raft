import { useEffect, useState } from 'react'
import * as fcl from "@onflow/fcl"

import { useMainReducer } from '../../src/reducers/reducer'
import { processRepo } from '../../src/lib/raft-api'

import styled from 'styled-components'
import FileMd from '../../src/components/FileMd'
import ObjectTree from '../../src/components/ObjectTree'
import Header from '../../src/components/Header'
import FileCadence from '../../src/components/FileCadence'

const Site = styled.div`
    width: 100vw;
    height: 100vh;
`

const LeftPanel = styled.div`
    background-color: white;
    padding-top: 20px;
    padding-bottom: 20px;
    float: left;
    height: 100%;
    width: 30%;
    border-right: 1px solid lightgray;
`

const MainPanel = styled.div`
    background-color: whitesmoke;
    padding: 1em;
    float: right;
    height: 100%;
    width: 70%;
`

export default function Repo({initialRepoTree, initialPath}) {
    const {
        repoTree,
        currentObject,
        open,
    } = useMainReducer(initialRepoTree)

    const [user, setUser] = useState({})

    useEffect(() => {
        open(initialPath)
    }, [initialPath])

    useEffect(() => {
        fcl.currentUser().subscribe(user => setUser(user))
    }, [])

    return (
        <Site>
            <Header
                user={user}
            />
            <LeftPanel>
                <ObjectTree
                    objects={[repoTree]}
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

    const processedRepoTree = await processRepo(context.query.owner, context.query.repo)

    const initialRepoTree = {
        title: `github.com/${context.query.owner}/${context.query.repo}`,
        type: 'Repository',
        transactionFiles: processedRepoTree.transactions,
        documentFiles: processedRepoTree.documents,
        scriptFiles: processedRepoTree.scripts,
        contractFiles: processedRepoTree.contracts,
    }

    const initialPath = 'README.md'

    return {
        props: {
            initialRepoTree,
            initialPath,
        },
    }
}