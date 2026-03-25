// Lazy load images (for large images or deferred loading)
const imageModulesAsync = import.meta.glob<{ default: string }>('/src/assets/images/*.{jpg,jpeg,png,webp,svg}', {
  eager: false,
})

/**
 * Asynchronously load an image (useful for large images or deferred loading)
 * @param name - Image filename (e.g., 'large-photo.jpg')
 * @returns Promise resolving to image URL or empty string
 */
export async function getImageAsync(name: string): Promise<string> {
  const key = Object.keys(imageModulesAsync).find((path) => path.endsWith(`/${name}`))
  if (!key) {
    if (import.meta.env.DEV) {
      console.warn(`[getImageAsync] Image not found: ${name}`)
    }
    return ''
  }

  const module = await imageModulesAsync[key]()
  return module.default
}

/**
 * Get all images as a key-value map (useful for galleries)
 * @returns Promise resolving to Record of filename (without extension) to image URL
 */
export async function getAllImagesAsync(): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(imageModulesAsync).map(async ([path, moduleLoader]) => {
      const fileName =
        path
          .split('/')
          .pop()
          ?.replace(/\.[^.]+$/, '') || ''
      const module = await moduleLoader()
      return [fileName, module.default]
    }),
  )
  return Object.fromEntries(entries)
}

// Example usage in a React component (Gallery)
// import { getAllImagesAsync } from '@/lib/imageAsync'
// function ImageGallery() {
//   const [images, setImages] = useState<Record<string, string>>({})
//   useEffect(() => {
//     getAllImagesAsync().then(setImages)
//   }, [])
//   const images = getAllImagesAsync()
//
//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {Object.entries(images).map(([name, url]) => (
//         <img key={name} src={url} alt={name} className="w-full h-auto" />
//       ))}
//     </div>
//   )
// }
