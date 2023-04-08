import React from "react";

/**This is the component that contains what is displayed on the modal */
const ModalContent = ({ src }) => {
  const isImage = src.match(/.(jpg|jpeg|png|gif|bmp)/i);
  const isPdf = src.match(/.(pdf)/i);

  if (isImage) return <img src={src} alt="pop" style={{ maxWidth: "100%" }} />;

  if(isPdf) return <iframe src={src} width="100%" height="800px" title="unique" />

  return null
};

export default ModalContent;
