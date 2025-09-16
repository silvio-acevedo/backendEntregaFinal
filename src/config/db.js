import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://silviorodrigo14_db_user:YfZxJKWPlBOeISuD@silvioacevedo.2ps7spd.mongodb.net/coder?retryWrites=true&w=majority&appName=silvioacevedo"
    );
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
