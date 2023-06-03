import { RoleType } from 'src/api/authApi';
import { useAuthStore } from 'src/stores/authStore';
import { computed } from 'vue';

export function useCanDo() {
  const { userHasARole } = useAuthStore();

  const canEditPost = computed<boolean>(() => userHasARole([
    RoleType.AppEditor,
  ]));

  const canEditTeam = computed<boolean>(() => userHasARole([
    RoleType.TeamEditor, RoleType.AppEditor,
  ]));

  const canEditEvent = computed<boolean>(() => userHasARole([
    RoleType.AppEditor,
  ]));
  return {
    canEditPost,
    canEditTeam,
    canEditEvent,
  };
}
