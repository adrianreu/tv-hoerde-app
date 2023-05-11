import { StrapiPagination } from 'src/interfaces/StrapiInterfaces';
import { computed, ref } from 'vue';

export default function usePagination() {
  const totalPages = ref(0);
  const page = ref(0);
  const pageSize = ref(0);
  const total = ref(0);

  const toStrapiPagination = computed<StrapiPagination>(() => ({
    'pagination[page]': page.value,
    'pagination[pageSize]': pageSize.value,
    'pagination[withCount]': true,
  }));

  const nextPage = () => {
    if (page.value + 1 <= totalPages.value) {
      page.value += 1;
    }
  };
  const previousPage = () => {
    if (page.value - 1 >= 1) {
      page.value -= 1;
    }
  };

  return {
    totalPages,
    page,
    pageSize,
    total,
    toStrapiPagination,
    nextPage,
    previousPage,
  };
}
