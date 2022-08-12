import { useReducer } from "react"

const initialState = {
    repo: {},
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
            const allFiles =
                state.repo.documentFiles.concat(
                state.repo.scriptFiles,
                state.repo.transactionFiles,
                state.repo.contractFiles,
            )
            const item = allFiles.find(item => item.path == action.path)
            return {
                ...state,
                currentObject: {
                    ...state.currentObject,
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

export function useMainReducer(repo) {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        repo,
    })

    return {
        ...state,
        open: path => dispatch({type: "open", path}),
    }
}