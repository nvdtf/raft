import { useState } from 'react'
import { Octokit } from '@octokit/rest'
import { fetchFile, fetchRepoTree } from '../../src/lib/github'

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
    padding: 1em;
    float: right;
    height: 100%;
    width: 60%;
`

export default function Repo({objectTree, initialPanels}) {
    const [panels, setPanels] = useState(initialPanels)

    objectTree[0].children = objectTree[0].children.map(obj => ({...obj, onClick: () => click(obj, setPanels)}))
    objectTree[0].onClick = () => click(objectTree[0], setPanels)

    return (
        <Site>
            <Header>
                RAFT v0.1.0
            </Header>
            <LeftPanel>
                <ObjectTree
                    objects={objectTree}
                />
            </LeftPanel>
            <MainPanel>
                {panels[0].type == 'FileMd' &&
                    <FileMd
                        header={panels[0].header}
                        content={panels[0].content}
                    />
                }
                {panels[0].type == 'FileScript' &&
                    <FileScript
                        header={panels[0].header}
                        content={panels[0].content}
                    />
                }
            </MainPanel>
        </Site>
    )
}

async function click(obj, setPanelsFunc) {
    const file = await fetchFile('navid-t', 'flow-contract-auditor-sample', obj.path)

    const panels = [
        {
            header: obj.path,
            content: file,
            type: 'FileScript',
        }
    ]

    setPanelsFunc(panels)
}

export async function getServerSideProps(context) {
    const repo = `github.com/${context.query.owner}/${context.query.repo}`
    const initialPath = '/README.md'

    const repoTree = await fetchRepoTree(context.query.owner, context.query.repo)
    const objectTree = [
        {
            title: repo,
            type: 'Repository',
            path: '/README.md', //fixme
            children: repoTree,
        }
    ]

    const initialFile = await fetchFile(context.query.owner, context.query.repo, initialPath)

    const initialPanels = [
        {
            header: initialPath,
            content: initialFile,
            type: 'FileMd',
        }
    ]

    return {
        props: {
            objectTree,
            initialPanels,
        },
    }
}