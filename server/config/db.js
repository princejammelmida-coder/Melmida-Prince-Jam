const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "esports_system"
});

db.connect(err => {
    if (err) {
        console.error("⚠️  Database connection failed:", err.message);
        console.log("📝 Please import database/schema.sql in phpMyAdmin");
        console.log("   1. Go to http://localhost/phpmyadmin");
        console.log("   2. Click 'SQL' tab");
        console.log("   3. Copy and paste content from database/schema.sql");
        console.log("   4. Click 'Go'");
        console.log("");
        console.log("⚠️  Server will continue running but database features won't work until database is imported.");
    } else {
        console.log("✅ Database Connected Successfully");
    }
});

module.exports = db;
