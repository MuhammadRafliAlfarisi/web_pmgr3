import express from "express";
import supabase from "../config/supabase.js";
import moment from "moment/moment.js";


import configureMiddleware from "../config/middleware.js";
import authenticateToken from "../config/authenticateToken.js"

const app = express();
configureMiddleware(app);
const router = express.Router();


router.get("/books", async (req, res) => {
    try {
        const { data: books, error } = await supabase
            .from("books")
            .select(`
                *
            `)
            .order("id_book");

        if (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {

    }
});

router.get("/books/:id_book", async (req, res) => {
    const { id_book } = req.params;

    try {
        const { data: books, error } = await supabase
            .from("books")
            .select(`
                *
            `)
            .eq("id_book", id_book);

        if (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            data: books[0]
        });
    } catch (error) {

    }
});

router.post("/books", authenticateToken, async (req, res) => {

    const { title, id_genre } = req.body;


    try {
        const { data: books, error } = await supabase
            .from("books")
            .insert({
                title:title,
                id_genre: id_genre,
            })
            .select("*");

        if (error) {
            return res.json(error.message);
        }

        return res.json({ 
            success: true, 
            message : "Book Added Successfully",
            data: books 
        });
    } catch (error) {
        return res.json(error);
    }
});

router.put("/books/:id_book", authenticateToken, async (req, res) => {
    const { id_book } = req.params;
    const { title, id_genre } = req.body;


    try {
        const { data: books, error } = await supabase
            .from("books")
            .update({
                title: title,
                id_genre : id_genre
            })
            .eq("id_book", id_book)
            .select("*");

        if (error) {
            return res.json(error.message);
        }

        return res.json({ 
            success: true, 
            message : "Book Updated Successfully",
            data: books 
        });
    } catch (error) {
        return res.json(error);
    }
});

router.delete("/books/:id_book", authenticateToken, async(req,res) => {
    const { id_book } = req.params;


    try {
        const { data: books, error } = await supabase
            .from("books")
            .delete()
            .eq("id_book", id_book);

        if (error) {
            return res.json(error.message);
        }

        return res.json({ 
            success: true, 
            message : "Book Deleted Successfully",
            data: books 
        });
    } catch (error) {
        return res.json(error);
    }
})

export default router;