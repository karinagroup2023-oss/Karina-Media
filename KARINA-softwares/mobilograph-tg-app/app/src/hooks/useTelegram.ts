import WebApp from '@twa-dev/sdk';

export function useTelegram() {
  const user = WebApp.initDataUnsafe?.user;

  const showMainButton = (text: string, onClick: () => void) => {
    WebApp.MainButton.text = text;
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(onClick);
  };

  const hideMainButton = () => {
    WebApp.MainButton.hide();
  };

  const showBackButton = (onClick: () => void) => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onClick);
  };

  const hideBackButton = () => {
    WebApp.BackButton.hide();
  };

  const hapticFeedback = (type: 'success' | 'error' | 'warning') => {
    WebApp.HapticFeedback.notificationOccurred(type);
  };

  const openLink = (url: string) => {
    WebApp.openLink(url);
  };

  const openTelegramLink = (url: string) => {
    WebApp.openTelegramLink(url);
  };

  const close = () => {
    WebApp.close();
  };

  const themeParams = WebApp.themeParams;

  return {
    user,
    themeParams,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    openLink,
    openTelegramLink,
    close,
  };
}
