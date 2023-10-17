<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore, useCustomerStore } from "~/stores";
const customerStore = useCustomerStore();
const { paramFootballPitchRental } = storeToRefs(customerStore);

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
    title: "Giá thuê",
    width: "18%",
    sortable: false,
    align: "start",
    key: "price",
  },
  {
    title: "Số lượng",
    width: "18%",
    align: "start",
    sortable: false,
    key: "amount",
  },
  {
    title: "Tác vụ",
    width: "12%",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const appStore = useAppStore();
const { breadCrumbs } = storeToRefs(appStore);
breadCrumbs.value = [
  {
    title: "Trang chủ",
    disabled: false,
    href: "/",
  },
  {
    title: "Đặt sân",
    disabled: true,
    href: "/fooball-piches/rental",
  },
];
function addAccessoryRental() {
  const accessory = {
    accessoriesId: null,
    price: null,
    amount: null,
  };
  paramFootballPitchRental.value.customerAccessoryRentals.push(accessory);
}
</script>
<template>
  <div class="football-pitches-rental-page">
    <v-row class="row">
      <v-col :md="5" class="form">
        <users-football-pitches-rental-form />
      </v-col>
      <v-col md="6" class="info">
        <div class="title">Thông tin thuê sân</div>
        <div class="content">
          <div class="fooballpitch">
            <p class="name field"><b class="label">Tên sân bóng:</b></p>
            <p class="description field"><b class="label">Mô tả:</b></p>
            <p class="duration field"><b class="label">Khung giờ thuê:</b></p>
            <p class="date field"><b class="label">Ngày thuê:</b></p>
            <p class="price field"><b class="label">Giá thuê:</b></p>
            <p class="customername field">
              <b class="label">Tên khách hàng:</b>
            </p>
          </div>
          <div class="accessory-rental">
            <v-data-table
              :headers="headers"
              :items="paramFootballPitchRental.customerAccessoryRentals"
            >
              <template #[`item.sno`]="{ item }">
                {{ item.index + 1 }}
              </template>
              <template #[`item.accessory`]="{ item }">
                <v-autocomplete
                  label="Chọn phụ kiện*"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  menu-icon="false"
                ></v-autocomplete>
              </template>
              <template #[`item.price`]="{ item }">
                {{ item.raw.price }}
              </template>
              <template #[`item.amount`]="{ item }">
                <v-text-field
                  label="Nhập sốt lượng*"
                  variant="outlined"
                ></v-text-field>
              </template>
              <template #[`item.actions`]="{ item }">
                <v-btn
                  class="button -danger"
                  @click="openDiaglogConfirm(item.raw.id)"
                >
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </template>
              <template #bottom>
                <div class="action">
                  <v-btn
                    class="button -primary btnadd"
                    @click="addAccessoryRental"
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
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.football-pitches-rental-page {
  > .row > .info {
    margin-left: 30px;
    width: 100%;
    border-left: 1px solid #b4b2b2;
  }
  > .row > .info > .content > .fooballpitch > .field {
    margin-top: 10px;
  }
  > .row > .info > .title {
    margin: 0 0 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
}
.accessory-rental {
  > :deep(.v-table) > .action {
    text-align: right;
  }
  > :deep(.v-data-table-rows-no-data) > td {
    box-shadow: inset 0 -1px 0 rgba(var(--v-border-color), var(--v-border-opacity));
  }
  > :deep(.v-input__control) > .v-field > .v-field__append-inner {
    display: none;
  }
}
.action {
  margin-top: 10px;
  > :deep(.v-btn) {
    height: 30px;
  }
  > :deep(.v-btn) > .v-btn__content {
    font-size: 10px;
  }
}
</style>
