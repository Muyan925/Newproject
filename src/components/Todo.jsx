import React, { useEffect, useRef, useState, useCallback } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Webcam from "react-webcam";
import { addPhoto, deletePhoto, GetPhotoSrc } from "../db.jsx";
import SendSMS from "../SendSMS.jsx";
import GoogleMap from "../GoogleMap.jsx"; // Import GoogleMap component

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [showMap, setShowMap] = useState(false); // State to track map visibility
  
  
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(isEditing);

  const [showSMSForm, setShowSMSForm] = useState(false);

  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      setLng(longitude);
      setLat(latitude);
      console.log("Latitude: " + latitude + ", Longitude: " + longitude);
      // 这里你可以进一步处理获取到的位置信息
    }, function(error) {
      console.error("Error getting geolocation:", error);
    });
  }, []);

  const toggleSMSForm = () => {
    setShowSMSForm(!showSMSForm);
  };

  const toggleMap = () => {
    setShowMap(!showMap); // Toggle map visibility
  };

  function handleChange(event) {
    setNewName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
         <span style={{color: "#00f"}} onClick={() => { setShowMap(show => !show) }}> (map) </span>
{/* Toggle map visibility on click */}
          &nbsp; | &nbsp;
       
          <a style={{color: "#00f"}} onClick={toggleSMSForm}>
            (sms)
          </a>
          {showSMSForm && <SendSMS closePopup={toggleSMSForm} />}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setEditing(true);
          }}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <Popup trigger={<button type="button" className="btn"> Take Photo </button>} modal>
          <div>
            <WebcamCapture id={props.id} photoedTask={props.photoedTask} />
          </div>
        </Popup>

        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>

        <Popup trigger={<button type="button" className="btn"> View Photo </button>} modal>
          <div>
            <ViewPhoto id={props.id} alt={props.name} />
          </div>
        </Popup>
      </div>
    </div>
  );

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    } else if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  return (
    <li className="todo">
      {isEditing ? editingTemplate : viewTemplate}
      {/* Pass showMap state to GoogleMap component */}
      <GoogleMap taskId={props.id
      } latitude={lat} longitude={lng} showMap={showMap} />

    </li>
  );
}

const WebcamCapture = (props) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgId, setImgId] = useState(null);
  const [photoSave, setPhotoSave] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (photoSave) {
      console.log("useEffect detected photoSave");
      props.photoedTask(imgId);
      setPhotoSave(false);
    }
  });

  const capture = useCallback((id) => {
    if (!webcamRef.current) {
      setErrorMessage("Webcam not available");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setErrorMessage("Failed to capture image");
      return;
    }

    setImgSrc(imageSrc);
    console.log("capture", imageSrc.length, id);
  }, [webcamRef, setImgSrc]);

  const savePhoto = (id, imgSrc) => {
    if (!imgSrc) {
      setErrorMessage("No image to save");
      return;
    }
     // Check if there's already a photo in localStorage for the given id
  const existingPhoto = localStorage.getItem(`photo_${id}`);

  if (existingPhoto) {
    const overwriteConfirmed = window.confirm("A photo already exists for this task. Do you want to overwrite it?");
    if (!overwriteConfirmed) {
      return; // User cancelled, do not save the new photo
    }
  }

    console.log("savePhoto", imgSrc.length, id);
    addPhoto(id, imgSrc);
    localStorage.setItem(`photo_${id}`, imgSrc);
    setImgId(id);
    setPhotoSave(true);
      // Check if the photo is successfully saved to localStorage
  const savedPhoto = localStorage.getItem(`photo_${id}`);
  if (savedPhoto === imgSrc) {
    // If the saved photo matches the captured photo, display a success message
    window.alert("Photo saved successfully");
  } else {
    // If the saved photo does not match the captured photo, display an error message
    window.alert("Failed to save photo");
  }
  };
  

  const cancelPhoto = () => { // 修改 cancelPhoto 函数
    if (webcamRef.current) {
      webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
    }
    setImgSrc(null);
    setImgId(null);
    setErrorMessage("");
    setPhotoSave(false); // 设置为未保存照片状态
    
  };

  const returnToHomePage = () => {
    window.location.href = '/'; // Redirect to homepage
  };

  return (
    <>
      {errorMessage && <p>{errorMessage}</p>}
      {!imgSrc && <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />}
      {imgSrc && <img src={imgSrc} />}
      <div className="btn-group">
        {!imgSrc && (
          <button type="button" className="btn" onClick={() => capture(props.id)}>
            Capture photo
          </button>
        )}
        {imgSrc && (
          <>
            <button type="button" className="btn" onClick={() => savePhoto(props.id, imgSrc)}>
              Save Photo
            </button>
            <button type="button" className="btn todo-cancel" onClick={cancelPhoto}> {/* 修改取消按钮的点击事件 */}
              Cancel
            </button>
          </>
        )}
        <button type="button" className="btn" onClick={returnToHomePage}>
          Return to Home
        </button>
      </div>
    </>
  );
};

const ViewPhoto = (props) => {
  const [photoDeleted, setPhotoDeleted] = useState(false); 
  const photoSrc = localStorage.getItem(`photo_${props.id}`);

  const handleDeletePhoto = () => {
    if (photoSrc) {
      // 删除 localStorage 中的照片
      localStorage.removeItem(`photo_${props.id}`);
      deletePhoto(props.id);
      setPhotoDeleted(true); 
    } else {
      // 如果照片不存在，则直接显示删除失败的弹窗
      window.alert("Delete failed: Photo not found");
    }
  };

  const returnToHomePage = () => {
    window.location.href = '/'; // Redirect to homepage
  };

  useEffect(() => {
    // 如果照片成功删除，则显示删除成功的弹窗，并且直接进入 "Photo not found" 的提示
    if (photoDeleted) {
      window.alert("Photo deleted successfully");
    }
  }, [photoDeleted]);

  if (photoSrc == null) {
    return (
      <div style={{ margin: 'auto' }}>
        <p>Photo not found</p>
      </div>
    );
  } else {
    return (
      <div className="photo-container">
        <img src={photoSrc} alt={props.name} className="photo" />
        <br />
        <button
          type="button"
          className="btn btn__danger"
          onClick={handleDeletePhoto}
        >
          Delete Photo
        </button>
        <button
          type="button"
          className="btn"
          onClick={returnToHomePage}
        >
          Return to Home
        </button>
      </div>
    );
  }
};

export default Todo;
