import {
  ComputedRef, Ref, computed, ref,
} from 'vue';

export default function useVolleyballPositions() {
  const positionOptions: Ref<{ label: string; value: string; }[]> = ref([
    {
      label: 'Zuspieler',
      value: 'SETTER',
    },
    {
      label: 'Diagonal',
      value: 'DIAGONAL',
    },
    {
      label: 'Libero',
      value: 'LIBERO',
    },
    {
      label: 'Mittelblocker',
      value: 'MIDDLEBLOCKER',
    },
    {
      label: 'Außenangreifer',
      value: 'WINGATTACKER',
    },
    {
      label: 'Trainer',
      value: 'TRAINER',
    },
    {
      label: 'Co-Trainer',
      value: 'CO_TRAINER',
    },
  ]);

  const positionOptionsOnlyLabels: ComputedRef<string[]> = computed(
    () => positionOptions.value.map((option) => option.label),
  );

  function positionValueToLabel(value: string): string {
    const foundOption = positionOptions.value.find((option) => option.value === value);
    if (foundOption) {
      return foundOption.label;
    }
    return '';
  }
  return {
    positionOptions,
    positionOptionsOnlyLabels,
    positionValueToLabel,
  };
}
