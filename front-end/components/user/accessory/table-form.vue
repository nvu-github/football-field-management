<script lang="ts" setup>
import { ref, resolveComponent, watchEffect } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import { useCustomerStore, useAccessoryStore, useDialogStore } from "~/stores";
import { generateId, formatPrice } from "~/utils/string";

const { $toast }: any = useNuxtApp();
const rules = {
  accessoryId: (value: number) => {
    if (!value) {
      return "Vui lòng chọn phụ kiện!";
    }
    return true;
  },
  amount: (value: number) => {
    if (!value) {
      return "Vui lòng nhập số lượng!";
    }
    if (Number(value) < 0) {
      return "Số lượng không được nhỏ hơn 0!";
    }
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
    width: "25%",
    align: "start",
    sortable: false,
    key: "accessory",
  },
  {
    title: "Loại phụ kiện",
    width: "20%",
    align: "start",
    sortable: false,
    key: "accessoryType",
  },
  {
    title: "Giá thuê",
    width: "20%",
    sortable: false,
    align: "start",
    key: "price",
  },
  {
    title: "Số lượng",
    width: "20%",
    align: "start",
    sortable: false,
    key: "amount",
  },
  {
    title: "Tác vụ",
    width: "10%",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const customerStore = useCustomerStore();
const accessoryStore = useAccessoryStore();
const { accessories } = storeToRefs(accessoryStore);
const dialogStore = useDialogStore();
const { payloadCustomerFootballPitchRental }: any = storeToRefs(customerStore);
const priceAccessories = ref<any>({});
const accessoryTypes = ref<any>({});

watchEffect(() => {
  const accessoryIds =
    payloadCustomerFootballPitchRental.value.customerAccessoryRentals?.map(
      (customerAccessoryRental: any) => customerAccessoryRental.accessoryId
    );

  accessoryIds?.forEach((id: number) => {
    if (id) {
      const accessoryFound = accessories.value.find(
        (accessory) => id === accessory.id
      );
      if (accessoryFound) {
        const {
          id: accessoryId,
          price,
          accessoryTypeName,
        }: any = accessoryFound;
        priceAccessories.value = {
          ...priceAccessories.value,
          [accessoryId]: price,
        };
        accessoryTypes.value = {
          ...accessoryTypes.value,
          [accessoryId]: accessoryTypeName,
        };
      }
    }
  });
});

function addAccessoryRental() {
  const accessory = {
    id: generateId(),
    accessoryId: null,
    amount: null,
  };
  payloadCustomerFootballPitchRental.value.customerAccessoryRentals.push(
    accessory
  );
}

function deleteAccessoryRental(id: string) {
  const { customerAccessoryRentals } = payloadCustomerFootballPitchRental.value;
  payloadCustomerFootballPitchRental.value.customerAccessoryRentals =
    customerAccessoryRentals.filter(
      (accessoryRental: any) => accessoryRental.id !== id
    );
}

async function getAccessoryDetail(id: string) {
  const { customerAccessoryRentals } = payloadCustomerFootballPitchRental.value;
  const accessoryFound = customerAccessoryRentals.find(
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
      :items="payloadCustomerFootballPitchRental.customerAccessoryRentals"
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
          :items="accessories"
          :rules="[rules.accessoryId]"
        ></v-autocomplete>
      </template>
      <template #[`item.accessoryType`]="{ item }">
        <span class="type">{{
          accessoryTypes[item.raw.accessoryId]
            ? accessoryTypes[item.raw.accessoryId]
            : ""
        }}</span>
      </template>
      <template #[`item.price`]="{ item }">
        <span class="price">
          {{
            `${
              priceAccessories[item.raw.accessoryId]
                ? `${formatPrice(priceAccessories[item.raw.accessoryId])} ₫`
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
          :disabled="!item.raw.accessoryId"
        ></v-text-field>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn class="button -warning" @click="getAccessoryDetail(item.raw.id)">
          <v-icon> mdi mdi-list-box-outline </v-icon>
        </v-btn>
        <v-btn
          class="button -danger"
          @click="deleteAccessoryRental(item.raw.id)"
        >
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </template>
      <template #bottom>
        <div class="action">
          <v-btn class="button -primary btnadd" @click="addAccessoryRental"
            >Thêm phụ kiện
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
  :deep(.price),
  :deep(.type) {
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
