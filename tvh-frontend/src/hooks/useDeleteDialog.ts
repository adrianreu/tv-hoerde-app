import { useQuasar } from 'quasar';

export default function useApprovalDialog() {
  const $q = useQuasar();
  function checkApproval(message: string, title = 'Bestätigen') {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        cancel: 'Nein',
        ok: 'Ja',
        persistent: true,
      })
        .onOk(async () => {
          resolve(true);
        })
        .onCancel(async () => {
          resolve(false);
        });
    });
  }

  return {
    checkApproval,
  };
}
