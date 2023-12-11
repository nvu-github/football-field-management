<script lang="ts" setup>
import { ref, onBeforeMount, watchEffect, computed, watch } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useInvoiceStore,
  useAppStore,
  useDialogStore,
  useFootballPitchStore,
  invoiceStatuses,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const rules = {
  customerFootballId: (value: number) => !!value || "Vui lòng chọn khách hàng",
  totalPrice: (value: number) => {
    if (!value) return "Vui lòng nhập tổng tiền hóa đơn!";
    return true;
  },
  status: (value: string) => !!value || "Vui lòng chọn trạng thái",
};

const appStore = useAppStore();
const invoiceStore: any = useInvoiceStore();
const footballPitchStore = useFootballPitchStore();
const { customerFootballPitchRentalAll } = storeToRefs(footballPitchStore);
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { invoices, invoice, payloadInvoice } = storeToRefs(invoiceStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const formattedCustomerFootballPitchRental = ref<any>([]);
const customInvoiceStatuses = ref<any>();

const formattedTotalPrice = computed({
  get: () => {
    const totalPrice = payloadInvoice.value.totalPrice;
    if (totalPrice !== null && totalPrice !== "") {
      return formatPrice(totalPrice);
    }
    return null;
  },
  set: (value) => {
    if (value) {
      const numericValue = parseInt(value.replace(/\./g, ""), 10);
      if (!isNaN(numericValue)) {
        payloadInvoice.value.totalPrice = Number(numericValue);
      }
    }
  },
});

const formattedMoneyPaid = computed({
  get: () => {
    const moneyPaid = payloadInvoice.value.moneyPaid;
    if (moneyPaid !== null && moneyPaid !== "") {
      return formatPrice(moneyPaid);
    }
    return null;
  },
  set: (value) => {
    if (value) {
      const numericValue = parseInt(value.replace(/\./g, ""), 10);
      if (!isNaN(numericValue)) {
        payloadInvoice.value.moneyPaid = Number(numericValue);
      }
    }
  },
});

await footballPitchStore.getAllCustomerFootballPitchRental();
customInvoiceStatuses.value = invoiceStatuses;
formattedCustomerFootballPitchRental.value =
  customerFootballPitchRentalAll.value.filter(
    (customerFootballPitchRental: any) => {
      const { footballPitchName, name, status } = customerFootballPitchRental;
      const invoiceFound = invoices.value.filter((invoice: any) => {
        const invoiceFootballPitchRentalFound =
          invoice.invoiceFootballPitchRental.find(
            (invoiceFootballPitchRental: any) =>
              invoiceFootballPitchRental.customerFootballPitchRental.id ===
              customerFootballPitchRental.id
          );

        return !!invoiceFootballPitchRentalFound;
      });
      const isAccept = status === "ACCEPT";

      customerFootballPitchRental.name = `${footballPitchName} - ${name}`;
      return id
        ? isAccept &&
            (customerFootballPitchRental.invoiceId === id ||
              !customerFootballPitchRental.invoiceStatus)
        : invoiceFound.length === 0 && isAccept;
    }
  );
console.log(formattedCustomerFootballPitchRental.value);
watchEffect(() => {
  const { customerFootballIds } = payloadInvoice.value;

  if (customerFootballIds) {
    payloadInvoice.value.totalPrice = customerFootballIds.reduce(
      (total: number, customerFootballId: any) => {
        const customerFootballPitchRentalFound =
          formattedCustomerFootballPitchRental.value.find(
            ({ id }: any) => id === customerFootballId
          );
        if (customerFootballPitchRentalFound) {
          const totalAccessoryRentalCustomer =
            customerFootballPitchRentalFound.accessoryRentalCustomers.reduce(
              (total: number, accessoryRentalCustomer: any) => {
                return (total +=
                  Number(accessoryRentalCustomer.accessory.price) *
                  accessoryRentalCustomer.amount);
              },
              0
            );
          total +=
            Number(customerFootballPitchRentalFound.price) +
            totalAccessoryRentalCustomer;
        }
        return total;
      },
      0
    );

    const totalInvoiceDetail = payloadInvoice.value.invoiceDetails.reduce(
      (total: number, invoiceDetail: any) => {
        return (total += invoiceDetail.finalCost);
      },
      0
    );
    payloadInvoice.value.totalPrice += totalInvoiceDetail;
  }
});

onBeforeMount(async () => {
  if (id) {
    await invoiceStore.getInvoice(id);
    setInvoiceToForm();
  }
});

function closeDialogInvoice() {
  closeDialog();
}

async function actionInvoice() {
  try {
    payloadInvoice.value = id
      ? { ...payloadInvoice.value, id }
      : payloadInvoice.value;

    if (typeof payloadInvoice.value.customerFootballId === "string")
      payloadInvoice.value.customerFootballId =
        invoice.value.customerFootballPitchRentalId;

    await invoiceStore[action](payloadInvoice.value);
    $toast.success(`${title} hóa đơn thành công`);
    await invoiceStore.getInvoices();
    invoiceStore.resetFormInvoice();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} hóa đơn thất bại`);
  } finally {
    closeDialog();
  }
}

function setInvoiceToForm() {
  const {
    totalPrice,
    moneyPaid,
    status,
    invoiceDetails,
    invoiceFootballPitchRental,
  }: any = invoice.value;
  payloadInvoice.value.customerFootballIds = invoiceFootballPitchRental.map(
    (invoiceFootballPitchRental: any) =>
      invoiceFootballPitchRental.customerFootballPitchRental.id
  );
  payloadInvoice.value.totalPrice = totalPrice;
  payloadInvoice.value.moneyPaid = moneyPaid;
  payloadInvoice.value.status = status;
  payloadInvoice.value.invoiceDetails = invoiceDetails;
}
</script>
<template>
  <div class="dialog-invoice-create">
    <v-form v-model="payloadInvoice.value" @submit.prevent="actionInvoice">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} hóa đơn</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col md="6">
                  <v-select
                    v-model="payloadInvoice.customerFootballIds"
                    label="Chọn khách hàng thuê sân*"
                    item-value="id"
                    item-title="name"
                    variant="underlined"
                    :items="formattedCustomerFootballPitchRental"
                    :rules="[rules.customerFootballId]"
                    required
                    multiple
                  ></v-select>
                </v-col>
                <v-col md="6">
                  <v-select
                    v-model="payloadInvoice.status"
                    label="Trạng thái*"
                    item-value="key"
                    item-title="name"
                    variant="underlined"
                    required
                    :items="customInvoiceStatuses"
                    :rules="[rules.status]"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="6">
                  <v-text-field
                    v-model="formattedMoneyPaid"
                    label="Tiền đã thanh toán (₫)*"
                    type="text"
                    variant="underlined"
                    required
                    class="mr-2"
                    :rules="[rules.totalPrice]"
                  >
                    <template #append> ₫ </template>
                  </v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    v-model="formattedTotalPrice"
                    label="Tổng tiền hóa đơn (₫)*"
                    type="text"
                    variant="underlined"
                    required
                    class="mr-2"
                    :rules="[rules.totalPrice]"
                  >
                    <template #append> ₫ </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <admin-invoice-detail-table-form />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogInvoice">
            Đóng
          </v-btn>
          <v-btn
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!payloadInvoice.value"
          >
            {{ title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-invoice-create {
  width: 60%;

  :deep(.v-card) {
    padding: 5px;
  }

  :deep(.column) > .v-input {
    margin: 0 25px;
  }
}
</style>
