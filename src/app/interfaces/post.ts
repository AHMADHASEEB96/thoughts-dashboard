
// Define an interface for the object that will hold the post data coming from the form.
export interface post {
    postTitle: string,
    postPermalink: string,
    postExcerpt: string,
    postCategory: {
        categoryId: string,
        category: string;
    },
    postImageURL: string,
    postContent: string,
    isFeatured: boolean,
    status: string,
    views: number,
    createdAt: Date
}

/* the category that is fetched from the firestore database is an object of id and data (object of key-value paris), but this category that we will construct
from the post form's dropdown menu will be constructed as an oject of two string */