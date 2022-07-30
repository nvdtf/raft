import styled from "styled-components"

const Title = styled.div`
    color: blue;
    margin-left: 20px;
`

const Item = styled.div`
    margin-left: 40px;
    cursor: pointer;
`

const NonCurrentItem = styled.div`
    color: darkgray;
`

const CurrentItem = styled.div`
    color: red;
`

export default function ObjectTreeFolder({title, items, currentObject, onClick}) {
    return (
        <>
            <Title>
                {title}
            </Title>
            {items.map(item => (
                <Item onClick={() => onClick(item.path)}>
                    {item.path == currentObject.path
                        ? <CurrentItem>{item.path}</CurrentItem>
                        : <NonCurrentItem>{item.path}</NonCurrentItem>
                    }
                </Item>
            ))}
        </>
    )
}