export enum EConfigRank {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  DIAMOND = "DIAMOND",
}

export enum EConfigStatusOrder {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELING = "CANCELING",
  CANCELED = "CANCELED",
  REJECTED_CANCEL = "REJECTED_CANCEL",
  SHIPPED = "SHIPPED",
}

export enum EDefaultPagination {
  PAGE = 1,
  TAKE = 10,
}

export enum EDefaultSort {
  SORT_BY = "created_at",
  ORDER_BY = "ASC",
}
