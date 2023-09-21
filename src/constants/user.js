const ConfigRank = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  DIAMOND: "DIAMOND",
};

const ConfigStatusOrder = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELING: "CANCELING",
  CANCELED: "CANCELED",
  REJECTED_CANCEL: "REJECTED_CANCEL",
  SHIPPED: "SHIPPED",
};

const statusAllowedApprovedRejected = [ConfigStatusOrder.PENDING];
const statusAllowedCanceling = [
  ConfigStatusOrder.PENDING,
  ConfigStatusOrder.APPROVED,
];
const statusAllowedCanceledOrRejected = [ConfigStatusOrder.CANCELING];

module.exports = {
  ConfigRank,
  ConfigStatusOrder,
  statusAllowedApprovedRejected,
  statusAllowedCanceling,

  statusAllowedCanceledOrRejected,
};
