<script lang="ts" setup>
import { onBeforeMount, watch, computed, ref } from "vue";
import { useNuxtApp } from "nuxt/app";
import { storeToRefs } from "pinia";
import {
  useFootballPitchPriceStore,
  useAppStore,
  useDialogStore,
  useLeasingDurationStore,
  useFootballPitchStore,
} from "~/stores";
import { formatPrice } from "~/utils/string";
import { formattedLeasingDuration } from "~/utils/object";

const rules = {
  footballPitch: (value: string) => !!value || "Vui lòng chọn sân bóng",
  leasingDuration: (value: string) => !!value || "Vui lòng chọn khung giờ",
  price: (value: string) => !!value || "Vui lòng nhập giá thuê",
};
const leasingDurationStore = useLeasingDurationStore();
const footballPitchStore = useFootballPitchStore();
const footballPitchPriceStore: any = useFootballPitchPriceStore();
const appStore = useAppStore();
const { $toast }: any = useNuxtApp();
const { isLoading } = storeToRefs(appStore);
const { footballPitchPrice, footballPitchPrices } = storeToRefs(
  footballPitchPriceStore
);
const { leasingDurations }: any = storeToRefs(leasingDurationStore);
const { footballPitches }: any = storeToRefs(footballPitchStore);
const { dialog, closeDialog } = useDialogStore();
const { id, title, action }: any = dialog.data;
const paramsFootballPitchPrice = ref<ParamsFootballPitchPrice>({
  footballPitchId: null,
  leasingDurationId: null,
  price: null,
});
let formattedLeasingDurations = formattedLeasingDuration(
  leasingDurations.value
);

const formattedPrice = computed({
  get: () => {
    if (paramsFootballPitchPrice.value.price) {
      return formatPrice(paramsFootballPitchPrice.value.price);
    }
    return null;
  },
  set: (value) => {
    if (value) {
      paramsFootballPitchPrice.value.price = parseInt(
        value.replace(/\./g, ""),
        10
      );
    }
  },
});

onBeforeMount(async () => {
  if (id) {
    await footballPitchPriceStore.getFootballPitchPrice(id);
    setFootballPitchPriceToForm();
  }
});

watch(
  paramsFootballPitchPrice,
  (newVal) => {
    const { footballPitchId } = newVal;

    const footballPitchPriceFound = footballPitchPrices.value
      .filter(
        (priceValue: any) =>
          priceValue.footballPitchId === footballPitchId ||
          priceValue.footballPitchName.toLowerCase() ===
            footballPitchId.toString().toLowerCase()
      )
      .map((priceValue: any) => priceValue.leasingDurationName);
    formattedLeasingDurations =
      footballPitchPriceFound.length > 0
        ? formattedLeasingDuration(leasingDurations.value).filter(
            (durationValue: any) =>
              !footballPitchPriceFound.includes(durationValue.name)
          )
        : formattedLeasingDuration([...leasingDurations.value]);
  },
  { deep: true }
);

function closeDialogFootballPitchPrice() {
  closeDialog();
}

async function addFootballPitchPrice() {
  try {
    if (id) {
      const { footballPitchId, leasingDurationId } =
        paramsFootballPitchPrice.value;

      const footballPitchFound = footballPitches.value.find(
        (footballPitch: any) =>
          footballPitch.name.toLowerCase() === footballPitchId.toLowerCase()
      )?.id;
      const leasingDurationFound = leasingDurations.value.find(
        (leasingDuration: any) => {
          const name = `${leasingDuration.startTime} - ${leasingDuration.endTime}`;

          return (
            name.toLowerCase() === leasingDurationId.toString().toLowerCase()
          );
        }
      )?.id;

      paramsFootballPitchPrice.value = {
        ...paramsFootballPitchPrice.value,
        footballPitchId: footballPitchFound || footballPitchId,
        leasingDurationId: leasingDurationFound || leasingDurationId,
      };
    }

    paramsFootballPitchPrice.value = id
      ? { ...paramsFootballPitchPrice.value, id }
      : paramsFootballPitchPrice.value;
    await footballPitchPriceStore[action](paramsFootballPitchPrice.value);
    $toast.success(`${title} loại sân bóng thành công`);
    await footballPitchPriceStore.getFootballPitchPrices();
  } catch (error) {
    console.log(error);
    $toast.error(`${title} loại sân bóng thất bại`);
  } finally {
    closeDialog();
  }
}

function setFootballPitchPriceToForm() {
  const { footballPitchName, leasingDurationName, price }: any =
    footballPitchPrice.value;

  paramsFootballPitchPrice.value.footballPitchId = footballPitchName;
  paramsFootballPitchPrice.value.leasingDurationId = leasingDurationName;
  paramsFootballPitchPrice.value.price = price;
}

leasingDurationStore.getLeasingDurations();
footballPitchStore.getFootballPitches();
</script>
<template>
  <div class="dialog-football-pitch-price">
    <v-form
      v-model="paramsFootballPitchPrice.value"
      @submit.prevent="addFootballPitchPrice"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }} giá thuê sân bóng</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="column" cols="12">
              <v-autocomplete
                v-model="paramsFootballPitchPrice.footballPitchId"
                label="Chọn sân bóng*"
                item-value="id"
                item-title="name"
                :items="footballPitches"
                :rules="[rules.footballPitch]"
                variant="underlined"
              ></v-autocomplete>
              <v-autocomplete
                v-model="paramsFootballPitchPrice.leasingDurationId"
                label="Chọn khung giờ*"
                item-value="id"
                item-title="name"
                :items="formattedLeasingDurations"
                :rules="[rules.leasingDuration]"
                variant="underlined"
              ></v-autocomplete>
              <v-text-field
                v-model.trim="formattedPrice"
                label="Giá thuê (VNĐ)*"
                type="text"
                variant="underlined"
                :rules="[rules.price]"
                required
              >
                <template #append> VNĐ </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button -default" @click="closeDialogFootballPitchPrice">
            Đóng
          </v-btn>
          <v-btn
            class="button -primary"
            type="submit"
            :loading="isLoading"
            :disabled="!paramsFootballPitchPrice.value"
          >
            {{ title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
.dialog-football-pitch-price {
  width: 500px;

  :deep(.v-card) {
    padding: 5px;
  }
}
</style>
