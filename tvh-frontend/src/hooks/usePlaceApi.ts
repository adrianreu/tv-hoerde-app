import { getPlaces } from 'src/api/placeApi';
import { ref } from 'vue';
import useNotify, { NotifyType } from './useNotify';

export default function usePlaceApi() {
  const { show } = useNotify();
  const placeOptions = ref<{ label: string, value: number }[]>();
  const loadingPlaces = ref(false);
  async function loadPlaceOptions() {
    loadingPlaces.value = true;
    try {
      const places = await getPlaces();
      placeOptions.value = places.map((place) => ({ label: place.name, value: place.id }));
    } catch (error) {
      show('Orte konnten nicht geladen werden.', NotifyType.Error);
      console.log(error);
    } finally {
      loadingPlaces.value = false;
    }
    loadingPlaces.value = false;
  }
  return {
    placeOptions,
    loadingPlaces,
    loadPlaceOptions,
  };
}
