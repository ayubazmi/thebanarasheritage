const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://ayubazmi0_db_user:8bM4hZh01zQNrQ5w@cluster0.wwulon0.mongodb.net/lumier_shop?appName=Cluster0";

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        // We define a schema that allows any fields since we just want to update one known field
        // and rely on the existing collection 'configs' (mongoose pluralizes 'Config' to 'configs')
        const Config = mongoose.model('Config', new mongoose.Schema({
            currency: String
        }, { strict: false }));

        const res = await Config.findOneAndUpdate({}, { currency: '₹' }, { new: true });
        console.log("Updated Config:", res);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
