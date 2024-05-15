const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDb(url){
    mongoose.connect(url);

}
module.exports={
    connectToMongoDb,
}