<script lang="ts" setup>
import { ref } from "vue";
import { format } from "date-fns";
import { useRoute } from "nuxt/app";
import { storeToRefs } from "pinia";
import { useInvoiceStore } from "~/stores";
import { formatPrice } from "~/utils/string";

definePageMeta({
  layout: "blank",
});

const route = useRoute();
const invoiceStore = useInvoiceStore();
const { invoiceDetail }: any = storeToRefs(invoiceStore);
const { id } = route.params;
const sno = ref(0);
await invoiceStore.getInvoiceDetail(+id);
const total = invoiceDetail.value.invoiceDetails.reduce(
  (total: any, invoiceDetail: any) => {
    return {
      amount: (total.amount += Number(invoiceDetail.amount)),
      finalCost: (total.finalCost += Number(invoiceDetail.finalCost)),
    };
  },
  {
    amount: 0,
    finalCost: 0,
  }
);
const footballPitchName = invoiceDetail.value.invoiceFootballPitchRental
  .map(
    (invoiceFootballPitch: any) =>
      invoiceFootballPitch.customerFootballPitchRental.footballPitch.name
  )
  .join(", ");

const leasingDurationTime = invoiceDetail.value.invoiceFootballPitchRental
  .map(
    (invoiceFootballPitch: any) =>
      invoiceFootballPitch.customerFootballPitchRental
        .footballPitchLeasingDuration.leasingDuration.startTime +
      " - " +
      invoiceFootballPitch.customerFootballPitchRental
        .footballPitchLeasingDuration.leasingDuration.endTime
  )
  .join(", ");

const priceRental = invoiceDetail.value.invoiceFootballPitchRental
  .map((invoiceFootballPitch: any) =>
    formatPrice(
      invoiceFootballPitch.customerFootballPitchRental
        .footballPitchLeasingDuration.price
    )
  )
  .join("₫, ");
</script>
<template>
  <div class="invoice-detail-pages">
    <p class="footballname">SÂN BÓNG HOÀNG QUÂN</p>
    <p class="address">ĐC: Thị Trấn Sông Thao, Cẩm Khê, Phú Thọ</p>
    <p class="phone">ĐT: 0964 573 999</p>
    <p class="title">HÓA ĐƠN THUÊ SÂN</p>
    <ul class="info -customer">
      <li class="item -name">
        <span class="label"> Tên khách hàng: </span>
        {{
          invoiceDetail
            ? invoiceDetail.invoiceFootballPitchRental[0]
                .customerFootballPitchRental.customer.name
            : ""
        }}
        <span class="dot"></span>
      </li>
      <li class="item -phone">
        <span class="label"> ĐT: </span>
        {{
          invoiceDetail
            ? invoiceDetail.invoiceFootballPitchRental[0]
                .customerFootballPitchRental.customer.phoneNumber
            : ""
        }}
      </li>
    </ul>
    <ul class="info -football">
      <li class="item -name">
        <span class="label"> Sân thuê: </span>
        {{ invoiceDetail ? footballPitchName : "" }}
      </li>
      <li class="item -price">
        <span class="label"> Giá thuê: </span>
        {{ invoiceDetail ? `${priceRental}₫` : "" }}
      </li>
    </ul>
    <ul class="info -rental">
      <li class="item -day">
        <span class="label"> Ngày thuê: </span>
        {{
          invoiceDetail
            ? format(
                new Date(
                  invoiceDetail.invoiceFootballPitchRental[0].customerFootballPitchRental.rentalDate
                ),
                "dd/MM/yyyy"
              )
            : ""
        }}
      </li>
      <li class="item -time">
        <span class="label"> Thời gian thuê: </span>
        {{ invoiceDetail ? leasingDurationTime : "" }}
      </li>
    </ul>
    <div class="invoice-detail mt-2 mb-8">
      <table class="table">
        <thead class="head">
          <tr class="row">
            <th class="column" width="50">STT</th>
            <th class="column" width="300">Tên phụ kiện</th>
            <th class="column" width="150">Đơn giá</th>
            <th class="column" width="100">Số lượng</th>
            <th class="column" width="150">Thành tiền</th>
          </tr>
        </thead>
        <tbody class="body">
          <tr
            v-for="(detail, index) in invoiceDetail.invoiceDetails"
            :key="index"
            class="row"
          >
            <td class="column text-center">{{ sno + index + 1 }}</td>
            <td class="column">{{ detail.accessory.name }}</td>
            <td class="column text-center">{{ formatPrice(detail.price) }}</td>
            <td class="column text-center">{{ detail.amount }}</td>
            <td class="column text-center">
              {{ formatPrice(detail.finalCost) }}
            </td>
          </tr>
          <tr class="row">
            <td colspan="3" class="column text-center -label">Tổng cộng</td>
            <td class="column text-center -amount">{{ total.amount }}</td>
            <td class="column text-center -total">
              {{ formatPrice(total.finalCost) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="total">
      <span class="label">Tổng tiền thanh toán:</span>
      {{ invoiceDetail ? `${formatPrice(invoiceDetail.totalPrice)} ₫` : "" }}
    </p>
    <p class="total -text">
      <span class="label">Số tiền bằng chữ:</span>
    </p>
    <div class="invoice-footer">
      <div class="customer">
        <p class="title">Khách hàng</p>
        <p class="subtitle">(Ký, ghi rõ họ tên)</p>
      </div>
      <div class="staff">
        <p class="title">Nhân viên</p>
        <p class="subtitle">(Ký, ghi rõ họ tên)</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.invoice-detail-pages {
  width: 900px;
  margin: 0 auto;
  padding: 20px 40px;
  font-family: "Times New Roman", Times, serif;
  font-size: 18px;
  line-height: 1.8;

  > .footballname {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }

  > .address,
  > .phone {
    text-align: center;
    font-size: 18px;
  }

  > .title {
    margin-top: 10px;
    text-align: center;
    font-size: 25px;
    font-weight: bold;
  }

  > .info {
    display: flex;
  }

  > .info.-customer > .item.-name {
    width: 65%;
  }

  > .info.-football > .item.-name,
  > .info.-rental > .item.-day {
    width: 50%;
  }

  > .info > .item {
    list-style: none;
  }

  > .info > .item > .label {
    font-weight: bold;
  }

  > .total {
    font-weight: bold;
  }
}

.invoice-detail {
  > .table {
    width: 100%;
    border-collapse: collapse;
  }

  > .table > .head > .row > .column,
  > .table > .body > .row > .column {
    border: 1px solid;
  }

  > .table > .body > .row > .column {
    padding: 5px;
  }
}

.invoice-footer {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  margin-top: 40px;

  > .customer,
  > .staff {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  > .customer > .title,
  > .staff > .title {
    font-weight: bold;
  }

  > .customer > .subtitle,
  > .staff > .subtitle {
    font-style: italic;
    font-size: 17px;
  }
}
</style>
