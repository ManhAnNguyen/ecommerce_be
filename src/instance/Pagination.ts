class Pagination {
  page: number;
  take: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
  totalPage: number;

  constructor(total: number, page: number, take: number) {
    this.page = page;
    this.take = take;
    this.total = total;
    this.totalPage = Math.ceil(total / take);
    this.hasNextPage = this.page < this.totalPage;
    this.hasPreviousPage = this.page > 1;
  }
}

export default Pagination;
