import styled from "styled-components"
import ObjectTreeFolder from "./ObjectTreeFolder"

const Panel = styled.div`
    padding: 0.5em;
    font-family: 'Fira Code', monospace;
    display: flex;
    flex-direction: column;
    gap: 3em;
`

const Section = styled.div`
`

const Title = styled.div`
    font-weight: bold;
`

export default function ObjectTree({objects, currentObject, onClick}) {
    return (
        <Panel>
            {objects.map(obj => (
                <Section>
                    <Title onClick={obj.onClick}>
                        {obj.title}
                    </Title>

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

                </Section>
            ))}
        </Panel>
    )
}