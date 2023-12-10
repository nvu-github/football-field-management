<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { format } from "date-fns";
import { useNuxtApp } from "nuxt/app";
import {
  useDialogStore,
  useFootballPitchStore,
  useInvoiceStore,
  useAuthStore,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const { $toast }: any = useNuxtApp();
const dialogStore = useDialogStore();
const authStore = useAuthStore();
const invoiceStore = useInvoiceStore();
const footballPitchStore = useFootballPitchStore();
const { user } = storeToRefs(authStore);
const { customerFootballPitchRentalDetail } = storeToRefs(footballPitchStore);
const { id }: any = dialogStore.dialog.data;
const payloadAccessoryRentals: any = ref<Array<any>>([]);
const footballPitchRentalId: any = ref<any>(null);
const ADMIN_ROLE = 1;

function closeDetail() {
  dialogStore.closeDialog();
}

async function handleStatusFootballPitchRental(
  footballPitchRentalId: number,
  status: string
) {
  try {
    const statusMessage = status === "ACCEPT" ? "xác nhận" : "hủy";
    const isConfirm = confirm(
      `Bạn có chắc chắn muốn ${statusMessage} đặt sân này?`
    );

    if (isConfirm) {
      await footballPitchStore.updateStatusFootballPitchRental({
        id: footballPitchRentalId,
        status,
      });
      $toast.success(`Đã ${statusMessage} đặt sân thành công`);
      footballPitchStore.getCustomerFootballPitchRentalDetail(id);
      await footballPitchStore.getCustomerFootballPitchRentals();
    }
  } catch (error) {
    console.log(error);
    $toast.error("Đã có lỗi xảy ra");
  }
}

function handleCustomerAccessoryRental({ id, value }: any) {
  footballPitchRentalId.value = id;
  payloadAccessoryRentals.value = value;
}

async function updateAccessoryFootballPitch(
  customerFootballPitchRentalId: any,
  invoiceId: number
) {
  try {
    await footballPitchStore.updateAccessoryRental(
      customerFootballPitchRentalId,
      {
        invoiceId,
        payloadAccessoryRentals: payloadAccessoryRentals.value,
      }
    );
    $toast.success("Cập nhập thông tin phụ kiện thành công");
    await footballPitchStore.getCustomerFootballPitchRentalDetail(invoiceId);
  } catch (error) {
    $toast.error("Cập nhập thông tin phụ kiện thất bại");
  }
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
          <v-col :md="12" class="rental-info">
            <ul class="list -customer">
              <li class="item -title">Khách hàng</li>
              <li class="item -name ml-4">
                <span class="label">Tên khách hàng: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? customerFootballPitchRentalDetail.customerName
                    : ""
                }}
              </li>
              <li class="item -phone ml-4">
                <span class="label">Số điện thoại: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? customerFootballPitchRentalDetail.customerPhoneNumber
                    : ""
                }}
              </li>
            </ul>
            <ul class="list -invoice">
              <li class="item -title">Hóa đơn</li>
              <li class="item -price ml-4">
                <span class="label">Tổng tiền thuê: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? `${formatPrice(
                        customerFootballPitchRentalDetail.totalPrice
                      )} ₫`
                    : ""
                }}
              </li>
              <li class="item -price -moneypaid ml-4">
                <span class="label">Đã thanh toán: </span>
                {{
                  customerFootballPitchRentalDetail
                    ? `${formatPrice(
                        customerFootballPitchRentalDetail.moneyPaid
                      )} ₫`
                    : ""
                }}
              </li>
              <li class="item -status ml-4">
                <span class="label">Trạng thái: </span>
                <v-chip
                  v-if="customerFootballPitchRentalDetail"
                  :color="
                    invoiceStore.getStatusInvoice(
                      customerFootballPitchRentalDetail?.status
                    ).color
                  "
                  >{{
                    invoiceStore.getStatusInvoice(
                      customerFootballPitchRentalDetail?.status
                    ).text
                  }}</v-chip
                >
              </li>
            </ul>
            <ul
              v-if="
                customerFootballPitchRentalDetail &&
                customerFootballPitchRentalDetail.footballPitchRentals.length >
                  0
              "
              :class="['list -football -bordernone']"
            >
              <li class="item -title">Sân bóng đã đặt:</li>
              <div
                v-for="(
                  item, index
                ) in customerFootballPitchRentalDetail.footballPitchRentals"
                :key="index"
                :class="[
                  'wrapper mt-2 ml-4',
                  {
                    '-end':
                      index + 1 ==
                      customerFootballPitchRentalDetail.footballPitchRentals
                        .length,
                  },
                ]"
              >
                <li class="item -name">
                  <span class="label">Tên sân bóng: </span>
                  <b>{{ item.footballPitchName }}</b>
                </li>
                <li class="item -type">
                  <span class="label">Loại sân bóng: </span>
                  <v-chip
                    :color="
                      item.footballPitchTypeId === 1 ? 'primary' : 'danger'
                    "
                    >{{ item.footballPitchTypeName }}</v-chip
                  >
                </li>
                <li class="item -date">
                  <span class="label">Ngày thuê: </span>
                  <b>{{ format(new Date(item.rentalDate), "dd/MM/yyyy") }}</b>
                </li>
                <li class="item -duration">
                  <span class="label">Khung giờ: </span>
                  <b>{{ item.leasingDuration }}</b>
                </li>
                <li class="item -price">
                  <span class="label">Giá thuê sân: </span>
                  {{ `${formatPrice(item.price)} ₫` }}
                </li>
                <li class="item -status">
                  <span class="label">Trạng thái đặt sân: </span>
                  <v-chip
                    :color="
                      footballPitchStore.getStatusCustomerFootballPitchRental(
                        item?.status
                      ).color
                    "
                    >{{
                      footballPitchStore.getStatusCustomerFootballPitchRental(
                        item?.status
                      ).text
                    }}</v-chip
                  >
                </li>
                <li class="item">
                  <b><i>Phụ kiện:</i></b>
                </li>
                <v-row class="accessories mb-3">
                  <v-col cols="12">
                    <user-accessory-table-form
                      :payload="item.accessoryRentals"
                      :footballPitchId="item.id"
                      :is-disabled="
                        item.status === 'REJECT' || user?.roleId !== ADMIN_ROLE
                      "
                      is-admin
                      @handle-customer-accessory-rental="
                        handleCustomerAccessoryRental
                      "
                    />
                  </v-col>
                </v-row>
                <li v-if="user?.roleId === ADMIN_ROLE" class="item -action">
                  {{ footballRentalId }}
                  <v-btn
                    class="button -warning mr-3"
                    :disabled="
                      !footballPitchRentalId || footballPitchRentalId != item.id
                    "
                    @click="
                      updateAccessoryFootballPitch(
                        item.id,
                        customerFootballPitchRentalDetail.id
                      )
                    "
                  >
                    <v-icon> mdi mdi-file-arrow-left-right-outline </v-icon>
                  </v-btn>
                  <v-btn
                    class="button -success mr-3"
                    :disabled="item.status !== 'PENDING'"
                    @click="handleStatusFootballPitchRental(item.id, 'ACCEPT')"
                  >
                    <v-icon> mdi mdi-check-bold </v-icon>
                  </v-btn>
                  <v-btn
                    class="button -danger"
                    :disabled="item.status === 'REJECT'"
                    @click="handleStatusFootballPitchRental(item.id, 'REJECT')"
                  >
                    <v-icon> mdi mdi-close-circle-outline </v-icon>
                  </v-btn>
                </li>
              </div>
            </ul>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="button -default" @click="closeDetail"> Đóng </v-btn>
      </v-card-actions>
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
    &.-football,
    &.-invoice {
      margin-bottom: 5px;
      border-bottom: 1px solid;
    }
    &.-bordernone {
      border-bottom: none;
    }
  }
  &.-right {
    border-left: 1px solid;
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

  // wrapper
  > .list > .wrapper {
    border-bottom: 1px solid #c0c0c0;
  }
  > .list > .wrapper > .item {
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

  > .list > .wrapper > .item.-price > .label {
    color: #000;
  }

  > .list > .wrapper > .item > .label {
    font-style: italic;
  }

  > .list > .wrapper > .item.-action {
    display: flex;
    justify-content: flex-end;

    > .v-btn {
      padding: 10px 0;
      height: 40px;
      min-width: 40px;
    }
  }
}

.accessories {
  :deep(.-btnadd) {
    height: 30px;
    font-size: 12px;
  }
  :deep(.-btndelete) {
    min-width: 20px;
    height: 30px;
    font-size: 12px;
  }
}

.carousel {
  height: 500px !important;
}
</style>
