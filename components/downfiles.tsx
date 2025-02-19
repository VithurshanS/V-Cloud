'use client'
import React, { useState, useEffect } from 'react'

interface File {
    id: string;
    actualname: string;
    filetype: string;
    date: string;
}

function Downfile({ id }: { id: string }) {
    const [get, setget] = useState<number>(0);
    const [filelist, setfilelist] = useState<File[]>([]);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [progress, setprogress] = useState<number>(0);
    const [selectedfordownload,setdown] = useState<File>();
    const [fidforshare, setfidforshare] = useState<File[]>([]);
    const [dsuccess, setdsuccess] = useState<boolean>(false);
    const [femail, setfemail] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const fd = new FormData();
            console.log("id is ", id);
            fd.append("user_id", id);
            const res: Response = await fetch(`https://backend.shancloudservice.com/get-files`, { method: "POST", body: fd });
            if (res.status === 200) {
                const data = await res.json();
                if (data != null) {
                    console.log("ommm");
                    const x = data.files as File[];
                    setfilelist(x || []);
                } else {
                    setfilelist([]);
                    console.log("poda");
                }
            }
        };
        fetchData();
    }, [get,id]);

    async function startDownload(element: File) {
        const Ff = new FormData();
        setdown(element);
        Ff.append("fileid", element.id);
        const response = await fetch(`https://backend.shancloudservice.com/download`, { method: "POST", body: Ff });

        if (!response.ok) {
            alert("Failed to download file");
            setDownloading(false);
            return;
        }
        
        setDownloading(true);
        const sizeoffile = response.headers.get("Content-Length") ? parseFloat(response.headers.get("Content-Length") as string) : null;
        const reader = response.body?.getReader();
        let received = 0;
        const packets = [];

        while (true && reader != null) {
            const { done, value } = await reader.read();
            if (done) break;
            packets.push(value);
            received += value.length;
            if (sizeoffile != null) setprogress(Math.round((received / sizeoffile) * 100));
        }
        setdsuccess(true);
        const tempB = new Blob(packets);
        const downurl = URL.createObjectURL(tempB);
        const link = document.createElement("a");
        link.href = downurl;
        link.download = `${element.actualname}.${element.filetype}`;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(downurl);
        setDownloading(false);
    }

    useEffect(() => {
        if (dsuccess) {
            const timer = setTimeout(() => {
                setdsuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [dsuccess,id]);

    async function startshare() {
        async function share(file_id: string, fname: string) {
            const fd = new FormData();
            fd.append("fmail", fname);
            fd.append("file_id", file_id);
            const res = await fetch(`https://backend.shancloudservice.com/share`, { method: "POST", body: fd });
            console.log(res.ok ? "success" : "not shared");
        }

        if (fidforshare.length > 0 && femail) {
            fidforshare.forEach(element => share(element.id, femail));
        }
    }

    return (
        <div>
            <div>{dsuccess?<div className="toast toast-top toast-center">
  <div className="alert alert-success">
    <span>File downloaded successfully.</span> 
  </div>
</div>:null}</div>
            <div>
                <button onClick={() => setget(prev => prev + 1)}>Get Files</button>
            </div>
            <div className='overflow-x-auto'>
                <table className='table table-zebra'>
                    <tbody>
                        {filelist.length !== 0 ? filelist.map((element, index) => (
                            <tr key={index}>
                                <td>
                                <input 
                                    type="checkbox" 
                                    checked={fidforshare.some(f => f.id === element.id)}
                                    onChange={() => setfidforshare(prev => 
                                        prev.some(f => f.id === element.id) 
                                            ? prev.filter(f => f.id !== element.id) 
                                            : [...prev, element]
                                    )}
                                />
                                </td>
                                <td>{element.actualname}</td>
                                <td>
                                {downloading && progress > 0 && selectedfordownload?.id === element.id ? (
                                    <div className="radial-progress text-primary" style={{ "--value": `${progress}` } as React.CSSProperties} role="progressbar">
                                    {Math.round(progress)}
                                  </div>
                                ) : (
                                    <button id={index.toString()} className="btn btn-outline btn-success" onClick={() => startDownload(element)} disabled={downloading}>
                                        Download
                                    </button>
                                )}
                                </td>
                           
                            </tr>
                        )) : null}
                    </tbody>
                </table>
            </div>
            {/* <div className='my-10'>
                {downloading ? `Downloaded ${progress} %` : null}
            </div> */}
            {fidforshare.length > 0 && (
                <div>
                    <form>
                        <input 
                            type="email" 
                            placeholder="Enter email" 
                            value={femail} 
                            onChange={(e) => setfemail(e.target.value)} 
                            required 
                        />
                        <button type="button" onClick={startshare}>Share</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Downfile;


// 'use client';

// import React, { useState, useEffect } from 'react';

// interface File {
//     id: string;
//     actualname: string;
//     filetype: string;
//     date: string;
// }

// function Downfile({ id }: { id: string }) {
//     const [filelist, setFilelist] = useState<File[]>([]);
//     const [downloading, setDownloading] = useState<boolean>(false);
//     const [progress, setProgress] = useState<number>(0);
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [email, setEmail] = useState<string>("");

//     useEffect(() => {
//         fetchFiles();
//     }, [id]);

//     const fetchFiles = async () => {
//         try {
//             const fd = new FormData();
//             fd.append("user_id", id);
//             const res = await fetch(`https://backend.shancloudservice.com/get-files`, {
//                 method: "POST",
//                 body: fd
//             });
//             if (res.ok) {
//                 const data = await res.json();
//                 setFilelist(data.files || []);
//             }
//         } catch (error) {
//             console.error("Error fetching files:", error);
//         }
//     };

//     const startDownload = async (file: File) => {
//         try {
//             setDownloading(true);
//             const fd = new FormData();
//             fd.append("fileid", file.id);
//             const response = await fetch(`https://backend.shancloudservice.com/download`, {
//                 method: "POST",
//                 body: fd
//             });

//             if (!response.ok) {
//                 alert("Failed to download file");
//                 setDownloading(false);
//                 return;
//             }

//             const size = parseFloat(response.headers.get("Content-Length") || "0");
//             const reader = response.body?.getReader();
//             let received = 0;
//             const chunks = [];

//             while (true && reader) {
//                 const { done, value } = await reader.read();
//                 if (done) break;
//                 chunks.push(value);
//                 received += value.length;
//                 if (size) setProgress(Math.round((received / size) * 100));
//             }

//             const blob = new Blob(chunks);
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.download = `${file.actualname}.${file.filetype}`;
//             document.body.appendChild(link);
//             link.click();
//             URL.revokeObjectURL(url);
//             setDownloading(false);
//         } catch (error) {
//             console.error("Download error:", error);
//             setDownloading(false);
//         }
//     };

//     const handleShare = async () => {
//         if (!email || selectedFiles.length === 0) return;
//         selectedFiles.forEach(async (file) => {
//             try {
//                 const fd = new FormData();
//                 fd.append("fmail", email);
//                 fd.append("file_id", file.id);
//                 const res = await fetch(`https://backend.shancloudservice.com/share`, {
//                     method: "POST",
//                     body: fd
//                 });
//                 if (res.ok) console.log("Shared successfully");
//             } catch (error) {
//                 console.error("Sharing error:", error);
//             }
//         });
//     };

//     return (
//         <div className="p-4">
//             <button className="btn btn-primary mb-4" onClick={fetchFiles}>Refresh Files</button>
//             {downloading && <p>Downloading... {progress}%</p>}

//             {filelist.length > 0 ? (
//                 <table className="table w-full">
//                     <thead>
//                         <tr>
//                             <th>Select</th>
//                             <th>Name</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filelist.map((file) => (
//                             <tr key={file.id}>
//                                 <td>
//                                     <input 
//                                         type="checkbox" 
//                                         checked={selectedFiles.includes(file)}
//                                         onChange={() => setSelectedFiles(prev => prev.includes(file) 
//                                             ? prev.filter(f => f.id !== file.id) 
//                                             : [...prev, file])} 
//                                     />
//                                 </td>
//                                 <td>{file.actualname}.{file.filetype}</td>
//                                 <td>
//                                     <button className="btn btn-sm btn-primary" onClick={() => startDownload(file)}>
//                                         Download
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p>No files available</p>
//             )}
            
//             {selectedFiles.length > 0 && (
//                 <div className="mt-4">
//                     <input 
//                         type="email" 
//                         placeholder="Enter email" 
//                         value={email} 
//                         onChange={(e) => setEmail(e.target.value)} 
//                         className="input input-bordered"
//                     />
//                     <button className="btn btn-sm btn-secondary ml-2" onClick={handleShare}>
//                         Share
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Downfile;
