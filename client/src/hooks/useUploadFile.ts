import { ChangeEvent, useEffect, useRef, useState } from "react";
import { LOCAL_STORAGE } from "../config/constants";
import settings from "../config/settings";

export default function useUploadFile() {
  const [image, setImage] = useState<string | undefined>();
  const [video, setVideo] = useState<string | undefined>();
  const [imageSrc, setImageSrc] = useState<Blob | File | string>("");
  const [videoSrc, setVideoSrc] = useState<Blob | File | string>("");

  const videoRef = useRef<HTMLInputElement>();
  const imageRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const _getCustomer = localStorage.getItem(LOCAL_STORAGE.bookingData);
    if (_getCustomer) {
      const _customer = JSON.parse(_getCustomer);

      if (_customer.vehicleFaultImg) setImage(`${settings.api.customerBaseURL}/${_customer.vehicleFaultImg}`);
      if (_customer.vehicleFaultVideo) setVideo(`${settings.api.customerBaseURL}/${_customer.vehicleFaultVideo}`);
    }
  }, []);

  const resetVideo = () => {
    if (undefined !== videoRef.current) {
      videoRef.current.value = "";
    }
    setVideo("");
  };

  const resetImage = () => {
    if (undefined !== imageRef.current) {
      imageRef.current.value = "";
    }
    setImage("");
  };

  const handleUploadVideo = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;

    if (!files?.length) return;

    const file = files[0];
    setVideoSrc(file);
    const url = URL.createObjectURL(file);
    setVideo(url);
  };

  const handleUploadImage = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;

    if (!files?.length) return;

    const file = files[0];
    setImageSrc(file);

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return {
    handleUploadVideo,
    handleUploadImage,
    image,
    video,
    imageSrc,
    videoSrc,
    resetVideo,
    resetImage,
    imageRef,
    videoRef,
    setVideoSrc,
    setImageSrc,
    height: 50,
    width: 50,
  };
}
