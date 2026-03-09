const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Get all pages with metadata
router.get("/pages", async (req, res) => {
  try {
    const snapshot = await db.ref("pages/").once("value");
    const pages = snapshot.val() || {};

    // Return page list with metadata
    const pageList = Object.keys(pages).map(pageName => ({
      name: pageName,
      title: pages[pageName].metadata?.title || pageName,
      sections: pages[pageName].metadata?.sections || [],
    }));

    res.json(pageList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all pages data (for backward compatibility)
router.get("/page", async (req, res) => {
  try {
    const snapshot = await db.ref("pages/").once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single page content
router.get("/page/:name", async (req, res) => {
  try {
    const pageName = req.params.name;
    const snapshot = await db.ref(`pages/${pageName}`).once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new page
router.post("/page/:name", async (req, res) => {
  try {
    const pageName = req.params.name;
    const content = req.body;

    // Initialize with metadata if not present
    if (!content.metadata) {
      content.metadata = {
        title: pageName,
        sections: [],
        createdAt: new Date().toISOString(),
      };
    }

    await db.ref(`pages/${pageName}`).set(content);
    res.json({ message: "Page created successfully", pageName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update page content and sections order
router.put("/page/:name", async (req, res) => {
  try {
    const pageName = req.params.name;
    const content = req.body;
    await db.ref(`pages/${pageName}`).set(content);
    res.json({ message: "Page updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update page sections order
router.put("/page/:name/sections", async (req, res) => {
  try {
    const pageName = req.params.name;
    const { sections } = req.body;
    await db.ref(`pages/${pageName}/metadata/sections`).set(sections);
    res.json({ message: "Sections order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a page
router.delete("/page/:name", async (req, res) => {
  try {
    const pageName = req.params.name;
    await db.ref(`pages/${pageName}`).remove();
    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
