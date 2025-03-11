const { default: mongoose } = require("mongoose");

const packageGroupSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.Number, required: true }, // Liên kết với steam_appid của game
    name: String,
    title: String,
    description: String,
    selection_text: String,
    save_text: String,
    display_type: String,
    is_recurring_subscription: String,
    subs: [{
        packageId: Number,
        percent_savings_text: String,
        percent_savings: Number,
        option_text: String,
        option_description: String,
        can_get_free_license: String,
        is_free_license: Boolean,
        price_in_cents_with_discount: Number
    }]
});

const PackageGroup = mongoose.model('PackageGroup', packageGroupSchema);
module.exports = PackageGroup;