import { EConfigStatusOrder } from "./enum";

const statusAllowedApprovedRejected = [EConfigStatusOrder.PENDING];
const statusAllowedUserCanceling = [
  EConfigStatusOrder.PENDING,
  EConfigStatusOrder.APPROVED,
];
const statusAllowedRetrieveOrRejectedCanceling = [EConfigStatusOrder.CANCELING];

const statusAllowedUserConfirmShip = [
  EConfigStatusOrder.APPROVED,
  EConfigStatusOrder.REJECTED_CANCEL,
];

export {
  statusAllowedApprovedRejected,
  statusAllowedUserCanceling,
  statusAllowedRetrieveOrRejectedCanceling,
  statusAllowedUserConfirmShip,
};
