import { useReducer } from "react"
import { useRouter } from 'next/router'

const initialState = {
    repo: {},
    currentObject: {
        type: '',
        path: '',
        contents: '',
        args: '',
        errors: [],
        address: '',
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
            // window.location.href = item.path
            // const router = useRouter()
            // router.push({
            //     pathname: action.path,
            // }, undefined, { shallow: true })
            return {
                ...state,
                currentObject: {
                    ...state.currentObject,
                    type: item.type,
                    path: item.path,
                    contents: item.contents,
                    arguments: item.arguments,
                    errors: item.errors,
                    address: item.address,
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