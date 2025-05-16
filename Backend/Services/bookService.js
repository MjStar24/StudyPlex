import Book from "../Models/bookModel.js";

class bookService{

        
    async addBook(title,author,image,price,discount,rating,inStock,quantity,standard,subject){
        try {

            const existingBook=await Book.findOne({title,author,standard, subject})
            if(existingBook) {
                existingBook.quantity += Number(quantity)
                await existingBook.save();
                return { updated: true, book: existingBook };
             
            }
            else{
                const newBook = await Book.create({title,author,image,price,discount,rating,inStock,quantity,standard,subject})
                return { updated: false, book: newBook };
            }
        } catch (error) {
            console.error("error in posting book", error);
            throw error;
        }
    }

    async fetchBooks(search,page=1,limit=10){
     
        const skip = (page-1)*limit
        const query={}

        if(search){
            const regex= new RegExp(search,"i")

            query.$or=[
                {title:regex},
                {author:regex},
                {subject:regex},
                {standard:regex},
            ];
        }

        const [books, total] = await Promise.all([
            Book.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Book.countDocuments(query)
        ]);

        return {
            books,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        }
    
    }






}
export default new bookService()

