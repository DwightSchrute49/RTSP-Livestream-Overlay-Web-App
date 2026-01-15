const BASE = "http://localhost:5000";

export const getOverlays = async () =>
  fetch(`${BASE}/overlays`).then((r) => r.json());

export const createOverlay = async (data) =>
  fetch(`${BASE}/overlays`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateOverlay = async (id, data) =>
  fetch(`${BASE}/overlays/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteOverlay = async (id) =>
  fetch(`${BASE}/overlays/${id}`, { method: "DELETE" });
