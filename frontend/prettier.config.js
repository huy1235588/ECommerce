/** @type {import('prettier').Config} */
module.exports = {
    // Semicolon
    semi: true,

    // Trailing comma
    trailingComma: "es5",

    // Indentation
    tabWidth: 4,
    useTabs: false,

    // Line length
    printWidth: 80,

    // JSX
    bracketSpacing: true,
    bracketSameLine: false,

    // disable quotes
    singleQuote: false,
    doubleQuote: false,
    quoteProps: "as-needed",
    jsxSingleQuote: false,

    // Arrow functions
    arrowParens: "avoid",

    // Plugins
    plugins: ["prettier-plugin-tailwindcss"],
};
