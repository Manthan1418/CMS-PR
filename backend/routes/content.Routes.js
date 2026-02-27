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

module.exports = router;
