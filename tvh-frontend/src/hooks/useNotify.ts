import { useQuasar } from 'quasar';

export enum NotifyType {
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
        icon: 'ph-check',
        iconColor: 'green',
      },
    },
    {
      type: NotifyType.Warning,
      config: {
        icon: 'ph-warning',
        iconColor: 'orange',
      },
    },
    {
      type: NotifyType.Error,
      config: {
        icon: 'ph-warning-circle',
        iconColor: 'red',
      },
    },
    {
      type: NotifyType.Info,
      config: {
        icon: 'ph-warning-circle',
        iconColor: 'blue',
      },
    },
  ];

  function show(text: string, type: NotifyType) {
    const config = notifyConfigs.find((configuration) => configuration.type === type);
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
}
