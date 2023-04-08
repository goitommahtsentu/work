import React from "react";

/**This is the component on display that triggers the modal when clicked */
const ModalTrigger = ({ src, buttonRef, showModal }) => {
  if (src) {
    return (
      <span onClick={showModal}>
        <img
          ref={buttonRef}
          src={src}
          className="pop_image"
          alt=""
          style={{ visibility: "hidden", height: "20px" }}
        />
        <i style={{ margin: 5 }} className="feather icon-eye text-c-blue" />
      </span>
    );
  }

  return null;
};

export default ModalTrigger;
