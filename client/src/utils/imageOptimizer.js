export const optimizeCloudinaryUrl = (url, width = null) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    // Split URL to insert transformations
    const parts = url.split("/upload/");
    if (parts.length < 2) return url;

    let transformations = "f_auto,q_auto";
    if (width) {
        transformations += `,w_${width}`;
    }

    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export const optimizeUnsplashUrl = (url, width = 800) => {
    if (!url || !url.includes("unsplash.com")) return url;

    const baseUrl = url.split("?")[0];
    return `${baseUrl}?q=80&w=${width}&auto=format&fit=crop`;
};

export const getOptimizedUrl = (url, width = null) => {
    if (!url) return "";
    if (url.includes("cloudinary.com")) return optimizeCloudinaryUrl(url, width);
    if (url.includes("unsplash.com")) return optimizeUnsplashUrl(url, width);
    // S3 URLs are already optimized/static, just return as is
    return url;
};


