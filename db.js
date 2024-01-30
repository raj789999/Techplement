import mongoose from "mongoose";

let isConnected = false;

const convertToBool = (fault = "false") => {
  return fault === "true";
};

function connectToDatabase() {
  if (isConnected) return;

  mongoose.set("strictQuery", true);
  if (convertToBool(process.env.DEBUG)) mongoose.set("debug", true);

  mongoose.connect(process.env.MONGO_URI);
  
  mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log("~ Connected to MongoDB.");
  });

  mongoose.connection.on("error", (err) => {
    console.log("[MongoDB Connection ERROR]", err);
    isConnected = false;
  });
}

export default connectToDatabase;
