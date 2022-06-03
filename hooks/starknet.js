export function useDisplayName(account) {
    if (account === undefined)
        return "unknown";
    return account.substring(0, 6) + "..." + account.substring(account.length - 4);
}