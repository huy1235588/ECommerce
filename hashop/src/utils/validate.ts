import { Product } from "@/types/product";

type ErrorForm = {
    path: string | null;
    msg: string;
};

const errors: ErrorForm[] = []

const validateProduct = (product: Product) => {
    // Clear errors
    errors.length = 0;

    // Kiểm tra title có ít nhất 3 ký tự
    if (product.name.length < 3) {
        errors.push({
            path: "title",
            msg: "Title must have at least 3 characters"
        });
    }

    // Kiểm tra type không rỗng
    if (product.type === "") {
        errors.push({
            path: "type",
            msg: "Type must not be empty"
        });
    }

    // Kiểm tra description có ít nhất 10 ký tự
    if (product.short_description === undefined || product.short_description.length < 10) {
        errors.push({
            path: "description",
            msg: "Description must have at least 10 characters"
        });
    }

    // Kiểm tra price phải lớn hơn 0
    if (product.price_overview.initial === undefined || product.price_overview.initial === null) {
        errors.push({
            path: "price",
            msg: "Price must not be empty"
        });
    }
    else if (product.price_overview.initial <= 0) {
        errors.push({
            path: "price",
            msg: "Price must be greater than 0"
        });
    }

    // Kiểm tra discount phải lớn hơn hoặc bằng 0 và nhỏ hơn 100
    if (product.price_overview.discount_percent === undefined || product.price_overview.discount_percent < 0 || product.price_overview.discount_percent >= 100) {
        errors.push({
            path: "discount",
            msg: "Discount must be greater than or equal to 0 and less than 100"
        });
    }

    // Kiểm tra ngày phát hành có hợp lệ
    if (product.release_date === undefined || product.release_date === null) {
        errors.push({
            path: "releaseDate",
            msg: "Release date is invalid"
        });
    }

    // Kiểm tra developer ít nhất 1 item
    if (product.developers === undefined || product.developers.length === 0) {
        errors.push({
            path: "developer",
            msg: "Developer must have at least 1 item"
        });
    }

    // Kiểm tra publisher ít nhất 1 item
    if (product.publishers === undefined || product.publishers.length === 0) {
        errors.push({
            path: "publisher",
            msg: "Publisher must have at least 1 item"
        });
    }

    // Kiểm tra platform ít nhất 1 item
    if (product.platform === undefined) {
        errors.push({
            path: "platform",
            msg: "Platforms must have at least 1 item"
        });
    }

    // Kiểm tra tags có ít nhất 3 item
    if (product.tags === undefined || product.tags.length < 3) {
        errors.push({
            path: "tags",
            msg: "Tags must have at least 3 items"
        });
    }

    // Kiểm tra genres có ít nhất 1 item
    if (product.genres === undefined || product.genres.length === 0) {
        errors.push({
            path: "genres",
            msg: "Genres must have at least 1 item"
        });
    }

    // Kiểm tra features có ít nhất 1 item
    if (product.categories === undefined || product.categories.length === 0) {
        errors.push({
            path: "features",
            msg: "Features must have at least 1 item"
        });
    }

    return errors;
};

export default validateProduct;
