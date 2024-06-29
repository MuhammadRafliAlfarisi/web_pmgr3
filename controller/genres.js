import express from "express";
import supabase from "../config/supabase.js";
import moment from "moment/moment.js";

import configureMiddleware from "../config/middleware.js";
import authenticateToken from "../config/authenticateToken.js";

const app = express();
configureMiddleware(app);
const router = express.Router();

// All order
router.get("/genres", async (req, res) => {
  try {
    const { data: genres, error } = await supabase.from("genres").select("*").order("id_genre");

    if (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.log(error);
  }
});

// User Order
router.get("/genres", authenticateToken, async (req, res) => {

  try {
    const { data: genres, error } = await supabase.from("genres").select("*").order("id_genre");

    if (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/genres", authenticateToken, async (req, res) => {

  const { name } = req.body;


  try {
      const { data: genres, error } = await supabase
          .from("genres")
          .insert({
              name:name,
          })
          .select("*");

      if (error) {
          return res.json(error.message);
      }

      return res.json({ 
          success: true, 
          message : "Genre Added Successfully",
          data: genres 
      });
  } catch (error) {
      return res.json(error);
  }
});

router.put("/genres/:id_genre", authenticateToken, async (req, res) => {
  const { id_genre } = req.params;
  const { name } = req.body;


  try {
      const { data: genres, error } = await supabase
          .from("genres")
          .update({
              name: name,
          })
          .eq("id_genre", id_genre)
          .select("*");

      if (error) {
          return res.json(error.message);
      }

      return res.json({ 
          success: true, 
          message : "Genre Updated Successfully",
          data: genres 
      });
  } catch (error) {
      return res.json(error);
  }
});

router.delete("/genres/:id_genre", authenticateToken, async(req,res) => {
  const { id_genre } = req.params;


  try {
      const { data: genres, error } = await supabase
          .from("genres")
          .delete()
          .eq("id_genre", id_genre);

      if (error) {
          return res.json(error.message);
      }

      return res.json({ 
          success: true, 
          message : "Genre Deleted Successfully",
          data: genres 
      });
  } catch (error) {
      return res.json(error);
  }
})

export default router;
