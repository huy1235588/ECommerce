const Language = require("../../models/languageModel");

const languageResolvers = {
    Query: {
        getLanguagesList: async () => {
            return await Language.find();
        },
        getLanguage: async (_, { id }) => {
            return await Language.findById(id);
        },
        getLimitedLanguagesList: async (_, { limit }) => {
            return await Language
            .find()
            .limit(limit);
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