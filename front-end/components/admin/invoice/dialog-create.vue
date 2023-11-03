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
  invoiceTypeId: (value: number) => !!value || "Vui lòng chọn loại hóa đơn",
  customerName: (value: string) => !!value || "Vui lòng nhập tên khách hàng",
  customerFootballId: (value: number) => !!value || "Vui lòng chọn khách hàng",
  totalPrice: (value: number) => {
    if (!value) return "Vui lòng chọn khách hàng";
    if (value <= 0) return "Tổng tiền hóa đơn không hợp lệ" 
    return true
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
const { invoiceType, paramInvoice } = storeToRefs(invoiceStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
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
              <v-row>
                <v-col md="6">
                  <v-autocomplete
                v-model="paramInvoice.invoiceTypeId"
                label="Chọn loại hóa đơn*"
                item-value="id"
                item-title="name"
                variant="underlined"
                required
                :items="invoiceTypes"
                :rules="[rules.invoiceTypeId]"
              ></v-autocomplete>
                </v-col>
                <v-col md="6">
                  <v-text-field
                v-if="paramInvoice.invoiceTypeId !== 1"
                v-model="paramInvoice.customerName"
                label="Tên khách hàng*"
                type="text"
                variant="underlined"
                required
                :rules="[rules.customerName]"
              />
              <v-autocomplete
                v-else
                v-model="paramInvoice.customerFootballId"
                label="Chọn khách hàng thuê sân*"
                item-value="id"
                item-title="name"
                variant="underlined"
                required
                :items="formattedCustomerFootballPitchRental"
                :rules="[rules.customerFootballId]"
              ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="6">
                  <v-text-field
                    v-model="paramInvoice.totalPrice"
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
                  <v-autocomplete
                    v-model="paramInvoice.status"
                    label="Trạng thái*"
                    item-value="key"
                    item-title="name"
                    variant="underlined"
                    required
                    :items="invoiceStatuses"
                    :rules="[rules.status]"
                  ></v-autocomplete>
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
  width: 60%;

  :deep(.v-card) {
    padding: 5px;
  }

  :deep(.column) > .v-input {
    margin: 0 25px;
  }
}
</style>
