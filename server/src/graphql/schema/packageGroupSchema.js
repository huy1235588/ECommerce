const packageGroupSchema = `
    type PackageGroup {
        productId: Int # Liên kết với steam_appid của game
        name: String
        title: String
        description: String
        selection_text: String
        save_text: String
        display_type: String
        is_recurring_subscription: String
        subs: [SubPackage]
    }

    type SubPackage {
        packageId: Int
        percent_savings_text: String
        percent_savings: Int
        option_text: String
        option_description: String
        can_get_free_license: String
        is_free_license: Boolean
        price_in_cents_with_discount: Int
    }

    # Truy vấn
    type Query {
        packageGroup(productId: Int!): PackageGroup
        packageGroups: [PackageGroup]
    }

    # Input cho cập nhật PackageGroup
    input PackageGroupInput {
        productId: Int!
        name: String
        title: String
        description: String
        selection_text: String
        save_text: String
        display_type: String
        is_recurring_subscription: String
        subs: [SubPackageInput]
    }

    input SubPackageInput {
        packageId: Int
        percent_savings_text: String
        percent_savings: Int
        option_text: String
        option_description: String
        can_get_free_license: String
        is_free_license: Boolean
        price_in_cents_with_discount: Int
    }

    # Cập nhật
    type Mutation {
        updatePackageGroup(packageGroup: PackageGroupInput): PackageGroup
    }
`;

module.exports = packageGroupSchema;