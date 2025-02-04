const Counter = require('../models/Counter');

async function getNextSequenceValue(sequenceName) {
    try {
        // Tìm và tăng giá trị của sequence lên 1
        const sequenceDocument = await Counter.findOneAndUpdate(
            { _id: sequenceName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true, returnDocument: 'after' }
        );

        // Trả về giá trị sequence mới
        return sequenceDocument.seq;
    } catch (error) {
        throw new Error(`Error generating sequence value: ${error.message}`);
    }
}

module.exports = getNextSequenceValue;