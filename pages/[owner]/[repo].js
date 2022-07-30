import { useEffect } from 'react'
import { Octokit } from '@octokit/rest'
import { fetchFile, fetchRepoTree } from '../../src/lib/github'
import { useMainReducer } from '../../src/reducers/reducer'
import { processRepo } from '../../src/lib/raft-api'

import FileMd from '../../src/components/FileMd'
import FileScript from '../../src/components/FileScript'
import ObjectTree from '../../src/components/ObjectTree'

import styled from 'styled-components'

const Site = styled.div`
    width: 100vw;
    height: 100vh;
`

const Header = styled.div`
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: white;
    padding-left: 10px;
    font-size: 1em;
    font-weight: bold;
    font-family: 'Fira Code', monospace;
    color: red;
    border-bottom: 1px solid lightgray;
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

    useEffect(() => {
        open(initialPath)
    }, [initialPath])

    return (
        <Site>
            <Header>
                Raft v0.1.0
            </Header>
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
                {(currentObject.type == 'Transaction' ||
                    currentObject.type == 'Script' ||
                    currentObject.type == 'Contract') &&

                    <FileScript
                        header={currentObject.path}
                        content={currentObject.contents}
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