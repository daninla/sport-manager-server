export const toCamelCase = (row) => {
    if (!row) return row;

    return Object.fromEntries(
        Object.entries(row).map(([columnName, columnValue]) => [
            columnName.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase()),
            columnValue,
        ]),
    );
};
