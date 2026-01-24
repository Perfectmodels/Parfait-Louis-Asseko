// Firebase Connection Test Script
// Run this with: node src/scripts/testFirebaseConnection.mjs

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC_5TsXHPLloX80SzN9GQaaDL4EPlL-WSc",
    authDomain: "perfectmodels-4e5fa.firebaseapp.com",
    databaseURL: "https://perfectmodels-4e5fa-default-rtdb.firebaseio.com",
    projectId: "perfectmodels-4e5fa",
    storageBucket: "perfectmodels-4e5fa.firebasestorage.app",
    messagingSenderId: "1072431985374",
    appId: "1:1072431985374:web:55f7a7899d05e68fe5484f",
    measurementId: "G-CSP65WPY89"
};

console.log("🔥 Testing Firebase Connection...\n");

try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    console.log("✅ Firebase initialized successfully");
    console.log("📊 Database URL:", firebaseConfig.databaseURL);

    // Test 1: Read root data
    console.log("\n📖 Test 1: Reading root data...");
    const rootRef = ref(db, '/');
    const rootSnapshot = await get(rootRef);

    if (rootSnapshot.exists()) {
        const data = rootSnapshot.val();
        const collections = Object.keys(data);
        console.log("✅ Root data exists");
        console.log("📦 Collections found:", collections.length);
        console.log("📋 Collection names:", collections.join(', '));

        // Count items in each collection
        console.log("\n📊 Collection Statistics:");
        for (const collName of collections) {
            const collData = data[collName];
            if (Array.isArray(collData)) {
                console.log(`   - ${collName}: ${collData.length} items (array)`);
            } else if (typeof collData === 'object' && collData !== null) {
                const itemCount = Object.keys(collData).length;
                console.log(`   - ${collName}: ${itemCount} items (object)`);
            } else {
                console.log(`   - ${collName}: config value`);
            }
        }
    } else {
        console.log("⚠️  Root data is empty - database needs to be seeded");
    }

    // Test 2: Write test data
    console.log("\n✍️  Test 2: Writing test data...");
    const testRef = ref(db, 'test/connectionTest');
    await set(testRef, {
        timestamp: new Date().toISOString(),
        message: "Firebase connection test successful",
        status: "OK"
    });
    console.log("✅ Test data written successfully");

    // Test 3: Read test data back
    console.log("\n📖 Test 3: Reading test data back...");
    const testSnapshot = await get(testRef);
    if (testSnapshot.exists()) {
        console.log("✅ Test data read successfully:");
        console.log("   ", JSON.stringify(testSnapshot.val(), null, 2));
    }

    console.log("\n🎉 All Firebase connection tests passed!");
    console.log("✅ Firebase Realtime Database is working correctly");

} catch (error) {
    console.error("\n❌ Firebase connection test failed:");
    console.error("Error:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
}

process.exit(0);
