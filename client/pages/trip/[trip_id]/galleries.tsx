import Layout from "@/components/common/Layout";
import LayoutGrid from "@/components/ui/layout-grid";
import { imageServer } from "@/lib/const";
import { useEffect, useState } from "react";

export default function galleries() {
    const [cards, setCards] = useState([]);
    useEffect(() => {
        const user_id = '671a2e6ddbc951827deda3ff';
        const album_id = '671a2e6ddbc';
        fetch(`${imageServer}/images?user_id=${user_id}&album_id=${album_id}`)
        .then(res => res.json())
        .then(data => {
            setCards(cs => {
                return data?.images?.map((d:string, i:number) => {
                    return {
                        id: i,
                        content: "",
                        className: "",
                        thumbnail: imageServer + "/" + d,
                    }
                }) || [];
            })
        }).catch(err => {
            console.log(err);
        });
    }, []);

  return (
    <Layout>
        <LayoutGrid cards={[
            {
                type: 'add',
                className: "",
                thumbnail: "",
                content: "",
                id: 0
            },
            ...cards
        ]}/>
    </Layout>
  )
}
