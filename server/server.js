require("dotenv").config();

const express = require("express");

const pool = require("./postgres-db");

const adminRoutes = require("./src/routes/admin-routes");
const departmentRoutes = require("./src/routes/department-routes");
const librarianRoutes = require("./src/routes/librarian-routes");
const logRoutes = require("./src/routes/log-routes");
const roomRoutes = require("./src/routes/room-routes");

const app = express();

const NODE_PORT = process.env.NODE_PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Kamusta, Mundo!");
});

// routes
// app.use("/api/drrs/admin", adminRoutes);
app.use("/api/drrs/department", departmentRoutes);
// app.use("/api/drrs/librarian", librarianRoutes);
// app.use("/api/drrs/log", logRoutes);
// app.use("/api/drrs/room", roomRoutes);

app.listen(NODE_PORT, () => console.log(`App listening on port ${NODE_PORT}`));


// Check postgres connection
pool.connect((error, client, release) => {
    // pool multiple shared connections, client single connections that have more control
    if (error) {
        console.error("Error connecting to Postgres:", error);
        return;
    }

    console.log("Connected to Postgres successfully");

    // Release the client back to the pool
    release();

    // Perform database operations here

    // Close the pool when done
    // pool.end(() => {
    //     console.log("Pool closed");
    // });
});
