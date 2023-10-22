<script lang="ts" setup>
import { format } from "date-fns";
import { resolveComponent } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useCustomerStore,
  useAccessoryStore,
  useDialogStore,
  useFootballPitchStore,
  useFootballPitchPriceStore,
  useAuthStore,
} from "~/stores";
import { generateId, formatPrice } from "~/utils/string";
import { convertProxyObjToObj } from "~/utils/object";

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
    title: "Giá thuê",
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
    title: "Tác vụ",
    width: "10%",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const { $toast } = useNuxtApp();
const customerStore = useCustomerStore();
const accessoryStore = useAccessoryStore();
const footballPitchStore = useFootballPitchStore();
const footballPitchPriceStore = useFootballPitchPriceStore();
const authStore = useAuthStore();
const { footballPitchPrices } = storeToRefs(footballPitchPriceStore);
const { footballPitch } = storeToRefs(footballPitchStore);
const { paramFootballPitchRental } = storeToRefs(customerStore);
const { accessories } = storeToRefs(accessoryStore);
const { user } = storeToRefs(authStore);
const dialogStore = useDialogStore();
const footballPitchPriceFound = ref<Object>({});
const priceAccessories = ref<any>({});
const formattedAccessories = ref<any>([]);

watchEffect(async () => {
  const { footballPitchId, leasingDurationId } = paramFootballPitchRental.value;
  if (footballPitchId) {
    await footballPitchStore.getFootballPitch(
      paramFootballPitchRental.value.footballPitchId
    );
  }

  if (leasingDurationId) {
    await footballPitchPriceStore.getFootballPitchPrices();
    const leasingDurationRentalId = footballPitchPrices.value.find(
      (footballPitchPrice) => footballPitchPrice.id === leasingDurationId
    );
    footballPitchPriceFound.value = footballPitchPrices.value.find(
      (footballPitchPrice) =>
        footballPitchPrice.leasingDurationId ===
          leasingDurationRentalId?.leasingDurationId &&
        footballPitchPrice.footballPitchId === footballPitchId
    );
  }
});

watch(
  () =>
    paramFootballPitchRental.value.customerAccessoryRentals?.map(
      (customerAccessoryRental) => customerAccessoryRental.accessoryId
    ),
  (accessoriesValues) => {
    accessoriesValues?.map((id) => {
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

function addAccessoryRental() {
  const accessory = {
    id: generateId(),
    accessoryId: null,
    amount: null,
  };
  paramFootballPitchRental.value.customerAccessoryRentals.push(accessory);
}

function deleteAccessoryRental(id: string) {
  const { customerAccessoryRentals } = paramFootballPitchRental.value;
  paramFootballPitchRental.value.customerAccessoryRentals =
    customerAccessoryRentals.filter(
      (accessoryRental) => accessoryRental.id !== id
    );
}

async function getAccessoryDetail(id: string) {
  const { customerAccessoryRentals } = paramFootballPitchRental.value;
  const accessoryFound = customerAccessoryRentals.find(
    (accessoryRental) => accessoryRental.id === id
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
  <div class="rental-info">
    <div class="title">Thông tin đặt sân</div>
    <div class="content">
      <div class="fooballpitch">
        <v-row class="row">
          <v-col
            v-if="footballPitch && footballPitch.images.length > 0"
            class="col"
            md="6"
          >
            <common-carousel class="carousel" :images="footballPitch.images" />
          </v-col>
          <v-col
            class="col"
            :md="footballPitch && footballPitch.images.length > 0 ? 6 : 12"
          >
            <p class="name field">
              <b class="label">Tên sân bóng:</b>
              {{ footballPitch ? footballPitch.name : "" }}
            </p>
            <p class="description field">
              <b class="label">Mô tả: </b>
              <span
                v-if="footballPitch"
                class="ml-2"
                v-html="footballPitch.description"
              />
            </p>
            <p class="duration field">
              <b class="label">Khung giờ thuê: </b
              >{{
                footballPitchPriceFound &&
                footballPitchPriceFound.leasingDurationName
                  ? footballPitchPriceFound.leasingDurationName
                  : ""
              }}
            </p>
            <p class="date field">
              <b class="label">Ngày thuê: </b>
              {{
                paramFootballPitchRental && paramFootballPitchRental.rentalDate
                  ? format(
                      new Date(paramFootballPitchRental.rentalDate),
                      "dd/MM/yyyy"
                    )
                  : ""
              }}
            </p>
            <p class="price field">
              <b class="label">Giá thuê: </b>
              {{
                footballPitchPriceFound &&
                footballPitchPriceFound.price !== undefined
                  ? `${formatPrice(footballPitchPriceFound.price)} VNĐ`
                  : ""
              }}
            </p>
            <p class="customername field">
              <b class="label">Tên khách hàng: </b>{{ user.name }}
            </p>
          </v-col>
        </v-row>
      </div>
      <div class="accessory-rental">
        <v-data-table
          class="table"
          :headers="headers"
          :items="paramFootballPitchRental.customerAccessoryRentals"
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
            <v-btn
              class="button -warning"
              @click="getAccessoryDetail(item.raw.id)"
            >
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
    </div>
  </div>
</template>
<style lang="scss" scoped>
.rental-info {
  > .title {
    margin: 0 0 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
  > .content > .fooballpitch > .row > .col > .carousel {
    height: 200px !important;
  }
  > .content > .fooballpitch > .row > .col > .description {
    display: flex;
  }
  > .content > .fooballpitch > .row > .col > .price {
    color: rgb(209, 32, 32);
    font-weight: bold;
  }
  > .content > .fooballpitch > .row > .col > .price > .label {
    color: #000;
    font-weight: 600;
  }
  > .content > .fooballpitch > .row > .col > .field {
    margin-top: 10px;
  }
}
.accessory-rental {
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
