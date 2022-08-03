import { useReducer } from "react"

const initialState = {
    repoTree: {},
    currentObject: {
        type: '',
        path: '',
        contents: '',
        args: '',
    },
}

function reducer(state, action) {
    switch(action.type) {
        case "open":
            const allFiles = state.repoTree.documentFiles.concat(state.repoTree.scriptFiles, state.repoTree.transactionFiles, state.repoTree.contractFiles)
            const item = allFiles.find(item => item.path == action.path)
            return {
                ...state,
                currentObject: {
                    type: item.type,
                    path: item.path,
                    contents: item.contents,
                    arguments: item.arguments,
                },
            }
        default:
            throw new Error()
    }
}

export function useMainReducer(repoTree) {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        repoTree,
    })

    return {
        ...state,
        open: path => dispatch({type: "open", path}),
    }
}