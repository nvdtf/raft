import styled from "styled-components"

import ErrorIcon from '../ui/ErrorIcon'

const Title = styled.div`
    color: blue;
    margin-left: 15px;
`

const Item = styled.div`
    margin-left: 40px;
    cursor: pointer;
    display: flex;
    gap: 5px;
`

const NonCurrentItem = styled.div`
    color: darkgray;
`

const CurrentItem = styled.div`
    color: red;
`

const AddressBadge = styled.div`
    text-align: center;
    vertical-align: middle;
    line-height: 20px;
    background-color: green;
    border-radius: 10px;
    padding: 0px 10px;
    color: white;
`

export default function ObjectTreeFolder({title, items, currentObject, onClick}) {
    return (
        <>
            <Title>
                {title}
            </Title>
            {items && items.map(item => (
                <Item onClick={() => onClick(item.path)} key={item.path}>
                    {item.errors.length > 0 && (
                        <ErrorIcon width="16px"/>
                    )}
                    {item.path == currentObject.path
                        ? <CurrentItem>{item.path}</CurrentItem>
                        : <NonCurrentItem>{item.path}</NonCurrentItem>
                    }
                    {/* {item.address && (
                        <AddressBadge>{item.address}</AddressBadge>
                    )} */}
                </Item>
            ))}
        </>
    )
}