import dns from "dns/promises";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1"]);
// mongoose.set("strictQuery", true);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("close", () => {
  console.log("MongoDB connection closed");
});

mongoose.connection.on("error", (error: string) => {
  console.log(`🤦🏻 MongoDB ERROR: ${error}`);

  process.exit(1);
});

const dbConnect = async () => {
  try {
    await mongoose.connect(<string>process.env.MONGO_URI);
    console.log(`Connected to db: ${mongoose.connection.name}`);
  } catch (error) {
    console.log(`MongoDB connection error. ${error}`);
  }
};

export default dbConnect;
