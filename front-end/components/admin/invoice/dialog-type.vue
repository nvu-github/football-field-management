<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import { useInvoiceTypeStore, useAppStore, useDialogStore } from "~/stores";

const rules = {
  name: (value: string) => !!value || "Vui lòng nhập tên loại hóa đơn",
};
const defaultTypeBtn = "update";
const invoiceTypeStore: any = useInvoiceTypeStore();
const appStore = useAppStore();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { invoiceType } = storeToRefs(invoiceTypeStore);
const { dialog, closeDialog } = useDialogStore();
const { data }: any = dialog;
const { id, title, action } = data;
const paramsInvoiceType = ref<InvoiceType>({
  name: "",
});
onBeforeMount(async () => {
  if (id) {
    await invoiceTypeStore.getInvoiceType(id);
    setInvoiceTypeToForm();
  }
});

function closeDialogInvoiceType() {
  closeDialog();
}

async function addInvoiceType() {
  try {
    paramsInvoiceType.value = id
      ? { ...paramsInvoiceType.value, id }
      : paramsInvoiceType.value;
    await invoiceTypeStore[action](paramsInvoiceType.value);
    $toast.success(`${title} loại hóa đơn thành công`);
    await invoiceTypeStore.getInvoiceTypes();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} loại hóa đơn thất bại`);
  } finally {
    closeDialog();
  }
}

function setInvoiceTypeToForm() {
  const { name }: any = invoiceType.value;
  paramsInvoiceType.value.name = name;
}
</script>
<template>
  <div class="dialog-football-pitch-type-create">
    <v-form v-model="paramsInvoiceType.value" @submit.prevent="addInvoiceType">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} loại hóa đơn</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="column" cols="12">
              <v-text-field
                v-model.trim="paramsInvoiceType.name"
                label="Tên loại hóa đơn*"
                type="text"
                variant="underlined"
                :rules="[rules.name]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogInvoiceType">
            Đóng
          </v-btn>
          <v-btn
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsInvoiceType.value"
          >
            {{ title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-football-pitch-type-create {
  width: 500px;

  :deep(.v-card) {
    padding: 5px;
  }

  :deep(.column) {
    display: flex;
  }

  :deep(.column) > .v-input {
    margin: 0 25px;
  }
}
</style>
