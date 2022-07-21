import { Octokit } from '@octokit/rest'

function newOcto() {
    return new Octokit({
        baseUrl: 'https://api.github.com',
        auth: process.env.GITHUB_ACCESS_TOKEN,
    })
}

export async function fetchFile(owner, repo, path) {
    const octo = newOcto()

    const readmeData = await octo.rest.repos.getContent({
        owner: owner,
        repo: repo,
        path: path,
    })

    const readmeBase64 = Buffer.from(readmeData.data.content, 'base64')

    return readmeBase64.toString('utf-8')
}

export async function fetchRepoTree(owner, repo) {
    const octo = newOcto()

    const searchList = await octo.rest.search.code({
        q: `filename:.cdc+repo:${owner}/${repo}`,
    })

    // const result = searchList.data.items.map(item => ({...item, type: 'script'}))
    const result = searchList.data.items

    return result
}