const Movie = require('../../models/movieModel');

const movieResolvers = {
    Query: {
        // Trả về một movie dựa vào productId
        movie: async (_, { productId }) => {
            const movie = await Movie.findOne({
                productId: args.productId
            });
            return movie;

        },

        // Trả về tất cả movies
        movies: async () => {
            const movies = await Movie.find();
            return movies;
        }
    },

    Mutation: {
        // Cập nhật một movie
        UpdateMovie: async (_, args) => {
            const { productId, id, name, thumbnail, webm, mp4, highlight } = args.movie;
            const movie = await Movie.updateOne({
                productId: productId
            }, {
                id: id,
                name: name,
                thumbnail: thumbnail,
                webm: webm,
                mp4: mp4,
                highlight: highlight
            });
            return movie;
        }
    }
};

module.exports = movieResolvers;