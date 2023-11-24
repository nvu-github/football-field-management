<script lang="ts" setup>
import { ref, onBeforeMount, watchEffect, computed, watch } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useInvoiceStore,
  useAppStore,
  useInvoiceTypeStore,
  useDialogStore,
  useFootballPitchStore,
  invoiceStatuses,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const rules = {
  invoiceTypeId: (value: number) => !!value || "Vui lòng chọn loại hóa đơn",
  customerName: (value: string) => !!value || "Vui lòng nhập tên khách hàng",
  customerPhone: (value: string) => !!value || "Vui lòng nhập số điện thoại",
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
const invoiceTypeStore = useInvoiceTypeStore();
const { customerFootballPitchRentals } = storeToRefs(footballPitchStore);
const { invoiceTypes } = storeToRefs(invoiceTypeStore);
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { invoices, invoice, payloadInvoice } = storeToRefs(invoiceStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const formattedCustomerFootballPitchRental = ref<any>([]);
const RENTAL_INVOICE = 1;
const customInvoiceStatuses = ref<any>();

const formattedPrice = computed({
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

await footballPitchStore.getCustomerFootballPitchRentals();
customInvoiceStatuses.value = invoiceStatuses;
formattedCustomerFootballPitchRental.value =
  customerFootballPitchRentals.value.filter((customerFootballPitchRental) => {
    const { footballPitchName, name, status } = customerFootballPitchRental;
    const invoiceFound = invoices.value.find(
      (invoice: any) =>
        invoice.customerFootballPitchRentalId === customerFootballPitchRental.id
    );
    const isAccept = status === "ACCEPT";

    customerFootballPitchRental.name = `${footballPitchName} - ${name}`;
    return id ? isAccept : !invoiceFound && isAccept;
  });

watchEffect(() => {
  const { customerFootballId, invoiceTypeId, invoiceDetails } =
    payloadInvoice.value;

  if (customerFootballId) {
    const customerFootballPitchRentalFound =
      formattedCustomerFootballPitchRental.value.find(({ id }: any) => {
        return typeof customerFootballId === "string"
          ? id === invoice.value.customerFootballPitchRentalId
          : id === customerFootballId;
      });
    payloadInvoice.value.totalPrice = customerFootballPitchRentalFound
      ? customerFootballPitchRentalFound.price
      : null;
  }

  if (invoiceTypeId && invoiceTypeId !== RENTAL_INVOICE)
    customInvoiceStatuses.value = [invoiceStatuses[0], invoiceStatuses[2]];
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

function handleInvoiceType() {
  const { invoiceTypeId } = payloadInvoice.value;

  if (invoiceTypeId && invoiceTypeId !== RENTAL_INVOICE) {
    customInvoiceStatuses.value = [invoiceStatuses[0], invoiceStatuses[2]];
    payloadInvoice.value.customerFootballId = null;
    payloadInvoice.value.totalPrice = 0;
  }
}

function setInvoiceToForm() {
  const {
    invoiceTypeId,
    totalPrice,
    status,
    footballPitchName,
    customerName,
    customerPhone,
    invoiceDetails,
  }: any = invoice.value;

  payloadInvoice.value.invoiceTypeId = invoiceTypeId;
  payloadInvoice.value.customerName =
    invoiceTypeId !== RENTAL_INVOICE ? customerName : "";
  payloadInvoice.value.customerPhone =
    invoiceTypeId !== RENTAL_INVOICE ? customerPhone : "";
  payloadInvoice.value.customerFootballId =
    invoiceTypeId === RENTAL_INVOICE
      ? `${footballPitchName} - ${customerName}`
      : null;
  payloadInvoice.value.totalPrice = totalPrice;
  payloadInvoice.value.status = status;
  payloadInvoice.value.invoiceDetails = invoiceDetails;
}

invoiceTypeStore.getInvoiceTypes();
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
              <v-select
                v-model="payloadInvoice.invoiceTypeId"
                label="Chọn loại hóa đơn*"
                item-value="id"
                item-title="name"
                variant="underlined"
                required
                :items="invoiceTypes"
                :rules="[rules.invoiceTypeId]"
                @update:modelValue="handleInvoiceType"
              ></v-select>
              <template v-if="payloadInvoice.invoiceTypeId !== RENTAL_INVOICE">
                <v-text-field
                  v-model="payloadInvoice.customerName"
                  label="Tên khách hàng*"
                  type="text"
                  variant="underlined"
                  required
                  :rules="[rules.customerName]"
                />
                <v-text-field
                  v-model="payloadInvoice.customerPhone"
                  label="Số điện thoại*"
                  type="text"
                  variant="underlined"
                  required
                  :rules="[rules.customerPhone]"
                />
              </template>
              <v-autocomplete
                v-else
                v-model="payloadInvoice.customerFootballId"
                label="Chọn khách hàng thuê sân*"
                item-value="id"
                item-title="name"
                variant="underlined"
                required
                :items="formattedCustomerFootballPitchRental"
                :rules="[rules.customerFootballId]"
              ></v-autocomplete>
              <v-row>
                <v-col md="6">
                  <v-text-field
                    v-model="formattedPrice"
                    label="Tổng tiền hóa đơn (VNĐ)*"
                    type="text"
                    variant="underlined"
                    required
                    class="mr-2"
                    :rules="[rules.totalPrice]"
                  >
                    <template #append> VNĐ </template>
                  </v-text-field>
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
