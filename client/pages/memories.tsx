import Layout from "@/components/common/Layout";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { imageServer } from "@/lib/const";
import { div } from "framer-motion/client";
import { Search } from "lucide-react";
import { useState } from "react";

const user_id = '671a2e6ddbc951827deda3ff';

function Memories() {
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const search = () => {
        if (!description.length) return;

        setLoading(true);
        fetch(imageServer + `/find_image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id,
                description
            })
        })
        .then(res => res.json())
        .then(data => {
            setImageUrl(imageServer + "/" + data?.image_path);
        }).catch(err => {
            console.log(err);
        }).finally(() => setLoading(false));
    }
  return (
    <Layout>
      <div className="py-6 px-4">
        <p className="text-2xl text-center">Memories Fade but</p>
        <h1 className="text-4xl font-bold text-center"> Pictures Don't</h1>
        <div className="flex justify-center items-center gap-4 mt-6">
            <Input
            type="search"
            name="search"
            placeholder="Find your memories..."
            className="max-w-xl w-full"
            onChange={(e) => setDescription(e.target.value)}
            />
            <Button className="shadow border" onClick={search} disabled={loading}><Search/></Button>
        </div>
      </div>

    {
        loading ? <Spinner/> : imageUrl && 
        <div className="p-8 rounded rotate-6 bg-white w-fit mx-auto mt-7">
            <img src={imageUrl} className="mx-auto max-w-[500px] w-full" />
        </div>
    }
    </Layout>
  );
}

export default Memories;
