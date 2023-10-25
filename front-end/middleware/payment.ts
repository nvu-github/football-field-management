import { usePaymentStore } from "~/stores";
const paymentStore = usePaymentStore();
const PAYMENT_CODE_SUCCESS = "00";
// const PAYMENT_CODE_CANCEL = '24'
// const PAYMENT_CODE_FAIL = '97'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const queryString = to.fullPath.split("?")[1];
  const { vnp_Amount } = to.query;
  if (queryString && vnp_Amount) {
    const vnpayResult = await paymentStore.getPaymentResult(queryString);
    const { code } = vnpayResult.data;
    if (PAYMENT_CODE_SUCCESS === code) {
      return navigateTo(`/football-pitches/thanks?${queryString}`);
    }
  }
});
