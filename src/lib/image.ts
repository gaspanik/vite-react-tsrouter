// Eagerly load all images from /src/assets/images/
const imageModules = import.meta.glob<{ default: string }>('/src/assets/images/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
})

/**
 * Get image by name (with or without file extension)
 * @param name - Image name (e.g., 'portrait.jpg' or 'portrait')
 * @returns Image URL or empty string if not found
 */
export function getImage(name: string): string {
  // Try with full filename (including extension)
  const withExt = Object.keys(imageModules).find((path) => path.endsWith(`/${name}`))
  if (withExt) return imageModules[withExt].default

  // Try without extension (auto-detect: portrait → portrait.jpg)
  const match = Object.keys(imageModules).find((path) => path.match(new RegExp(`/${name}\\.(jpg|jpeg|png|webp|svg)$`)))
  if (!match && import.meta.env.DEV) {
    console.warn(`[getImage] Image not found: ${name}`)
  }
  return match ? imageModules[match].default : ''
}

// Example usage in a React component
// import { getImage } from '@/lib/image'
// function Index() {
//   return (
//     <main>
//       {/* ...existing code... */}
//
//       {/* Portrait aside */}
//       <aside>
//         <img
//           src={getImage('portrait.jpg')}
//           alt="Portrait"
//         />
//       </aside>
//     </main>
//   )
// }

/**
 * Get all images as a key-value map (useful for galleries)
 * @returns Record of filename (without extension) to image URL
 */
export function getAllImages(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(imageModules).map(([path, module]) => {
      const fileName =
        path
          .split('/')
          .pop()
          ?.replace(/\.[^.]+$/, '') || ''
      return [fileName, module.default]
    }),
  )
}

// Example usage in a React component (Gallery)
// import { getAllImages } from '@/lib/image'
// function ImageGallery() {
//   const images = getAllImages()
//
//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {Object.entries(images).map(([name, url]) => (
//         <img key={name} src={url} alt={name} className="w-full h-auto" />
//       ))}
//     </div>
//   )
// }
