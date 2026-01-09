import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import type { FormEvent } from 'react';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdfToImage';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '~/constants';


const Upload = () => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    const handleFileSelect = (file: File | null) => {
        setFile(file);

    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobDescription: string, jobTitle: string, file: File }) => {
        setIsProcessing(true);
        setStatusText('Uploading your file...');

        const uploadedFile = await fs.upload([file]);

        //if no file is uploaded 
        if (!uploadedFile) return setStatusText('Failed to upload file');

        setStatusText('Converting to image ...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile) return setStatusText('Failed to convert pdf to image');

        setStatusText('Uploading image ...');

        const uploadedImage = await fs.upload([imageFile]);

        if (!uploadedImage) return setStatusText('Failed to upload image');

        setStatusText('Preparing your resume...');

        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));
        setStatusText('Analyzing your resume...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription, }),

        );
        if (!feedback) return setStatusText('Failed to analyze your resume');

        const feedbackText = typeof feedback.message.content === "string" ? feedback.message.content : feedback.message.content[0].text;
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting.. ');
        console.log(data);

    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return; // if the form doesnt exist return nothing
        const formData = new FormData(form); // if it does exist return the form in a variable called form data
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });

    }
    return (
        <main className=" bg-[url('/images/bg-main.svg')] ">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Get Intelligent feedback for your dream Job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className='w-full' alt="" />
                        </>
                    ) : (<>
                        <h2>Drop your Resume for an ATS score and improvement tips</h2>
                    </>)}

                    {!isProcessing &&
                        (
                            <form action="" id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>

                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name='company-name' placeholder='Company Name' id="company-name" />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name='job-title' placeholder='Job Title' id="job-title" />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea name="job-description" id="job-description" placeholder="Job Description"></textarea>
                                </div>

                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <button className='primary-button' type='submit'>Analyze Resume</button>
                            </form>
                        )}
                </div>

            </section>

        </main>
    )
}

export default Upload