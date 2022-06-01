export function getDisplay(conveyable) {
    const types = new Set(['human']);

    if (types.has(conveyable.type)) {
        const amount = conveyable.data.toNumber();
        return amount + " × " + conveyable.type + (amount > 1 ? "s" : "");
    } else {
        return "error, contact a developer";
    }

}