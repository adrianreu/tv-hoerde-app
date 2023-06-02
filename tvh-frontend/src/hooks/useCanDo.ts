import { RoleType } from 'src/api/authApi';
import { useAuthStore } from 'src/stores/authStore';
import { computed } from 'vue';

export function useCanDo() {
  const { userHasARole } = useAuthStore();

  const canCreateNewPost = computed<boolean>(() => userHasARole([
    RoleType.TeamEditor, RoleType.Authenticated,
  ]));

  const canEditTeam = computed<boolean>(() => userHasARole([
    RoleType.TeamEditor,
  ]));

  const canEditEvent = computed<boolean>(() => userHasARole([
    RoleType.TeamEditor,
  ]));
  return {
    canCreateNewPost,
  };
}
