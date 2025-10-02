
// GraphQL Error
interface ErrorLocation {
    line: number;
    column: number;
}

interface ErrorExtensions {
    code: string;
    stacktrace?: string[]; // Optional vì không phải lúc nào cũng có stacktrace
}

interface GraphQLError {
    message: string;
    locations: ErrorLocation[];
    extensions: ErrorExtensions;
}

export interface GraphQLErrorResponse {
    errors: GraphQLError[];
}