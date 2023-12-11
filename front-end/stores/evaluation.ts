export interface Evaluation {
  id?: number;
  score: number;
  content: string;
  image: JSON;
  footballPitchId: number;
}

export const useEvaluationStore = defineStore("evaluationStore", () => {
  const { $apis }: any = useNuxtApp();
  const evaluations = ref<Evaluation[]>([]);
  const evaluation = ref<Evaluation>();

  function createEvaluation(params: Evaluation) {
    delete params.id;
    return $apis.post("evaluations", {
      ...convertProjectObjToObj(params),
    });
  }

  function updateEvaluation(params: Evaluation) {
    const { id }: any = params;
    delete params.id;
    return $apis.patch(`evaluations/${id}`, {
      ...convertProjectObjToObj(params),
    });
  }

  function deleteEvaluation(id: number) {
    return $apis.delete(`evaluations/${id}`);
  }

  async function getEvaluation(id: number) {
    const evaluationList = await $apis.get(`evaluations/${id}`);
    evaluation.value = evaluationList.data;
  }

  async function getEvaluations() {
    const evaluationSingle = await $apis.get("evaluations");
    evaluations.value = evaluationSingle.data;
  }

  function getScoreText(score: number) {
    let text = "Rất hài lòng";
    let color = "success";

    switch (score) {
      case 1:
        text = "Rất tệ";
        color = "red";
        break;

      case 2:
        text = "Tệ";
        color = "orange";
        break;

      case 3:
        text = "Bình thường";
        color = "deep-purple";
        break;

      case 4:
        text = "Hài lòng";
        color = "primary";
        break;
    }

    return {
      text,
      color,
    };
  }

  return {
    evaluation,
    evaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    getEvaluations,
    getEvaluation,
    getScoreText,
  };
});
