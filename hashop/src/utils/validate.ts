import { Product } from "@/types/product";
import dayjs from "dayjs";

type ErrorForm = {
    path: string | null;
    msg: string;
};

const errors: ErrorForm[] = []

const validateProduct = (product: Product) => {
    // Clear errors
    errors.length = 0;

    // Kiểm tra title có ít nhất 3 ký tự
    if (product.title.length < 3) {
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
    if (product.description === undefined || product.description.length < 10) {
        errors.push({
            path: "description",
            msg: "Description must have at least 10 characters"
        });
    }

    // Kiểm tra price phải lớn hơn 0
    if (product.price === undefined || product.price === null) {
        errors.push({
            path: "price",
            msg: "Price must not be empty"
        });
    }
    else if (product.price <= 0) {
        errors.push({
            path: "price",
            msg: "Price must be greater than 0"
        });
    }

    // Kiểm tra discount phải lớn hơn hoặc bằng 0 và nhỏ hơn 100
    if (product.discount === undefined || product.discount < 0 || product.discount >= 100) {
        errors.push({
            path: "discount",
            msg: "Discount must be greater than or equal to 0 and less than 100"
        });
    }

    // Nếu discount lớn hơn 0 thì kiểm tra discountStartDate và discountEndDate
    if (product.discount !== undefined && product.discount > 0) {
        // Kiểm tra ngày kết thúc giảm giá có hợp lệ
        if (product.discountEndDate === undefined || product.discountEndDate === null) {
            errors.push({
                path: "discountEndDate",
                msg: "Discount end date is invalid"
            });
        }
        // Kiểm tra ngày kết thúc giảm giá phải lớn hơn ngày hiện tại
        else if (dayjs().isAfter(product.discountEndDate)) {
            errors.push({
                path: "discountEndDate",
                msg: "Discount end date must be greater than the current date"
            });
        }
    }

    // Kiểm tra ngày phát hành có hợp lệ
    if (product.releaseDate === undefined || product.releaseDate === null) {
        errors.push({
            path: "releaseDate",
            msg: "Release date is invalid"
        });
    }

    // Kiểm tra developer ít nhất 1 item
    if (product.developer === undefined || product.developer.length === 0) {
        errors.push({
            path: "developer",
            msg: "Developer must have at least 1 item"
        });
    }

    // Kiểm tra publisher ít nhất 1 item
    if (product.publisher === undefined || product.publisher.length === 0) {
        errors.push({
            path: "publisher",
            msg: "Publisher must have at least 1 item"
        });
    }

    // Kiểm tra platform ít nhất 1 item
    if (product.platform === undefined || product.platform.length === 0) {
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
    if (product.features === undefined || product.features.length === 0) {
        errors.push({
            path: "features",
            msg: "Features must have at least 1 item"
        });
    }

    return errors;
};

export default validateProduct;
