export const downlaodSvg = (id: string, anchor: any, fileType: string) => {
  const element = document.querySelector(`#${id}`) as
    | HTMLElement
    | HTMLCanvasElement
    | null;
  const anchoElement = anchor.target as HTMLAnchorElement;

  let url = {
    elementUrl: "",
    extention: "",
  };

  if (!element)
    throw new Error(`<${fileType.toUpperCase()}> not found in the DOM`);

  switch (fileType) {
    case "svg":
      url.elementUrl = createSvgUrl(element);
      url.extention = "svg";
      break;
    case "png":
      url.elementUrl = createPngUrl(element as HTMLCanvasElement);
      url.extention = "png";
      break;
    default:
      break;
  }

  if (!anchoElement) throw new Error("<svg> not found in the DOM");
  anchoElement.href = url.elementUrl;
  anchoElement.download = `QR code.${url.extention}`;
  anchoElement.click();
};

const createSvgUrl = (element: HTMLElement) => {
  const svgData = new XMLSerializer().serializeToString(element);
  const svgBlob = new Blob([svgData], {
    type: "image/svg+xml;charset=utf-8",
  });
  return URL.createObjectURL(svgBlob);
};

const createPngUrl = (element: HTMLCanvasElement) => {
  const pngUrl = element
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");

  return pngUrl;
};
