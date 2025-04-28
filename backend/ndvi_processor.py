import os
import numpy as np
import rasterio
from rasterio.transform import from_origin
from skimage.filters import gaussian
from shapely.geometry import box
import traceback
from PIL import Image
import tifffile as tiff
from urllib.parse import urlparse


def read_multispectral_image(image_path):
    with rasterio.open(image_path) as src:
        image = src.read()
        meta = src.meta
    return image, meta


def align_images(ref_image, target_image):
    # Placeholder: assume pre-aligned
    return target_image


def reduce_noise(image, sigma=1):
    return gaussian(image, sigma=sigma, channel_axis=0)


def compute_ndvi(image, nir_index, red_index):
    nir = image[nir_index].astype(float)
    red = image[red_index].astype(float)
    ndvi = (nir - red) / (nir + red + 1e-10)
    return ndvi


def save_ndvi_as_tiff(ndvi_image, reference_image_path, output_folder="output", filename="ndvi_output.tiff"):
    os.makedirs(output_folder, exist_ok=True)
    with rasterio.open(reference_image_path) as src:
        meta = src.meta.copy()
        transform = src.transform
        crs = src.crs
        bounds = src.bounds

    meta.update({
        "count": 1,
        "dtype": "float32",
        "nodata": -9999,
    })

    output_path = os.path.join(output_folder, filename)

    with rasterio.open(output_path, "w", **meta) as dst:
        dst.write(ndvi_image.astype("float32"), 1)

    return output_path, bounds


def get_ndvi_stats(ndvi):
    valid_ndvi = ndvi[np.isfinite(ndvi)]
    return {
        "min": float(np.min(valid_ndvi)),
        "max": float(np.max(valid_ndvi)),
        "mean": float(np.mean(valid_ndvi)),
    }

def process_ndvi_pipeline(ref_image_path, target_image_path, nir_band_index, red_band_index):
    try:
        ref_image, ref_meta = read_multispectral_image(ref_image_path)
        target_image, _ = read_multispectral_image(target_image_path)

        aligned_img = align_images(ref_image, target_image)
        noise_reduced_img = reduce_noise(aligned_img)
        ndvi_final = compute_ndvi(noise_reduced_img, nir_band_index, red_band_index)

        ndvi_output_path, bounds = save_ndvi_as_tiff(ndvi_final, ref_image_path)
        stats = get_ndvi_stats(ndvi_final)

        extent = box(bounds.left, bounds.bottom, bounds.right, bounds.top)

        return {
            "ndvi_path": ndvi_output_path,
            "stats": stats,
            "extent": extent
        }

    except Exception as e:
        print("Error inside process_ndvi_pipeline:")
        traceback.print_exc()
        raise e  
    
def simple_tiff_to_jpeg(tiff_path, jpeg_path):
    """Safely convert complex TIFF to JPEG using tifffile + PIL."""
    # Read using tifffile
    img_array = tiff.imread(tiff_path)

    # Handle single-channel or multi-band TIFFs
    if img_array.ndim == 2:
        # Single-band (grayscale), duplicate into 3 channels
        img_array = np.stack([img_array]*3, axis=-1)
    elif img_array.shape[0] in [1, 3, 4]:  
        # (bands, H, W) → (H, W, bands)
        img_array = np.transpose(img_array, (1, 2, 0))

    # Normalize for display if needed
    if img_array.dtype != np.uint8:
        img_array = ((img_array - np.min(img_array)) / (np.max(img_array) - np.min(img_array)) * 255).astype(np.uint8)

    # Convert to PIL Image
    img = Image.fromarray(img_array[..., :3])  # Use first 3 bands

    img.save(jpeg_path, "JPEG", quality=95)

    
def extract_s3_key_from_url(url: str) -> str:
    """Given a full S3 URL, extract the S3 object key"""
    parsed = urlparse(url)
    return parsed.path.lstrip("/")
