const languageSchema = `
    type Languages {
        language: String
        interface: Boolean
        fullAudio: Boolean
        subtitles: Boolean
    }

    type LanguageList {
        _id: ID
        productId: Int
        languages: [Languages]
        createdAt: String
    }

    type Query {
        getLanguagesList: [LanguageList]
        getLanguage(id: Int!): LanguageList
        paginatedLanguages(page: Int, limit: Int, query: String, slice: String): PaginatedLanguages
    }

    type PaginatedLanguages {
        totalLanguages: Int
        languages: [LanguageList]
        previous: Pagination
        next: Pagination
    }

    type Pagination {
        page: Int
        limit: Int
    }

    type Mutation {
        createLanguage(productId: Int!, language: String, interface: Boolean, fullAudio: Boolean, subtitles: Boolean): Languages
        updateLanguage(productId: Int!, language: String, interface: Boolean, fullAudio: Boolean, subtitles: Boolean): Languages
        deleteLanguage(productId: Int!, language: String): Languages
    }
`;

module.exports = languageSchema;
