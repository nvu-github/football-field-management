<script lang="ts" setup>
import userImg from "~/public/user.jpg";
import { resolveComponent } from "vue";
import { useRoute, navigateTo, useRuntimeConfig } from "nuxt/app";

import { storeToRefs } from "pinia";
import { format } from "date-fns";
import {
  useAppStore,
  useFootballPitchStore,
  useCustomerStore,
  useDialogStore,
  useAuthStore,
  useEvaluationStore,
} from "~/stores";
import { formatPrice } from "~/utils/string";

const authStore = useAuthStore();
const appStore = useAppStore();
const dialogStore = useDialogStore();
const evaluationStore = useEvaluationStore();
const footballPitchStore = useFootballPitchStore();
const customerStore = useCustomerStore();
const runtimeConfig = useRuntimeConfig();
const { breadCrumbs } = storeToRefs(appStore);
const { user } = storeToRefs(authStore);
const { footballPitch }: any = storeToRefs(footballPitchStore);
const { payloadCustomerFootballPitchRental }: any = storeToRefs(customerStore);
const route = useRoute();
const { id }: any = route.params;

await footballPitchStore.getFootballPitch(id);
breadCrumbs.value = [
  {
    title: "Trang chủ",
    disabled: false,
    href: "/",
  },
  {
    title: "Sân bóng",
    disabled: false,
    href: "/football-pitches",
  },
  {
    title: footballPitch.value ? footballPitch.value.name : "",
    disabled: true,
    href: "/football-pitches",
  },
];

async function openDialogCreateEvaluation() {
  await dialogStore.showDialog(
    resolveComponent("user-evaluation-dialog-create"),
    {
      title: "Thêm đánh giá",
      action: "createEvaluation",
      actionReload: "getFootballPitch",
    }
  );
}

async function openDialogUpdateEvaluation(id: number) {
  await dialogStore.showDialog(
    resolveComponent("user-evaluation-dialog-create"),
    {
      id,
      title: "Cập nhật đánh giá",
      action: "updateEvaluation",
      actionReload: "getFootballPitch",
    }
  );
}

function openDialogImageAlbum(url: string) {
  dialogStore.showDialog(resolveComponent("user-evaluation-dialog-album"), {
    url,
  });
}

async function deleteEvaluation(id: number) {
  await evaluationStore.deleteEvaluation(id);
  await footballPitchStore.getFootballPitch(id);
}

function navigateToRental(footballPitchLeasingDuration: number) {
  payloadCustomerFootballPitchRental.value.footballPitchId = Number(id);
  payloadCustomerFootballPitchRental.value.leasingDurationId = Number(
    footballPitchLeasingDuration
  );
  payloadCustomerFootballPitchRental.value.rentalDate = new Date();
  return navigateTo(`/football-pitches/rental?type=now`);
}
</script>
<template>
  <div class="football-pitch-detail">
    <v-row>
      <v-col class="football-image" md="7">
        <common-carousel
          class="carousel"
          :images="footballPitch ? footballPitch.images : []"
        />
      </v-col>
      <v-col class="football-info" md="5">
        <ul class="info">
          <li class="item">
            <span class="label">Tên sân bóng: </span>
            {{ footballPitch ? footballPitch.name : "" }}
          </li>
          <li class="item">
            <span class="label">Loại sân bóng: </span>
            <v-chip color="primary">{{
              footballPitch.footballTypeName
            }}</v-chip>
          </li>
          <li class="item">
            <span class="label">Mô tả: </span> <br />
            <span v-html="footballPitch ? footballPitch.description : ''" />
          </li>
          <li class="item">
            <span class="label">Trạng thái: </span>
            <v-chip
              class="ma-2"
              :color="
                footballPitchStore.getColorStatusFootballPitch(
                  footballPitch.status
                )
              "
              text-color="white"
            >
              {{
                footballPitchStore.getStatusFootballPitch(footballPitch.status)
              }}
            </v-chip>
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row class="football-duration">
      <v-col cols="12">
        <v-row class="title"> Các khung giờ thuê sân </v-row>
        <v-table>
          <thead>
            <tr>
              <th class="text-center" width="20">STT</th>
              <th class="text-left" width="400">Tên sân bóng</th>
              <th class="text-left" width="300">Khung giờ</th>
              <th class="text-center" width="200">Giá thuê</th>
              <th class="text-center" width="100">Tác vụ</th>
            </tr>
          </thead>
          <tbody v-if="footballPitch">
            <tr
              v-for="(
                leasingDuration, index
              ) in footballPitch.footballPitchLeasingDuration"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>
                {{ footballPitch ? footballPitch.name : "" }}
              </td>
              <td>
                {{ leasingDuration.leasingDuration.startTime }} -
                {{ leasingDuration.leasingDuration.endTime }}
              </td>
              <td class="text-center">
                {{ formatPrice(leasingDuration.price) }} ₫
              </td>
              <td class="text-center action">
                <v-tooltip location="right" text="Đặt ngay">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      class="button -primary -rental"
                      @click="navigateToRental(leasingDuration.id)"
                    >
                      <v-icon>mdi mdi-alpha-r-circle-outline</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center">
                Không có thông tin khung giờ
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row class="football-evaluation">
      <div class="title">Đánh giá sân bóng</div>
      <div v-if="user && user?.loggedIn" class="action">
        <v-btn class="button -warning" @click="openDialogCreateEvaluation">
          Thêm đánh giá
          <template #prepend>
            <v-icon>mdi mdi-comment-quote-outline</v-icon>
          </template>
        </v-btn>
      </div>
      <div v-if="footballPitch" class="evaluationlist">
        <div
          v-for="(evaluation, index) in footballPitch.evaluation"
          :key="index"
          class="evaluationitem"
        >
          <div class="avatar">
            <v-img :src="userImg" />
          </div>
          <ul class="evaluation">
            <li class="item -name">{{ evaluation.customer.name }}</li>
            <li class="item -score">
              <v-rating
                v-model="evaluation.score"
                color="orange-lighten-1"
                active-color="orange"
                readonly
                :size="25"
              />
            </li>
            <li class="item -date">
              {{ format(new Date(evaluation.createdAt), "dd/MM/yyyy HH:mm") }}
            </li>
            <li class="item -content"><span v-html="evaluation.content" /></li>
            <li class="item -img">
              <v-row>
                <v-col
                  v-for="(img, index) in evaluation.image"
                  :key="index"
                  md="2"
                >
                  <v-img
                    class="imgitem"
                    :src="`${runtimeConfig.public.API_URL}public/${img.url}`"
                    @click="
                      openDialogImageAlbum(
                        `${runtimeConfig.public.API_URL}public/${img.url}`
                      )
                    "
                  />
                </v-col>
              </v-row>
            </li>
          </ul>
          <div class="action">
            <v-menu location="start">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-if="
                    user &&
                    user?.loggedIn &&
                    user.email === evaluation.customer.account.email
                  "
                  v-bind="props"
                  >mdi mdi-dots-vertical</v-icon
                >
              </template>
              <v-list>
                <v-list-item @click="openDialogUpdateEvaluation(evaluation.id)">
                  <template #prepend>
                    <v-icon>mdi mdi-note-edit-outline</v-icon>
                  </template>
                  <v-list-item-title>Sửa đánh giá</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteEvaluation(evaluation.id)">
                  <template #prepend>
                    <v-icon>mdi mdi-file-document-remove-outline</v-icon>
                  </template>
                  <v-list-item-title>Xóa đánh giá</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
      <div v-else class="evaluationempty">
        Chưa có đánh giá nào cho {{ footballPitch ? footballPitch.name : "" }}
      </div>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.football-pitch-detail {
  margin: 20px 0 30px;
}

.football-info {
  > .info > .item {
    list-style: none;
    margin: 10px 0;
  }
  > .info > .item > .label {
    font-weight: bold;
  }
}

.football-duration {
  margin-top: 20px;
  border-top: 1px solid #c5c5c5;
  > .v-col > .v-row {
    padding: 10px 5px;
    font-size: 20px;
    font-weight: 600;
  }
  :deep(.v-btn) {
    min-width: 40px;
  }
}

.football-evaluation {
  margin-top: 20px;
  border-top: 1px solid #c5c5c5;
  > .title {
    width: 100%;
    padding: 10px 5px;
    font-size: 20px;
    font-weight: 600;
  }
  > .action {
    width: 100%;
    text-align: right;
  }
  > .evaluationempty {
    width: 100%;
    margin: 20px 0 10px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  > .evaluationlist {
    width: 100%;
  }
  > .evaluationlist > .evaluationitem {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 0 30px;
    border-bottom: 1px solid #c5c5c5;
    &:first-child {
      padding-top: 10px;
      border-top: 1px solid #c5c5c5;
    }
  }
  > .evaluationlist > .evaluationitem > .avatar {
    width: 5%;
  }
  > .evaluationlist > .evaluationitem > .evaluation {
    width: 90%;
  }
  > .evaluationlist > .evaluationitem > .action {
    width: 5%;
  }
  > .evaluationlist > .evaluationitem > .action > .v-icon {
    cursor: pointer;
  }
  > .evaluationlist > .evaluationitem > .avatar > .v-img {
    margin-top: 5px;
    width: 50px;
  }
  :deep(.evaluation) > .item {
    list-style: none;
    margin: 10px 0 0 10px;
    &.-name {
      margin-bottom: 0;
    }
    &.-score {
      margin: 0 0 0 10px;
    }
    &.-date {
      margin-top: 0;
    }
  }
  :deep(.imgitem) {
    width: 100%;
    cursor: pointer;
  }
}

.carousel {
  height: 300px !important;
}
</style>
