export async function processRepo(owner, repo, network) {
    let serverURL = process.env.RAFT_API_URL
    if (!serverURL) {
        serverURL = 'http://localhost:8080/'
    }

    const rawResponse = await fetch(
        `${serverURL}processRepo`,
        {
            method: "POST",
            body: JSON.stringify({
                owner: owner,
                repo: repo,
                network: network,
            })
        }
    )

    const content = await rawResponse.json()

    if (content.error) {
        throw content.error
    }

    return content
}