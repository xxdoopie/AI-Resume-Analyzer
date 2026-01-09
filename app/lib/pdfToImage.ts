
export async function convertPdfToImage(file: File): Promise<File> {
    const pdfjsLib = await import('pdfjs-dist');
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;

    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

    try {
        // 1. Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // 2. Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        // 3. Get the first page
        const page = await pdf.getPage(1);

        // 4. Determine scale/viewport
        const scale = 1.5; // Enhance resolution slightly
        const viewport = page.getViewport({ scale });

        // 5. Create a canvas to render
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Could not get canvas context');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // 6. Render the page into the canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        // Suppress TS error about missing 'canvas' property which might be required in types but redundant with canvasContext
        await page.render(renderContext as any).promise;

        // 7. Convert canvas to Blob/File
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas to Blob conversion failed'));
                    return;
                }
                // Create a new File from the blob
                const imageFile = new File([blob], file.name.replace('.pdf', '.png'), {
                    type: 'image/png',
                    lastModified: Date.now(),
                });
                resolve(imageFile);
            }, 'image/png');
        });
    } catch (error) {
        console.error('Error converting PDF to image:', error);
        throw error;
    }
}
