class AssetManager {
  constructor() {
    this.images = {};
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }

  // Queue an image to load
  loadImage(key, src) {
    this.totalAssets++;
    const img = new Image();
    img.src = src;
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.images[key] = img;
        this.loadedAssets++;
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
  }

  // Helper to fetch loaded image
  getImage(key) {
    return this.images[key];
  }

  // Progress ratio from 0.0 to 1.0
  getProgress() {
    return this.totalAssets === 0 ? 1 : this.loadedAssets / this.totalAssets;
  }
}

export const assets = new AssetManager();