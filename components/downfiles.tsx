'use client'
import React, { useState, useEffect } from 'react'

interface File {
    id: string;
    actualname: string;
    filetype: string;
    date: string;
    fsize:string;
}

function Downfile({ id, upd, num, spd, refresh }: { id: string, upd: (nu: number) => void, num: number, spd: (nui: number) => void, refresh: number }) {
    const [get, setget] = useState<number>(0);
    const [filelist, setfilelist] = useState<File[]>([]);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [progress, setprogress] = useState<number>(0);
    const [selectedfordownload, setdown] = useState<File>();
    const [fidforshare, setfidforshare] = useState<File[]>([]);
    const [dsuccess, setdsuccess] = useState<boolean>(false);
    const [femail, setfemail] = useState<string>("");
    useEffect(() => {
        const fetchData = async () => {
            const fd = new FormData();
            console.log("id is ", id);
            fd.append("user_id", id);
            const res: Response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-files`, { method: "POST", body: fd });
            if (res.status === 200) {
                const data = await res.json();
                if (data != null) {
                    console.log("ommm");
                    const x = data.files as File[];
                    const hh:number = parseFloat(data.size);
                    upd(hh);
                    console.log(data)
                    setfilelist(x || []);
                } else {
                    setfilelist([]);
                    console.log("poda");
                }
            }
        };
        fetchData();
    }, [get,id,num,upd,refresh]);

    async function startDownload(element: File) {
        const Ff = new FormData();
        setdown(element);
        Ff.append("fileid", element.id);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/download`, { method: "POST", body: Ff });

        if (!response.ok) {
            alert("Failed to download file");
            setDownloading(false);
            return;
        }
        
        setDownloading(true);
        const start = performance.now()
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
        const end = performance.now()
        const ans = end - start;
        const speed = (parseFloat(element.fsize)*1024*1024 / (ans / 1000) / (1024 * 1024)).toFixed(2);
        spd(parseFloat(speed));
    }

    useEffect(() => {
        if (dsuccess) {
            const timer = setTimeout(() => {
                setdsuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [dsuccess,id]);
    async function deletefile(fileid:string) {
        const fd = new FormData();
        fd.append("file_id",fileid);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/deletefile`,{method:"POST",body:fd});
        console.log(res.ok ? "success" : "not deleted");
        if(res.ok){
            setget((pr)=>pr+1);
        }
    }

    async function startshare() {
        async function share(file_id: string, fname: string) {
            const fd = new FormData();
            fd.append("fmail", fname);
            fd.append("file_id", file_id);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/share`, { method: "POST", body: fd });
            console.log(res.ok ? "success" : "not shared");
            if (res.ok) {
                const successMessage = document.createElement("div");
                successMessage.className = "alert alert-success";
                successMessage.innerText = "File shared successfully.";
                document.body.appendChild(successMessage);
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 5000);
            }else{
                const successMessage = document.createElement("div");
                successMessage.className = "alert alert-error";
                successMessage.innerText = "sharing failed.";
                document.body.appendChild(successMessage);
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 5000);
            }
        }

        if (fidforshare.length > 0 && femail) {
            for (const element of fidforshare) {
                await share(element.id, femail);
            }
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
                <button className="btn btn-active btn-info" onClick={() => setget(prev => prev + 1)}>Refresh</button>
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
                                <td>{element.actualname+"."+element.filetype}</td>
                                <td>{element.date}</td>
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
                                <td>
                                    <button className="btn btn-error" onClick={()=>{deletefile(element.id)}}>Delete</button>
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
                        type="text"
                        placeholder="Enter Mail"
                        className="input input-bordered input-primary w-full max-w-xs" 
                        value={femail} 
                        onChange={(e) => setfemail(e.target.value)} 
                        required 
                        />
                        <button type="button" onClick={startshare} className="btn btn-outline btn-secondary">Share</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Downfile;
