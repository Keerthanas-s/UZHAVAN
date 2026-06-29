import { useState } from "react";

export default function useImageUpload() {

    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState("");

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

        setPreview(URL.createObjectURL(file));

    };

    const clearImage = () => {

        setImage(null);

        setPreview("");

    };

    return {

        image,

        preview,

        handleImageChange,

        clearImage

    };

}