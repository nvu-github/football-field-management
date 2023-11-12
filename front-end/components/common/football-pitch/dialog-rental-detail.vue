<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { format } from "date-fns";
import {
  useDialogStore,
  useFootballPitchStore,
  useInvoiceStore,
  useAuthStore,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const dialogStore = useDialogStore();
const authStore = useAuthStore();
const invoiceStore = useInvoiceStore();
const footballPitchStore = useFootballPitchStore();
const { user } = storeToRefs(authStore);
const { customerFootballPitchRentalDetail } = storeToRefs(footballPitchStore);
const { id }: any = dialogStore.dialog.data;
const CUSTOMER_ROLE = 4;
const columnSizeWithImage = 5;
const columnSizeNotImage = 12;

function closeDetail() {
  dialogStore.closeDialog();
}

footballPitchStore.getCustomerFootballPitchRentalDetail(id);
</script>
<template>
  <div class="dialog-rental-detail">
    <v-card>
      <v-icon class="close" @click="closeDetail">mdi mdi-close-thick</v-icon>
      <v-card-title>
        <h2>Thông tin chi tiết đặt sân</h2>
      </v-card-title>
      <v-card-text>
        <v-row class="football-info">
          <v-col
            v-if="
              customerFootballPitchRentalDetail &&
              customerFootballPitchRentalDetail?.footballPitchImages.length > 0
            "
            md="7"
            class="image"
          >
            <common-carousel
              class="carousel"
              :images="customerFootballPitchRentalDetail?.footballPitchImages"
            />
          </v-col>
          <v-col
            :md="
              customerFootballPitchRentalDetail &&
              customerFootballPitchRentalDetail?.footballPitchImages.length > 0
                ? columnSizeWithImage
                : columnSizeNotImage
            "
            class="rental-info"
          >
            <ul class="list -customer">
              <li class="item -title">Khách hàng</li>
              <li class="item -name">
                <span class="label">Tên khách hàng: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? customerFootballPitchRentalDetail?.customer.name
                    : ""
                }}
              </li>
              <li class="item -phone">
                <span class="label">Số điện thoại: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? customerFootballPitchRentalDetail?.customer.phoneNumber
                    : ""
                }}
              </li>
            </ul>
            <ul
              :class="[
                'list -football',
                {
                  '-bordernone': user?.roleId === CUSTOMER_ROLE,
                },
              ]"
            >
              <li class="item -title">Sân bóng</li>
              <li class="item -name">
                <span class="label">Tên sân bóng: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? customerFootballPitchRentalDetail?.footballPitchName
                    : ""
                }}
              </li>
              <li class="item -type">
                <span class="label">Loại sân bóng: </span>
                <v-chip
                  :color="
                    customerFootballPitchRentalDetail &&
                    customerFootballPitchRentalDetail.footballPitchTypeId
                      ? 'primary'
                      : 'danger'
                  "
                  >{{
                    customerFootballPitchRentalDetail
                      ? customerFootballPitchRentalDetail?.footballPitchTypeName
                      : ""
                  }}</v-chip
                >
              </li>
              <li class="item -date">
                <span class="label">Ngày thuê: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? format(
                        new Date(customerFootballPitchRentalDetail.rentalDate),
                        "dd/MM/yyyy"
                      )
                    : ""
                }}
              </li>
              <li class="item -duration">
                <span class="label">Khung giờ: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? customerFootballPitchRentalDetail.leasingDurationName
                    : ""
                }}
              </li>
              <li class="item -price">
                <span class="label">Giá thuê: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? `${formatPrice(
                        customerFootballPitchRentalDetail.price
                      )} VNĐ`
                    : ""
                }}
              </li>
              <li class="item -status">
                <span class="label">Trạng thái đặt sân: </span>
                <v-chip
                  :color="
                    footballPitchStore.getStatusCustomerFootballPitchRental(
                      customerFootballPitchRentalDetail?.status
                    ).color
                  "
                  >{{
                    footballPitchStore.getStatusCustomerFootballPitchRental(
                      customerFootballPitchRentalDetail?.status
                    ).text
                  }}</v-chip
                >
              </li>
            </ul>
            <ul v-if="user?.roleId !== CUSTOMER_ROLE" class="list -invoice">
              <li class="item -title">Hóa đơn</li>
              <li class="item -price">
                <span class="label">Tổng tiền thuê: </span>
                {{
                  customerFootballPitchRentalDetail &&
                  customerFootballPitchRentalDetail.invoice
                    ? `${formatPrice(
                        customerFootballPitchRentalDetail.invoice.totalPrice
                      )} VNĐ`
                    : ""
                }}
              </li>
              <li class="item -price -moneypaid">
                <span class="label">Đã thanh toán: </span>
                {{
                  customerFootballPitchRentalDetail &&
                  customerFootballPitchRentalDetail.invoice
                    ? `${formatPrice(
                        customerFootballPitchRentalDetail.invoice.moneyPaid
                      )} VNĐ`
                    : ""
                }}
              </li>
              <li class="item -status">
                <span class="label">Trạng thái: </span>
                <v-chip
                  v-if="
                    customerFootballPitchRentalDetail &&
                    customerFootballPitchRentalDetail.invoice
                  "
                  :color="
                    invoiceStore.getStatusInvoice(
                      customerFootballPitchRentalDetail?.invoice.status
                    ).color
                  "
                  >{{
                    invoiceStore.getStatusInvoice(
                      customerFootballPitchRentalDetail?.invoice.status
                    ).text
                  }}</v-chip
                >
              </li>
            </ul>
          </v-col>
        </v-row>
        <v-row class="accessories">
          <v-col cols="12">
            <v-row class="title"> Phụ kiện </v-row>
            <v-table>
              <thead>
                <tr>
                  <th class="text-center">STT</th>
                  <th class="text-left">Tên phụ kiện</th>
                  <th class="text-center">Số lượng</th>
                  <th class="text-center">Giá thuê</th>
                </tr>
              </thead>
              <tbody
                v-if="
                  customerFootballPitchRentalDetail &&
                  customerFootballPitchRentalDetail.accessoryRentals.length > 0
                "
              >
                <tr
                  v-for="(
                    accessory, key
                  ) in customerFootballPitchRentalDetail.accessoryRentals"
                  :key="key"
                >
                  <td class="text-center">
                    {{ key + 1 }}
                  </td>
                  <td>{{ accessory.name }}</td>
                  <td class="text-center">{{ accessory.amount }}</td>
                  <td class="text-center">
                    {{ formatPrice(accessory.price) }} VNĐ
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="4" class="text-center">
                    Không có thông tin phụ kiện
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
.dialog-rental-detail {
  position: relative;
  width: 100%;

  > .v-card {
    padding: 10px;
  }

  > .v-card > .v-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
}

.rental-info {
  > .list {
    &.-customer,
    &.-football {
      margin-bottom: 5px;
      border-bottom: 1px solid;
    }
    &.-bordernone {
      border-bottom: none;
    }
  }

  > .list > .item {
    padding: 8px 0;
    list-style: none;

    &.-title {
      font-size: 20px;
      font-weight: 600;
    }

    &.-price {
      color: #e60000;
    }
  }

  > .list > .item.-price > .label {
    color: #000;
  }

  > .list > .item > .label {
    font-style: italic;
  }
}

.accessories {
  border-top: 1px solid;
  > .v-col > .title {
    padding: 10px 5px;
    font-size: 20px;
    font-weight: 600;
  }
}

.carousel {
  height: 500px !important;
}
</style>
