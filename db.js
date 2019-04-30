import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const db = mongoose.connection;

const handleConnection = () => {
  console.log("Connect DB");
};

const handleError = error => {
  Collection.log(`Error on DB Connection:${error}`);
};

db.once("open", handleConnection);
db.on("error", handleError);
