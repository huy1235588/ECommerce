const Language = require("../../models/languageModel");

const languageResolvers = {
    Query: {
        getLanguagesList: async () => {
            return await Language.find();
        },
        getLanguage: async (_, { id }) => {
            return await Language.findOne({
                productId: id
            });
        },
        paginatedLanguages: async (_, { page, limit, query = "{}", slice = "{}" }) => {
            const filters = query ? JSON.parse(query) : {};
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const [totalLanguages, languages] = await Promise.all([
                Language.countDocuments(filters),
                Language.find(filters)
                    .skip(startIndex)
                    .limit(limit)
                    .select(JSON.parse(slice))
                    .exec()
            ]);

            const results = {
                totalLanguages,
                languages,
                previous: null,
                next: null
            };

            if (endIndex < totalLanguages) {
                results.next = {
                    page: page + 1,
                    limit
                };
            }

            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit
                };
            }

            return results;
        }
    },
    Mutation: {
        createLanguage: async (parent, { name, code, image }) => {
            return await Language.create({ name, code, image });
        },
        updateLanguage: async (parent, { id, name, code, image }) => {
            await Language.update({ name, code, image }, { where: { id } });
            return await Language.findByPk(id);
        },
        deleteLanguage: async (parent, { id }) => {
            const language = await Language.findByPk(id);
            await Language.destroy({ where: { id } });
            return language;
        }
    }
};

module.exports = languageResolvers;