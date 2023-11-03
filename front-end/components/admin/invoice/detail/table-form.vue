<script lang="ts" setup>
import { ref, resolveComponent, watch } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useCustomerStore,
  useAccessoryStore,
  useDialogStore,
  useInvoiceStore,
} from "~/stores";
import { generateId, formatPrice } from "~/utils/string";

const rules = {
  accessoryId: (value: number) => {
    if (!value) return "Vui lòng chọn phụ kiện!";
    return true;
  },
  amount: (value: number) => {
    if (!value) return "Vui lòng nhập số lượng!";
    return true;
  },
};

const headers = [
  {
    title: "STT",
    align: "center",
    width: "3%",
    sortable: false,
    key: "sno",
  },
  {
    title: "Tên phụ kiện",
    width: "23%",
    align: "start",
    sortable: false,
    key: "accessory",
  },
  {
    title: "Đơn giá",
    width: "20%",
    sortable: false,
    align: "start",
    key: "price",
  },
  {
    title: "Số lượng",
    width: "23%",
    align: "start",
    sortable: false,
    key: "amount",
  },
  {
    title: "Thành tiền",
    width: "23%",
    align: "start",
    sortable: false,
    key: "finalCost",
  },
  {
    title: "Tác vụ",
    width: "10%",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const { $toast }: any = useNuxtApp();
const customerStore = useCustomerStore();
const accessoryStore = useAccessoryStore();
const dialogStore = useDialogStore();
const invoiceStore = useInvoiceStore();
const { accessories } = storeToRefs(accessoryStore);
const { paramInvoice }: any = storeToRefs(invoiceStore);
const formattedAccessories = ref<any>([]);
const priceAccessories = ref<any>({});

watch(
  () =>
    paramInvoice.value.invoiceDetails?.map(
      (invoiceDetail: any) => invoiceDetail.accessoryId
    ),
  (accessoriesValues) => {
    accessoriesValues?.map((id: number) => {
      if (id) {
        const accessoryFound = accessories.value.find(
          (accessory) => id === accessory.id
        );
        const { id: accessoryId, price }: any = accessoryFound;
        priceAccessories.value = {
          ...priceAccessories.value,
          [accessoryId]: { price },
        };
      }
    });
    formattedAccessories.value = accessories.value;
    // .filter((accessory) => !accessoriesValues?.includes(accessory.id))
    // .map((accessory) => convertProxyObjToObj(accessory))
  },
  {
    deep: true,
  }
);

function addInvoiceDetail() {
  const invoiceDetail = {
    id: generateId(),
    amount: null,
    price: null,
    finalCost: null,
    accessoryId: null,
  };
  paramInvoice.value.invoiceDetails?.push(invoiceDetail);
}

function deleteInvoiceDetail(id: string) {
  const { invoiceDetails } = paramInvoice.value;
  paramInvoice.value.invoiceDetails =
    invoiceDetails.filter(
      (invoiceDetail: any) => invoiceDetail.id !== id
    );
}

async function getAccessoryDetail(id: string) {
  const { invoiceDetails } = paramInvoice.value;
  const accessoryFound = invoiceDetails.find(
    (accessoryRental: any) => accessoryRental.id === id
  );

  if (!accessoryFound.accessoryId) {
    return $toast.error("Vui lòng chọn phụ kiện!");
  }

  await dialogStore.showDialog(
    resolveComponent("user-accessory-dialog-detail"),
    {
      id: accessoryFound.accessoryId,
    }
  );
}

accessoryStore.getAccessories();
</script>

<template>
  <div class="accessory-table-form">
    <v-data-table
      class="table"
      :headers="headers"
      :items="paramInvoice.invoiceDetails"
    >
      <template #[`item.sno`]="{ item }">
        {{ item.index + 1 }}
      </template>
      <template #[`item.accessory`]="{ item }">
        <v-autocomplete
          v-model="item.raw.accessoryId"
          label="Chọn phụ kiện*"
          item-value="id"
          item-title="name"
          variant="outlined"
          menu-icon="false"
          class="pt-3"
          :items="formattedAccessories"
          :rules="[rules.accessoryId]"
        ></v-autocomplete>
      </template>
      <template #[`item.price`]="{ item }">
        <span class="price">
          {{
            `${
              priceAccessories[item.raw.accessoryId]
                ? `${formatPrice(
                    priceAccessories[item.raw.accessoryId].price
                  )} VNĐ`
                : ""
            }`
          }}
        </span>
      </template>
      <template #[`item.amount`]="{ item }">
        <v-text-field
          v-model="item.raw.amount"
          label="Nhập số lượng*"
          type="number"
          variant="outlined"
          class="pt-3"
          :rules="[rules.amount]"
        ></v-text-field>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn class="button -warning" @click="getAccessoryDetail(item.raw.id)">
          <v-icon> mdi mdi-list-box-outline </v-icon>
        </v-btn>
        <v-btn
          class="button -danger"
          @click="deleteInvoiceDetail(item.raw.id)"
        >
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </template>
      <template #bottom>
        <div class="action">
          <v-btn class="button -primary btnadd" @click="addInvoiceDetail"
            >Thêm chi tiết
            <template #prepend>
              <v-icon>mdi mdi-plus-box-outline</v-icon>
            </template>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<style lang="scss" scoped>
.accessory-table-form {
  > :deep(.v-table) > .action {
    text-align: right;
  }
  > :deep(.v-data-table-rows-no-data) > td {
    box-shadow: inset 0 -1px 0 rgba(var(--v-border-color), var(--v-border-opacity));
  }
  :deep(.v-data-table__td) > .v-btn {
    min-width: 35px;
    height: 30px;
    margin: 3px;
    padding: 0;
  }
  :deep(.price) {
    position: relative;
    top: -5px;
  }
}

.table {
  :deep(.v-field) {
    height: 35px;
    font-size: 15px;
  }
  :deep(.v-field) > .v-field__field > .v-field__input {
    padding: 6px 10px;
    min-height: 0;
  }
  :deep(.v-field) > .v-field__append-inner {
    display: none !important;
  }
}

.action {
  margin-top: 10px;
  padding: 15px;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  > :deep(.v-btn) {
    height: 30px;
  }
  > :deep(.v-btn) > .v-btn__content {
    font-size: 10px;
  }
}
</style>
