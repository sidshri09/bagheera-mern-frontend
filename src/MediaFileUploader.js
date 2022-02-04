import React from 'react';
import { MdOutlinePermMedia, MdOndemandVideo } from "react-icons/md";
import ReactTooltip from "react-tooltip";

const MediaFileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    props.uploadFile(fileUploaded);
  };
  return (
    <>
      <MdOutlinePermMedia
              data-tip
              data-for="mediaTip"
              className='post-btn'
              onClick={handleClick}
            />
            <ReactTooltip id="mediaTip" place="top" effect="solid">
              Add Media
            </ReactTooltip>
      <input type="file"
             ref={hiddenFileInput}
             onChange={handleChange}
             style={{display:'none'}} 
      /> 
    </>
  );
};
export default MediaFileUploader;