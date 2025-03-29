// utils/imageCompressor.js
export const compressToUnder1MB = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size <= 1000000) { // 1MB in bytes
        resolve(file);
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 1200; // Maximum width for compressed image
          const MAX_HEIGHT = 1200; // Maximum height for compressed image
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Progressive quality adjustment to ensure under 1MB
          const compressWithQuality = (quality) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Compression failed'));
                  return;
                }
  
                if (blob.size > 1000000) {
                  // Try again with lower quality if still too large
                  if (quality > 0.5) {
                    compressWithQuality(quality - 0.1);
                  } else {
                    reject(new Error('Image could not be compressed below 1MB'));
                  }
                } else {
                  resolve(new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  }));
                }
              },
              'image/jpeg',
              quality
            );
          };
  
          // Start with 0.8 quality (80%)
          compressWithQuality(0.8);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };