import { storeToRefs } from "pinia";
import { usePaymentStore, useInvoiceStore } from "~/stores";
const paymentStore = usePaymentStore();
const invoiceStore = useInvoiceStore();
const { invoice } = storeToRefs(invoiceStore);
const PAYMENT_CODE_SUCCESS = "00";
// const PAYMENT_CODE_CANCEL = '24'
// const PAYMENT_CODE_FAIL = '97'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const queryString = to.fullPath.split("?")[1];
  const { vnp_Amount } = to.query;
  if (queryString && vnp_Amount) {
    let storage: any;
    const storageDate = localStorage.getItem("paymentMethod");
    if (storageDate) storage = JSON.parse(storageDate)
    const vnpayResult = await paymentStore.getPaymentResult(queryString);
    const { code } = vnpayResult.data;
    if (PAYMENT_CODE_SUCCESS === code) {
      console.log(storage)
      if (storage && storage.status === "paid") {
        await invoiceStore.getInvoice(storage.invoiceId);
        await invoiceStore.updateInvoice({
          id: storage.invoiceId,
          moneyPaid: Number(invoice.value?.totalPrice),
          status: "PAID",
        })
      }
      return storage.status === "rental" ? navigateTo(`/football-pitches/thanks?${queryString}`) : navigateTo(`/football-pitches/histories`);
    }
  }

  return navigateTo(`/football-pitches/`);
});
