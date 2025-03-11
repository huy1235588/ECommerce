const movieSchema = `
    type Movie {
        productId: Int!
        id: Int
        name: String
        thumbnail: String
        webm: VideoFormat
        mp4: VideoFormat
        highlight: Boolean
    }

    type VideoFormat {
        _480: String
        max: String
    }

    # Truy vấn
    type Query {
        movie(productId: Int!): Movie
        movies: [Movie]
    }

    # Input cho cập nhật
    input MovieInput {
        productId: Int!
        id: Int
        name: String
        thumbnail: String
        webm: VideoFormatInput
        mp4: VideoFormatInput
        highlight: Boolean
    }

    input VideoFormatInput {
        _480: String
        max: String
    }

    # Cập nhật
    type Mutation {
        UpdateMovie(movie: MovieInput): Movie
    }
`;

module.exports = movieSchema;