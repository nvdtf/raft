import styled from "styled-components"
import ObjectTreeFolder from "./ObjectTreeFolder"

const Panel = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3em;
    width: fit-content;
`

function sort(items) {
    if (items) {
        return items.sort((a, b) => {
            if (a.path > b.path) return 1;
            if (a.path < b.path) return -1;
            return 0;
        })
    }
}

export default function ObjectTree({objects, currentObject, onClick}) {
    return (
        <Panel>
            {objects.map(obj => (
                <div key='objectTree'>
                    <ObjectTreeFolder key='Documents'
                        title='Documents'
                        items={sort(obj.documentFiles)}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                    <ObjectTreeFolder key='Contracts'
                        title='Contracts'
                        items={sort(obj.contractFiles)}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                    <ObjectTreeFolder key='Scripts'
                        title='Scripts'
                        items={sort(obj.scriptFiles)}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                    <ObjectTreeFolder key='Transactions'
                        title='Transactions'
                        items={sort(obj.transactionFiles)}
                        currentObject={currentObject}
                        onClick={onClick}
                    />

                </div>
            ))}
        </Panel>
    )
}