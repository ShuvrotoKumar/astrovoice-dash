// Function to get the base API URL
// export const url = "http://10.10.20.57:8001/api/v1/";
// export const pdfUrl = "http://10.10.20.57:8001";
// export const imageUrl = "http://10.10.20.57:8001/uploads";

export const url = "https://megy-ai-backend.onrender.com/api/v1/";
export const pdfUrl = "https://megy-ai-backend.onrender.com";
export const imageUrl = "https://megy-ai-backend.onrender.com/uploads";

export const getBaseUrl = () => {
  return url;
};

export const getImageBaseUrl = () => {
  return imageUrl;
};

export const getPDFUrl = () => {
  return pdfUrl;
};

export const getImageUrl = (imagePath) => {
  if (imagePath.includes("https")) {
    return imagePath;
  }
  return `${imageUrl}${imagePath}`;
};
