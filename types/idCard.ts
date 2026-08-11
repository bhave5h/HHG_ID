export interface IDCardData {
  photoPreviewUrl: string | null;
  name: string;
  stack: string;
  builderTitle?: string;
  passNo?: string;
  selectedFrame?: string;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  qrUrl?: string;
  photoFilter?: string;
}

export const DEFAULT_IDCARD_DATA: Required<Omit<IDCardData, "photoPreviewUrl">> = {
  name: "Ravi kisan",
  stack: "Creative Director",
  builderTitle: "BUILDER",
  passNo: "1",
  selectedFrame: "frame1.png",
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  qrUrl: "https://github.com",
  photoFilter: "none",
};

/**
 * Helper to normalize ID card data fields with standard defaults & formatting
 */
export function normalizeIDCardData(data: Partial<IDCardData>) {
  const name = (data.name?.trim() || DEFAULT_IDCARD_DATA.name).toUpperCase();
  const stack = data.stack?.trim() || DEFAULT_IDCARD_DATA.stack;
  const passNo = (data.passNo?.trim() || DEFAULT_IDCARD_DATA.passNo).toUpperCase();
  const selectedFrame = data.selectedFrame ?? DEFAULT_IDCARD_DATA.selectedFrame;
  const zoom = data.zoom ?? DEFAULT_IDCARD_DATA.zoom;
  const offsetX = data.offsetX ?? DEFAULT_IDCARD_DATA.offsetX;
  const offsetY = data.offsetY ?? DEFAULT_IDCARD_DATA.offsetY;
  const qrUrl = data.qrUrl?.trim() || DEFAULT_IDCARD_DATA.qrUrl;
  const photoFilter = data.photoFilter || DEFAULT_IDCARD_DATA.photoFilter;

  const activePanX = zoom > 1.0 ? offsetX : 0;
  const activePanY = zoom > 1.0 ? offsetY : 0;

  return {
    displayName: name,
    displayStack: stack,
    displayPassNo: passNo,
    frameSrc: selectedFrame && selectedFrame !== "none" ? `/assets/${selectedFrame}` : null,
    selectedFrame,
    zoom,
    offsetX,
    offsetY,
    activePanX,
    activePanY,
    photoPreviewUrl: data.photoPreviewUrl ?? null,
    qrUrl,
    photoFilter,
  };
}

