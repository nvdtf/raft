import styled from "styled-components"
import ObjectTreeFolder from "./ObjectTreeFolder"

const Panel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
`

export default function ObjectTree({objects, currentObject, onClick}) {
    return (
        <Panel>
            {objects.map(obj => (
                <div>
                    <ObjectTreeFolder
                        title='Documents'
                        items={obj.documentFiles}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                    <ObjectTreeFolder
                        title='Contracts'
                        items={obj.contractFiles}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                    <ObjectTreeFolder
                        title='Scripts'
                        items={obj.scriptFiles}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                    <ObjectTreeFolder
                        title='Transactions'
                        items={obj.transactionFiles}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                </div>
            ))}
        </Panel>
    )
}