import styled from "styled-components"

const Wrapper = styled.div`
    border-radius: 10px;
    border: 1px solid lightgrey;
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const Header = styled.div`
    top: 0;
    padding: 5px;
    background-color: white;
    border-bottom: 1px solid lightgray;
`

const ContentPanel = styled.div`
    padding: 10px 25px 50px 25px;
    background-color: white;
    height: 100%;
    overflow: scroll;
`

export default function Panel({ header, contents }) {
    return (
        <Wrapper>
            <Header>
                {header}
            </Header>
            <ContentPanel>
                {contents}
            </ContentPanel>
        </Wrapper>
    )
}