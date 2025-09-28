export interface PostsPagination <T>{
    posts: T,
    totalPages: number,
    categoryName?: string
};

export interface Categories {
    categories: BlogCollectionItem['categories'],
    slugified_categories: BlogCollectionItem['slugified_categories']
}

export interface CardPost {
    id: string,
    title: string,
    description: string,
    path: string,
    image: string,
    date?: string,
    dateFormatted?: string
}
