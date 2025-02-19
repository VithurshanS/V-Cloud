// import { NextResponse } from 'next/server';
// import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// function UploadFile({id}:{id:string}){
//     const [file, setFile] = useState<File | null>(null);
//     //const [uuid, setUuid] = useState<string>();
//     const [uploaded, setUploaded] = useState<number>(0);
//     const [total, setTotal] = useState<number>(0);
//     const [progress, setProgress] = useState<number>(0);
//     const packet_size = 1024 * 1024;

//     useEffect(() => {
//         if (total > 0) {
//             setProgress((uploaded / total) * 100);
//         }
//     }, [uploaded, total]);

//     function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
//         if (event.target.files) {
//             setFile(event.target.files[0]);
//         }
//     }

//     async function uploadPacket(file: Blob, packet_index: number, total_packets: number,uuidd:string) {
//         const fd = new FormData();
//         fd.append("file", file);
//         fd.append("packet_index", String(packet_index));
//         fd.append("uuid",uuidd);
//         // fd.append("total", String(total_packets));
//         const res: Response = await fetch(`https://backend.shancloudservice.com/upload`, {
//             method: 'POST',
//             body: fd
//         });
//         if (res.status === 200) {
//             setUploaded((prev) => prev + 1);
//         }
//     }

//     async function upload() {
//         if (!file) {
//             return;
//         }
//         const total_packets = Math.ceil(file.size / packet_size);
//         setTotal(total_packets);
//         const newUuid =uuidv4();
//         //setUuid(newUuid);
//         const init_up_data = new FormData();

//         init_up_data.append("uuid",newUuid);
//         console.log("upload init");
//         await fetch(`https://backend.shancloudservice.com/init-upload`, {
//                     method: 'POST',
//                     body: init_up_data
//                 });
//         for (let i = 0; i < total_packets; i++) {
//             const start = i * packet_size;
//             const end = Math.min(start + packet_size, file.size);
//             const packet = file.slice(start, end);
//             await uploadPacket(packet, i, total_packets,newUuid);
//         }
//         const ss = new FormData();
//         ss.append("filename", file.name);
//         ss.append("uuid",newUuid);
//         ss.append("user_id",id);
//         await fetch(`https://backend.shancloudservice.com/complete-upload`, { method: "POST", body: ss });
//         setUploaded(0);
//         setTotal(0);
        
//     }

//     async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
//         event.preventDefault();
//         await upload();
//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input type="file" onChange={handleFileChange} required />
//                 <button className="btn btn-outline btn-secondary" type="submit">Upload</button>
//             </form>
//             <div>
//                 <progress className="progress progress-success w-56" value={progress} max="100"></progress>
//             </div>
//         </div>
        
//     );
// };

// export default UploadFile
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function UploadFile({id}:{id:string}){
    const [file, setFile] = useState<File | null>(null);
    const [uploaded, setUploaded] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const packet_size = 1024*1024;

    useEffect(() => {
        if (total > 0) {
            setProgress((uploaded / total) * 100);
        }
    }, [id,uploaded, total]);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    }

    async function uploadPacket(file: Blob, packet_index: number, total_packets: number, uuidd:string) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("packet_index", String(packet_index));
        fd.append("uuid", uuidd);
        const res: Response = await fetch(`https://backend.shancloudservice.com/upload`, {
            method: 'POST',
            body: fd
        });
        if (res.status === 200) {
            setUploaded((prev) => prev + 1);
        }
    }

    async function upload() {
        if (!file) return;
        
        const total_packets = Math.ceil(file.size / packet_size);
        setTotal(total_packets);
        const newUuid = uuidv4();
        
        const init_up_data = new FormData();
        init_up_data.append("uuid", newUuid);
        
        await fetch(`https://backend.shancloudservice.com/init-upload`, {
            method: 'POST',
            body: init_up_data
        });

        for (let i = 0; i < total_packets; i++) {
            const start = i * packet_size;
            const end = Math.min(start + packet_size, file.size);
            const packet = file.slice(start, end);
            await uploadPacket(packet, i, total_packets, newUuid);
        }

        const ss = new FormData();
        ss.append("filename", file.name);
        ss.append("uuid", newUuid);
        ss.append("user_id", id);
        await fetch(`https://backend.shancloudservice.com/complete-upload`, { 
            method: "POST", 
            body: ss 
        });
        
        setUploaded(0);
        setTotal(0);
        setFile(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        await upload();
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                    ? 'border-primary bg-primary/10' 
                    : 'border-base-content/20 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    />
                    <p className="text-sm text-base-content/70">
                        or drag and drop your file here
                    </p>

                    {file && (
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-semibold">Selected file:</span> {file.name}
                            </div>
                            
                            {progress > 0 && progress < 100 && (
                                <div className="w-full">
                                    <progress 
                                        className="progress progress-primary w-full" 
                                        value={progress} 
                                        max="100"
                                    ></progress>
                                    <p className="text-xs text-base-content/70 mt-1">
                                        {progress.toFixed(0)}% uploaded
                                    </p>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className="btn btn-primary w-full"
                                disabled={progress > 0 && progress < 100}
                            >
                                {progress > 0 && progress < 100 
                                    ? <span className="loading loading-spinner"></span>
                                    : 'Upload File'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default UploadFile;

