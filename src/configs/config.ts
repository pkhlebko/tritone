export const appConfig = {
  lines: [
    {
      name: 'Line 1',
      port: 'COM3',
      flowMode: true,
      enabled: true,
    }
  ],
  devices: [
    {
      type: 'KSD',
      name: 'KSD1',
      addr: 1,
      enabled: true,
      interval: 1000
    }
  ]
};