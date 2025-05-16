// import Book from "../Models/bookModel";
import bookService from "../Services/bookService.js";

class BookController{

    async postBook(req,res){
        try {
            const {title,author,image,price,discount,rating,inStock,quantity,subject,standard}=req.body
            if(!title ||!author ||!image ||!price|| !standard || !subject ||!quantity) return res.status(400).json({message: "required field is empty" });   
    
            const bookDetails = await bookService.addBook(title,author,image,price,discount,rating,inStock,quantity,standard,subject)
            const message = bookDetails.updated ? "Book quantity updated" : "Book added successfully";
            return res.status(200).json({ success: true, message,book:bookDetails.book})
        }    
        catch (error) {
            return res.status(500).json({ message: "Error adding book", error: error.message });
        }  
    }

    async getBooks(req,res){
        const {search,page=1,limit=10} = req.query  
        try {
           

            const bookDetails= await bookService.fetchBooks(search,Number(page),Number(limit))    
            return res.status(200).json({success: true, ...bookDetails})
            
        } catch (error) {
            return res.status(500).json({message:"error in fetching books",error:error.message})
        }

    }

}

export default new BookController()
