export const wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            console.log(`Welcome to SQL Navigator Server`)
            break
        }
    }
}
