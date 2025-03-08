const languageSchema = `
    type Languages {
        language: String
        interface: Boolean
        fullAudio: Boolean
        subtitles: Boolean
    }

    type LanguageList {
        productId: Int
        languages: [Languages]
        createdAt: String
    }

    type Query {
        getLanguagesList: [LanguageList]
        getLanguage(id: Int!): LanguageList
        getLimitedLanguagesList(limit: Int!): [LanguageList]
    }

    type Mutation {
        createLanguage(productId: Int!, language: String, interface: Boolean, fullAudio: Boolean, subtitles: Boolean): Languages
        updateLanguage(productId: Int!, language: String, interface: Boolean, fullAudio: Boolean, subtitles: Boolean): Languages
        deleteLanguage(productId: Int!, language: String): Languages
    }
`;

module.exports = languageSchema;
