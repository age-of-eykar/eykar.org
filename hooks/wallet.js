export function useAvailableConnectors(connectors) {
    const output = [];
    for (const connector of connectors)
        if (connector.available())
            output.push(connector);
    return output;
}