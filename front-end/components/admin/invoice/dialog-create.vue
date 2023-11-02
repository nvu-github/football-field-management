<script lang="ts" setup>
import { ref, onBeforeMount, watchEffect } from "vue";
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

const rules = {
  name: (value: string) => !!value || "Vui lòng nhập tên loại hóa đơn",
};

const appStore = useAppStore();
const invoiceStore: any = useInvoiceStore();
const footballPitchStore = useFootballPitchStore();
const invoiceTypeStore = useInvoiceTypeStore();
const { customerFootballPitchRentals } = storeToRefs(footballPitchStore);
const { invoiceTypes } = storeToRefs(invoiceTypeStore);
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { invoiceType } = storeToRefs(invoiceStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const paramInvoice = ref<Invoice>({
  customerName: "",
});
const formattedCustomerFootballPitchRental = ref<any>([]);

watchEffect(() => {
  if (customerFootballPitchRentals) {
    formattedCustomerFootballPitchRental.value =
      customerFootballPitchRentals.value.filter(
        (customerFootballPitchRental) => {
          const { footballPitchName, name, status } =
            customerFootballPitchRental;
          customerFootballPitchRental.name = `${footballPitchName} - ${name}`;
          return status === "ACCEPT";
        }
      );
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

async function addInvoice() {
  try {
    paramInvoice.value = id
      ? { ...paramInvoice.value, id }
      : paramInvoice.value;
    await invoiceStore[action](paramInvoice.value);
    $toast.success(`${title} hóa đơn thành công`);
    await invoiceStore.getInvoices();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} hóa đơn thất bại`);
  } finally {
    closeDialog();
  }
}

function setInvoiceToForm() {
  const { name }: any = invoiceType.value;
  paramInvoice.value.name = name;
}

invoiceTypeStore.getInvoiceTypes();
footballPitchStore.getCustomerFootballPitchRentals();
</script>
<template>
  <div class="dialog-invoice-create">
    <v-form v-model="paramInvoice.value" @submit.prevent="addInvoice">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} hóa đơn</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="paramInvoice.invoiceTypeId"
                label="Chọn loại hóa đơn*"
                item-value="id"
                item-title="name"
                :items="invoiceTypes"
                variant="underlined"
                required
              ></v-autocomplete>
              <v-text-field
                v-if="paramInvoice.invoiceTypeId !== 1"
                v-model="paramInvoice.customerName"
                label="Tên khách hàng*"
                type="text"
                variant="underlined"
                required
              />
              <v-autocomplete
                v-else
                v-model="paramInvoice.customerFootballId"
                label="Chọn khách hàng thuê sân*"
                item-value="id"
                item-title="name"
                :items="formattedCustomerFootballPitchRental"
                variant="underlined"
                required
              ></v-autocomplete>
              <v-text-field
                v-model="paramInvoice.totalPrice"
                label="Tổng tiền hóa đơn (VNĐ)*"
                type="text"
                variant="underlined"
                required
              >
                <template #append> VNĐ </template>
              </v-text-field>
              <v-autocomplete
                v-model="paramInvoice.status"
                label="Trạng thái*"
                item-value="key"
                item-title="name"
                :items="invoiceStatuses"
                variant="underlined"
                required
              ></v-autocomplete>
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
            :disabled="!paramInvoice.value"
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
  width: 500px;

  :deep(.v-card) {
    padding: 5px;
  }

  :deep(.column) > .v-input {
    margin: 0 25px;
  }
}
</style>
