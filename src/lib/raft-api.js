export async function processRepo(owner, repo, network) {
    const rawResponse = await fetch(
        `http://localhost:8080/processRepo`,
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

    return content
}