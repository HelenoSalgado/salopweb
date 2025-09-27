export interface PostsPagination {
    posts: BlogCollectionItem[],
    totalPages: number,
    categoryName?: string
};

export interface Categories {
    categories: BlogCollectionItem['categories'],
    slugified_categories: BlogCollectionItem['slugified_categories']
}
