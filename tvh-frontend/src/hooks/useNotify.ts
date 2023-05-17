import { Notify, useQuasar } from 'quasar';

enum NotifyType {
  Success = 1,
  Warning,
  Error,
  Info,
}

export default function useNotify() {
  const $q = useQuasar();
  const notifyConfigs = [
    {
      type: NotifyType.Success,
      config: {
        icon: 'done',
        iconColor: 'green',
      },
    },
    {
      type: NotifyType.Warning,
      config: {
        icon: 'warning',
        iconColor: 'orange',
      },
    },
    {
      type: NotifyType.Error,
      config: {
        icon: 'error',
        iconColor: 'red',
      },
    },
    {
      type: NotifyType.Info,
      config: {
        icon: 'error',
        iconColor: 'blue',
      },
    },
  ];

  function show(text: string, type: NotifyType) {
    const config = notifyConfigs.find(config => config.type === type);
    $q.notify({
      message: text,
      color: 'white',
      textColor: 'black',
      ...config?.config,
    });
  }

  return {
    show,
  };
};
