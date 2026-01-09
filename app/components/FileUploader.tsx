import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] || null;
        setFile(selectedFile);
        onFileSelect?.(selectedFile);
    }, [onFileSelect])

    const MAX_SIZE = 20 * 1024 * 1024;

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: MAX_SIZE,

    })

    return (

        <div className="w-full gradient-border">

            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">



                    {file ? (
                        <div className='uploader-selected-file' onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className='size-10' />
                            <div className="flex items-center justify-center flex-col p-5 text-center">

                                <div>
                                    <p className="font-medium text-sm truncate max-w-xs">{file.name}</p>
                                    <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                                </div>

                            </div>
                            <button type="button" className='p-2 cursor-pointer' onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                onFileSelect?.(null);
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className='w-4 h-4' />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className='mx-auto w-16 h-16 mb-3 flex items-center justify-center'>
                                <img src="/icons/info.svg" alt="upload" className='size-20' />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className='font-semibold'>Click to upload </span>
                                or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">PDF (max {formatSize(MAX_SIZE)})</p>

                        </div>

                    )}


                </div>
            </div>
        </div>
    )
}

export default FileUploader