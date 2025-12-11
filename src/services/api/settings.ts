const API_BASE_URL = process.env.EXPO_PUBLIC_HANIBI_API_BASE_URL ?? '';

type DisplaySettingsPayload = {
  displayCharacter?: boolean;
  useMonochromeDisplay?: boolean;
};

type AlertSettingsPayload = {
  dialogueAlertsEnabled?: boolean;
  cleaningAlertsEnabled?: boolean;
  sensorAlertsEnabled?: boolean;
};

async function postSettings<TPayload>(endpoint: string, payload: TPayload) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Settings API request failed: ${response.status}`);
  }

  return response.json().catch(() => undefined);
}

export const SettingsAPI = {
  updateDisplaySettings(payload: DisplaySettingsPayload) {
    return postSettings('/settings/display', payload);
  },
  updateAlertSettings(payload: AlertSettingsPayload) {
    return postSettings('/settings/alerts', payload);
  },
};
