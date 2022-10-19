export async function processRepo(owner, repo, network) {
    const rawResponse = await fetch(
        `${process.env.RAFT_API_URL}processRepo`,
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