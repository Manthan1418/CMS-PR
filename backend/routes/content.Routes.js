const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

router.get("/page", async (req, res) => {
  try {
    const snapshot = await db.ref("pages/").once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/page/:name", async (req, res) =>{
  try{
    const pageName = req.params.name;
    const snapshot = await db.ref(`pages/${pageName}`).once("value");
    res.json(snapshot.val());
  }catch(error){
    res.status(500).json({error: error.message});
  }
});

router.post("/page/:name", async (req, res) => {
  try {
    const pageName = req.params.name;
    const content = req.body;
    await db.ref(`pages/${pageName}`).set(content);
    res.json({ message: "Page created/updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/page/:name", async (req, res) => {
  try {
    const pageName = req.params.name;
    const content = req.body;
    await db.ref(`pages/${pageName}`).update(content);
    res.json({ message: "Page updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
