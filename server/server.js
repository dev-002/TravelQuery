require("dotenv").config();
const { connect } = require("mongoose");
const app = require("./app");

connect(process.env.MONGO_URI, {})
  .then((conn) => {
    console.log("Connected to Database:", conn.connection.host);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => {
    console.log("Error connectin to database!", err);
  });
